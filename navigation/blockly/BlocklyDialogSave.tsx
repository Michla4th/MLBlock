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
  onSave: (name: string) => void;
  initialName?: string;
}

const BlocklyDialogSave: React.FC<SaveDialogProps> = ({ visible, onClose, onSave, initialName}) => {
  const [projectName, setProjectName] = useState(initialName || '');

  useEffect(() => {
    if (visible) {
      setProjectName(initialName || '');
    }
  }, [visible, initialName]);

  const handleSave = () => {
    const trimmed = projectName.trim();
    if (trimmed.length > 0) {
      onSave(trimmed);
      setProjectName('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.dialog}
          >
            <Text style={styles.title}>Save Project</Text>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter project name"
                placeholderTextColor="#888"
                value={projectName}
                onChangeText={setProjectName}
                style={styles.input}
                autoFocus
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancel_save_Text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.cancel_save_Text}>OK</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BlocklyDialogSave;

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
    width: '80%',
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
    width: '35%',
    marginHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#64b5f6',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '35%',
    marginHorizontal: 10,
  },
  cancel_save_Text: {
    color: 'white',
    fontSize: 16,
  },
});
