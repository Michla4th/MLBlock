// CodeScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Pressable,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  loadProjects,
  deleteProject,
  updateProjectById
} from '../../service/projectStorage';
import { useFocusEffect } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height - 50;
const boxMargin = 10;
const paddingVertical = 10;
const totalMargin = boxMargin * 4 + paddingVertical * 2;
const boxHeight = (screenHeight - totalMargin) / 2;
const boxWidth = 177;

type ProjectInfo = {
  id: string;
  name: string;
  color?: string;
};

type RenderProjectProps = {
  col: ProjectInfo[];
  colIndex: number;
  boxHeight: number;
  boxMargin: number;
  onAddProject: () => void;
  navigation: StackNavigationProp<any>;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  openMenuIndex: string | null;
  setOpenMenuIndex: (index: string | null) => void;
};

function RenderProject({
  col,
  colIndex,
  boxHeight,
  boxMargin,
  onAddProject,
  navigation,
  onRename,
  onDelete,
  openMenuIndex,
  setOpenMenuIndex,
}: RenderProjectProps) {
  return (
    <View style={styles.columnContainer}>
      {col.map((project, rowIndex) => {
        const indexKey = `${colIndex}-${rowIndex}`;
        const isMenuOpen = openMenuIndex === indexKey;

        return (
          <TouchableOpacity
            key={indexKey}
            onPress={() => {
              if (project.name === 'New Project' && rowIndex === 0 && colIndex === 0) {
                // onAddProject();
                navigation.navigate('Blockly', { projectId: project.id });
              } else {
                navigation.navigate('Blockly', { projectId: project.id });
              }
            }}
            style={[styles.projectBox, { backgroundColor: project.color, height: boxHeight, marginVertical: boxMargin }]}
            activeOpacity={1}
          >
            <Text style={styles.projectTitle}>{project.name}</Text>

            {project.name === 'New Project' && (
              <Icon name="add-circle" size={40} color="white" />
            )}

            {project.name !== 'New Project' && (
              <View style={styles.menuButton}>
                <TouchableOpacity onPress={() => setOpenMenuIndex(isMenuOpen ? null : indexKey)}>
                  <Icon name="list-circle" size={30} color="white" />
                </TouchableOpacity>
              </View>
            )}

            {isMenuOpen && (
              <View style={styles.popupMenu}>
                <TouchableOpacity onPress={() => { onRename(project.id, project.name); setOpenMenuIndex(null); }}>
                  <Text style={styles.popupItem}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { onDelete(project.id); setOpenMenuIndex(null); }}>
                  <Text style={[styles.popupItem, styles.popupDelete]}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function AppBar_code({ navigation }: { navigation: StackNavigationProp<any> }) {
  return (
    <View style={styles.appBar}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.appBarButton}>
        <Icon name="arrow-undo" size={24} color="#6DBCFF" />
        <Text style={styles.appBarText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}

function Content({ navigation }: { navigation: StackNavigationProp<any> }) {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [openMenuIndex, setOpenMenuIndex] = useState<string | null>(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameText, setRenameText] = useState('');
  const [renamingProject, setRenamingProject] = useState<ProjectInfo | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const loaded = await loadProjects();
        const addBox: ProjectInfo = { id: 'add', name: 'New Project', color: '#6DBCFF' };
        setProjects([addBox, ...loaded]);
      };
      load();
    }, [])
  );

  const addProject = () => {
    // const nextIndex = (projects.length + 1) % colors.length;
    // const newProject: ProjectProp = {
    //   name: `Project ${projects.length + 1}`,
    //   data: {},
    //   color: colors[nextIndex],
    //   createdAt: new Date(),
    // };
    // setProjects([newProject, ...projects]);

    // navigation.navigate('Blockly');
  };


  const onRename = (id: string, currentName: string) => {
    setRenamingProject({id: id, name: currentName});
    setRenameText(currentName);
    setRenameModalVisible(true);
  };

  const confirmRename = async () => {
    if (renamingProject) {
      setProjects(prev =>
        prev.map(p =>
          p.id === renamingProject.id ? { ...p, name: renameText } : p
        )
      );
      await updateProjectById(renamingProject.id, { name: renameText });
    }

    setRenameModalVisible(false);
    setRenamingProject(null);
    setRenameText('');
  };

  const onDelete = (id: string) => {
    Alert.alert('Delete Project', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setProjects(prev => prev.filter(p => p.id !== id));
          await deleteProject(id);
        },
      },
    ]);
  };

  const allProjects = projects;
  const numRows = 2;
  const rows = Array.from({ length: numRows }, (_, rowIndex) => allProjects.filter((_, i) => i % numRows === rowIndex));
  const numColumns = Math.max(...rows.map((row) => row.length));
  const columns = Array.from({ length: numColumns }, (_, colIndex) => rows.map((row) => row[colIndex]).filter(Boolean));

  return (
    <Pressable style={styles.contentContainer} onPress={() => setOpenMenuIndex(null)}>
      <FlatList
        data={columns}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: col, index: colIndex }) => (
          <RenderProject
            col={col}
            colIndex={colIndex}
            boxHeight={boxHeight}
            boxMargin={boxMargin}
            onAddProject={addProject}
            navigation={navigation}
            onRename={onRename}
            onDelete={onDelete}
            openMenuIndex={openMenuIndex}
            setOpenMenuIndex={setOpenMenuIndex}
          />
        )}
      />

      <Modal visible={renameModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
              <Text style={styles.modalTitle}>Rename Project</Text>
            </View> 
            <TextInput
              value={renameText}
              onChangeText={setRenameText}
              placeholder="Enter new name"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setRenameModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmRename}>
                <Text style={styles.okButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
}

export default function CodeScreen({ navigation }: { navigation: StackNavigationProp<any> }) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true} translucent={true} />
      <AppBar_code navigation={navigation} />
      <Content navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'column',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  projectBox: {
    width: boxWidth,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  projectTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  popupMenu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    elevation: 4,
  },
  popupItem: {
    padding: 5,
  },
  popupDelete: {
    color: 'red',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  appBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarText: {
    color: '#6DBCFF',
    fontSize: 20,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  contentContainer: {
    height: screenHeight,
    paddingVertical,
    backgroundColor: 'white',
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
    color: 'red',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 20,
    color: 'red',
    fontSize: 16,
  },
  okButton: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 16,
  },
});