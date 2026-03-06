import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

type BlocklyItem = {
  id: string;
  name: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  data: BlocklyItem[];
  onAddNew: () => void;
  onEdit: (id: string, newName: string) => void;
  onCopy: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
};


const BlocklyDialogList: React.FC<Props> = ({
  visible,
  onClose,
  data,
  onAddNew,
  onEdit,
  onCopy,
  onDelete,
  onSelect,
  selectedId,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');

  const renderItem = ({ item }: { item: BlocklyItem }) => {
    const isEditing = editingId === item.id;
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => {
          if (!isEditing) {
            onSelect(item.id);   
          }
        }}
        activeOpacity={0.8}
      >
        {isEditing ? (
          <TextInput
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={() => {
              onEdit(item.id, newName.trim() || item.name);
              setEditingId(null);
            }}
            style={styles.input}
            autoFocus
          />
        ) : (
          <>
            <Feather
              name="check-circle"
              size={20}
              color= {isSelected? 'green' : '#f1f1f1'}
            />             
            <Text style={styles.itemText}>{item.name}</Text>
          </>
        )}

        <TouchableOpacity onPress={() => onCopy(item.id)} style={styles.icon}>
          <Feather name="copy" size={20} color="#64b5f6" />
        </TouchableOpacity>

        {isEditing ? (
          <TouchableOpacity
            onPress={() => {
              onEdit(item.id, newName.trim() || item.name);
              setEditingId(null);
            }}
            style={styles.icon}
          >
            <Feather name="check" size={20} color="#2196f3" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setEditingId(item.id);
              setNewName(item.name);
            }}
            style={styles.icon}
          >
            <Feather name="edit" size={20} color="#64b5f6" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => onDelete(item.id, item.name)}
          style={styles.icon}
        >
          <Feather name="trash-2" size={20} color="#e57373" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Blockly List</Text>

          <TouchableOpacity style={styles.newButton} onPress={onAddNew}>
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.newText}>New</Text>
          </TouchableOpacity>

          <View style={{flex: 1, paddingVertical: 0,}}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ marginTop: 0}}
            />
          </View>
        
          <View 
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
            }}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BlocklyDialogList;

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
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#64b5f6',
    paddingVertical: 10,
    borderRadius: 24,
    justifyContent: 'center',
    // marginTop: 12,
  },
  newText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginLeft: 10,
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
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',             
    padding: 4,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginLeft: 10,
  },
});
