/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform, ToastAndroid } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const UART_SERVICE = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const UART_RX = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"; // Write
const UART_TX = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"; // Notify

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  onSendData: (data: string) => Promise<void>;
  onUpload: (data: string) => Promise<void>;
  connectedDevice: Device | null;
  allDevices: Device[];
  receiveData: string;
  setReceiveData: React.Dispatch<React.SetStateAction<string>>;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [receiveData, setReceiveData] = useState<string>("");

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device /*&& device.name?.includes("ML:bit")r*/) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);

      deviceConnection.onDisconnected((error, disconnectedDevice) => {
        if (error) {
          // console.log("Disconnect error:", error);
          return;
        }
        // console.log("Disconnected:", disconnectedDevice.id);
        setConnectedDevice(null);
        // setTimeout(async () => {
        //   console.log("Reconnecting...");
        //   try {
        //     await connectToDevice(disconnectedDevice);
        //   } catch (e) {
        //     console.log("Reconnect failed:", e);
        //     setConnectedDevice(null);
        //   }
        // }, 5000);
      });

      await deviceConnection.discoverAllServicesAndCharacteristics();

      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);

      // ToastAndroid.show(`Connected to ${device.name}`, ToastAndroid.SHORT);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
      ToastAndroid.show(`Failed to connect to ${device.name}`, ToastAndroid.SHORT);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  const onReceiveData = (error: BleError | null, characteristic: Characteristic | null) => {
    if (error) {
      console.log("Error receiving data:", error);
      return;
    }
    if (characteristic?.value) {
      const data = characteristic.value;
      const decodedData = base64.decode(data);

      setReceiveData(decodedData);
      console.log("Received data:", decodedData);
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        UART_SERVICE,
        UART_TX,
        onReceiveData
      );
    } else {
      console.log("No Device Connected");
    }
  };

  const sendLine = async (device: Device, line: string, chunkSize: number) => {
    line += "\n";
    for (let i = 0; i < line.length; i += chunkSize) {
      const chunk = line.substring(i, i + chunkSize);
      const encoded = base64.encode(chunk);
      await device.writeCharacteristicWithResponseForService(
        UART_SERVICE,
        UART_RX,
        encoded
      );
      await new Promise(res => setTimeout(res, 10));
    }
  };

  const onSendData = async (data: string) => {
    if (connectedDevice) {
      const mtuDevice = await connectedDevice.requestMTU(200).catch(() => connectedDevice);
      const mtu = mtuDevice.mtu ?? 23;
      const chunkSize = mtu - 3;

      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.substring(i, i + chunkSize);
        const encoded = base64.encode(chunk);

        await connectedDevice.writeCharacteristicWithResponseForService(
          UART_SERVICE,
          UART_RX,
          encoded
        );
        await new Promise(res => setTimeout(res, 10));
      }
    }
    else {
      console.log("No Device Connected");
      // ToastAndroid.show("No Device Connected", ToastAndroid.SHORT);
    }
  }

  const onUpload = async (data: string) => {
    if (connectedDevice) {
      const mtuDevice = await connectedDevice.requestMTU(200).catch(() => connectedDevice);
      const mtu = mtuDevice.mtu ?? 23;
      const chunkSize = mtu - 3;
      // console.log("Using MTU:", mtu, "Chunk size:", chunkSize);

      // send "upload" command first
      await sendLine(connectedDevice, "upload", chunkSize);
      // console.log("Sent command: upload");

      // then send the actual data
      const lines = data.split("\n").filter(line => line.trim() !== "");
      for (const line of lines) {
        await sendLine(connectedDevice, line, chunkSize);
      }

      // then send the CRC16 checksum
      const encoder = new TextEncoder();
      const uint8 = encoder.encode(lines.map(l => l + "\n").join(""));
      const crc = crc16ccitt(uint8);
      const crcHex = crc.toString(16).toUpperCase().padStart(4, "0");

      await sendLine(connectedDevice, `crc:${crcHex}`, chunkSize);
      // console.log(`Sent CRC: ${crcHex}`);

      // finally send "done" command
      await sendLine(connectedDevice, "done", chunkSize);
      // console.log("Sent command: done");

      // const lines = data.split("\n").filter(line => line.trim() !== "");
      // for (let line of lines) {
      //   line += "\n"
      //   for (let i = 0; i < line.length; i += chunkSize) {
      //     const chunk = line.substring(i, i + chunkSize);
        
      //     const encodedData = base64.encode(chunk);
      //     try {
      //       await connectedDevice.writeCharacteristicWithResponseForService(
      //         UART_SERVICE,
      //         UART_RX,
      //         encodedData
      //       );
      //       // console.log("Sent data:", line);
      //     } catch (e) {
      //       console.log("Failed to send data:", e);
      //     }
      //   }
      // }
    } else {
      console.log("No Device Connected");
      // ToastAndroid.show("No Device Connected", ToastAndroid.SHORT);
    }
  }

  function crc16ccitt(data: Uint8Array, crc = 0xFFFF): number {
    for (let byte of data) {
      crc ^= byte << 8;
      for (let i = 0; i < 8; i++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
        crc &= 0xFFFF;
      }
    }
    return crc;
  }

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    onSendData,
    onUpload,
    receiveData,
    setReceiveData
  };
}

export default useBLE;