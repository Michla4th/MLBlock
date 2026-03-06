import React, { useEffect, useState } from 'react';
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
} from 'react-native';

interface SaveDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const BlocklyDialogBack: React.FC<SaveDialogProps> = ({ visible, onClose, onSave}) => {

  useEffect(() => {
    if (visible) {
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.dialog}
          >
            <Text style={styles.title}>Do you want to save Project</Text>

            {/* <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter project name"
                placeholderTextColor="#888"
                value={projectName}
                onChangeText={setProjectName}
                style={styles.input}
                autoFocus
              />
            </View> */}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancel_save_Text}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.cancel_save_Text}>Yes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BlocklyDialogBack;

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
    width: '40%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 10,
  },
  inputContainer: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    width: '55%',
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
    width: '30%',
    marginHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#64b5f6',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '30%',
    marginHorizontal: 10,
  },
  cancel_save_Text: {
    color: 'white',
    fontSize: 16,
  },
});
