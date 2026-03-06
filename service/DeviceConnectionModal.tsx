import React, { FC, useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Device } from "react-native-ble-plx";

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: Device[];
  visible: boolean;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const { item, connectToPeripheral, closeModal } = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);

  return (
    <TouchableOpacity
      onPress={connectAndCloseModal}
      style={styles.itemRow}
    >
      <Text style={styles.itemText}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

const DeviceModal: FC<DeviceModalProps> = (props) => {
  const { devices, visible, connectToPeripheral, closeModal } = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, connectToPeripheral]
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Tap on a device to connect</Text>

          <View style={{flex: 1, paddingVertical: 0,}}>
            <FlatList
                data={devices}
                renderItem={renderDeviceModalListItem}
            />
          </View>

          <View 
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
            }}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    paddingHorizontal: 30,
    width: '60%',
    height: '85%'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 10,
  },
  closeButton: {
    backgroundColor: '#aaa',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '25%',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: '#64b5f6',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: 'white',
  },
});

export default DeviceModal;