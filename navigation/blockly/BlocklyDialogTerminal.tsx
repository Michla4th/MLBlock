import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import Icon from 'react-native-vector-icons/Ionicons';

interface TerminalDialogProps {
  visible: boolean;
  onClose: () => void;
  onSendData: (data: string) => Promise<void>;
  onReceiveData: string;
  connectedDevice: Device | null,
  setReceiveData: React.Dispatch<React.SetStateAction<string>>;
}

type LogEntry = {
  type: "send" | "receive" | "system";
  message: string;
};

const BlocklyDialogTerminal: React.FC<TerminalDialogProps> = ({ 
  visible, 
  onClose, 
  onSendData, 
  onReceiveData, 
  connectedDevice,
  setReceiveData,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [logs, setLogs] = useState<LogEntry[]>([
    // { type: "system", message: "Connecting..." },
    // { type: "system", message: connectedDevice ? `Connected to ${connectedDevice.name}` : "No Device Connected" },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (connectedDevice) {
      setLogs((prev) => [
        ...prev, 
        { type: "system", message: `Connected to ${connectedDevice.name || connectedDevice.id}` }
      ]);
    } else {
      setLogs((prev) => [
        ...prev, 
        { type: "system", message: "No Device Connected" }
      ]);
    }
  }, [connectedDevice]);

  useEffect(() => {
    if (!onReceiveData) return;

    setLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      let lastLog = newLogs[newLogs.length - 1];

      // Nếu log cuối không phải receive thì tạo mới
      if (!lastLog || lastLog.type !== "receive") {
        lastLog = { type: "receive", message: "" };
        newLogs.push(lastLog);
      }

      // Xử lý chuỗi có thể chứa nhiều \n
      const parts = onReceiveData.split("\n");
      for (let i = 0; i < parts.length; i++) {
        if (i === 0) {
          // nối vào dòng hiện tại
          lastLog.message += parts[i];
        } else {
          // nếu có xuống dòng thì tạo log mới
          lastLog = { type: "receive", message: parts[i] };
          newLogs.push(lastLog);
        }
      }

      return [...newLogs];
    });
    setReceiveData(''); // Xóa dữ liệu đã nhận sau khi xử lý
  }, [onReceiveData]);

  // tự động scroll xuống cuối
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [logs]);

  const sendCommand = () => {
    if (!input.trim()) return;
    setLogs((prev) => [...prev, { type: "send", message: input }]);
    onSendData(input);
    // setInput("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.dialog}
          >
            <Text style={styles.title}>Terminal</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter value"
                placeholderTextColor="#888"
                style={styles.input}
                value={input}
                onChangeText={setInput}
                autoFocus
              />
              <TouchableOpacity 
                style={[styles.sendButton, !connectedDevice && { opacity: 0.5 }]} 
                onPress={sendCommand}
                disabled={!connectedDevice}
              >
                <Icon name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ScrollView 
                style={styles.terminal} 
                ref={scrollViewRef}
                contentContainerStyle={{ padding: 10 }} 
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              >
                {logs.map((log, index) => {
                  let textStyle = styles.textSystem;
                  if (log.type === "send") textStyle = styles.textSend;
                  if (log.type === "receive") textStyle = styles.textReceive;

                  return (
                    <Text key={index} style={textStyle}>
                      {log.type === "send" ? "> " : "< "} 
                      {log.message}
                    </Text>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancel_save_Text}>Close</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BlocklyDialogTerminal;

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
    paddingHorizontal: 30,
    width: '90%',
    flex: 0.9,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    width: '88%',
  },
  buttonRow:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#aaa',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '15%',
  },
  sendButton: {
    backgroundColor: '#64b5f6',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    width: '10%',
  },  
  terminal: {
    backgroundColor: "#414759",
    borderRadius: 20,
    width: '100%',
  },
  textSystem: {
    color: "#00ff00", // xanh lá cho system
    fontFamily: "monospace",
  },
  textSend: {
    color: "#00ffff", // xanh ngọc cho dữ liệu gửi
    fontFamily: "monospace",
  },
  textReceive: {
    color: "#3399ff", // xanh dương cho dữ liệu nhận
    fontFamily: "monospace",
  },
  cancel_save_Text: {
    color: 'white',
    fontSize: 16,
  },
});
