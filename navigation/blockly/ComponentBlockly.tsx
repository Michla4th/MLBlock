import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ToastAndroid,
  Alert,
  Modal,
  Pressable
} from 'react-native'; 

import { useBlocklyNativeEditor } from '@react-blockly/core';
import { WebView } from 'react-native-webview';
import ConfigFiles from './content';
import LottieView from 'lottie-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import AnimatedSwitch from '../../components/Switch';

import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { blocks, esp_blocks } from '../../assets/blockly/blocks';
import { category } from '../../assets/blockly/blockly_category';
import { toolbox_label, toolbox_style } from '../../assets/blockly/blockly_toolbox';
import { pythonGeneratorCode } from '../../assets/blockly/generator';

import BlocklyDialogList from './BlocklyDialogList';
import BlocklyDialogSave from './BlocklyDialogSave';
import BlocklyDialogBack from './BlocklyDialogBack';
import BlocklyDialogTerminal from './BlocklyDialogTerminal';

import {
  saveProject,
  Project,
  Workspace,
  updateProjectById,
  loadProjects,
} from '../../service/projectStorage';

import uuid from 'react-native-uuid';
import useBLE from '../../service/useBLE';
import DeviceModal from '../../service/DeviceConnectionModal';
import { Device } from 'react-native-ble-plx';

import { runPython, stopPython } from "../../service/Skulpt";
import StatusDropdown from '../../components/Dropdown';


const { height, width } = Dimensions.get("screen");

type AppBarProp = {
  navigation: StackNavigationProp<any>,
  isOn: any,
  setIsOn: any,
  setShowDialogList: React.Dispatch<React.SetStateAction<boolean>>,
  setShowDialogSave: React.Dispatch<React.SetStateAction<boolean>>,
  setShowDialogBack: React.Dispatch<React.SetStateAction<boolean>>,
  setShowDialogTerminal: React.Dispatch<React.SetStateAction<boolean>>,
  isChange: boolean,
  isSave: boolean,
  openModal: () => Promise<void>,
  connectedDevice: Device | null,
  disconnectFromDevice: () => void;
  onSendData: (data: string) => Promise<void>;
  onUpload: (data: string) => Promise<void>;
  data: string;
  receiveData: string;
}

function AppBar_code({
  navigation,
  isOn,
  setIsOn,
  setShowDialogList,
  setShowDialogSave,
  setShowDialogBack,
  setShowDialogTerminal,
  isChange,
  isSave,
  openModal,
  connectedDevice,
  disconnectFromDevice,
  onSendData,
  onUpload,
  data,
  receiveData,
}: AppBarProp) {

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: width / 3 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#373C4C',
            padding: 12,
            paddingHorizontal: 20,
            width: 142.5,
            borderTopRightRadius: 29,
          }}
        >
          <TouchableOpacity
            onPress={() => { (!isChange || isSave) ? navigation.navigate('CodeScreen') : setShowDialogBack(true) }}
            style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Icon name="home" size={24} color="white" />
            <Text style={{ color: 'white', fontSize: 20, marginLeft: 5, fontWeight: 'bold' }}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: width / 3,
        // paddingRight: 20,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#373C4C',
          opacity: 0.9,
          padding: 8,
          paddingHorizontal: 40,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30
        }}>
          <AnimatedSwitch value={isOn} onValueChange={setIsOn} />
        </View>
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width / 3,
        paddingRight: 20,
      }}>
        {/* new workspace */}
        <TouchableOpacity style={styles.icon} onPress={() => setShowDialogList(true)}>
          <Icon name="list" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={() => setShowDialogSave(true)}>
          <Icon name="save" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowDialogTerminal(true)}>
          <Icon name="terminal" size={24} color='white' />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[styles.icon, !connectedDevice && { opacity: 0.5 }]}
          disabled={!connectedDevice}
          onPress={() => { onUpload(data); setShowDialogTerminal(true); }}>
          <Icon name="cloud-upload" size={24} color="white" />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.icon} onPress={connectedDevice ? disconnectFromDevice : openModal}>
          <Icon name="bluetooth" size={24} color={connectedDevice ? "#6DBCFF" : '#FF6F79'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

type ComponentWithHookProps = {
  workspaceConfiguration: any;
  onInject?: (data: any) => void;
  onChange?: (data: any) => void;
  onDispose?: (data: any) => void;
  onError?: (error: any) => void;
  navigation: StackNavigationProp<any>;
  projectId: string;
  code: string;
  IsExist: boolean;
  IsChange: boolean;
  IsSave: boolean;
  setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
  ProjectName: string;
  Workspaces: Workspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>
  CurrentWorkspaceId: string;
  setCurrentWorkspaceId: React.Dispatch<React.SetStateAction<string>>
};

function ComponentWithHook(props: ComponentWithHookProps) {
  const [loading, setLoading] = useState(true);
  const [isOn, setIsOn] = useState(false);

  const {
    workspaceConfiguration,
    onInject,
    onChange,
    onDispose,
    onError,
    navigation,
    projectId,
    code,
    IsExist,
    IsChange,
    IsSave,
    setIsSave,
    ProjectName,
    Workspaces,
    setWorkspaces,
    CurrentWorkspaceId,
    setCurrentWorkspaceId,
  } = props;

  const {
    editorRef,
    init,
    dispose,
    state,
    updateState,
    updateToolboxConfig,
    htmlRender,
    onMessage,
  } = useBlocklyNativeEditor({
    workspaceConfiguration,
    initial: undefined,
    onInject,
    onChange,
    onDispose,
    onError,
    platform: Platform.OS,
  });

  useEffect(() => {
    return () => {
      dispose();
    };
  }, []);

  const onLoadEnd = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);

    testPromise({ timeout: 1000 }).then(() => {
      dispose();
      init({ initial: Workspaces[0].xml });
    });

    // testPromise({ timeout: 1200, data: ConfigFiles.INITIAL_JSON }).then(res => {
    //   init({ initial: res });
    // });

    testPromise({ timeout: 1500 }).then(() => {
      updateToolboxConfig((prevConfig: any) => {
        return {
          ...prevConfig,
          contents: [
            ...prevConfig.contents,
            ...ConfigFiles.INITIAL_TOOLBOX_CUSTOM.contents,
          ],
        };
      });
    });

  };

  function testPromise<T>({
    data,
    timeout = 1000,
  }: {
    data?: T;
    timeout?: number;
  }): Promise<T | undefined> {
    return new Promise(res => setTimeout(() => res(data), timeout));
  }

  // Blockly code generate
  const scripts = [category, toolbox_label, esp_blocks, pythonGeneratorCode].join('\n');
  const python_code = code.trim();
  const lines = python_code.split('\n');
  const micropython_code = python_code
    .split('\n')
    .filter(line => !line.includes('highlightBlock'))
    .join('\n');

  // Blockly Dialog List  
  const [showDialogList, setShowDialogList] = useState(false);

  const handleSelect = (id: string) => {
    const selected = Workspaces.find(item => item.id === id);
    if (selected) {
      if (selected.id == CurrentWorkspaceId) return;
      else {
        setCurrentWorkspaceId(selected.id);
        setShowDialogList(false);
        dispose();
        init({ initial: selected.xml });
      }
    }
  };

  const handleAddNew = () => {
    const maxId = Workspaces.reduce((max, item) => Math.max(max, parseInt(item.id)), 0);
    const newId = (maxId + 1).toString();
    const nextName = `Workspace ${newId}`;
    const newWs = { id: newId, name: nextName, xml: '' };

    setWorkspaces((prev) => [...prev, newWs]);

    setCurrentWorkspaceId(newId);
    dispose();
    init({ initial: '' });
    setShowDialogList(false);
  };

  const handleEdit = (id: string, newName: string) => {
    setWorkspaces((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  };

  const handleCopy = (id: string) => {
    const item = Workspaces.find((d) => d.id === id);
    if (item) {
      const maxId = Workspaces.reduce((max, item) => Math.max(max, parseInt(item.id)), 0);
      const newId = (maxId + 1).toString();
      const newWs = { id: newId, name: `${item.name}_Copy`, xml: item.xml };
      setWorkspaces((prev) => [...prev, newWs]);
    }
  };

  const handleDelete = (id: string, workspaceName: string) => {
    if (Workspaces.length === 1) {
      // Alert.alert("Notice", "You must have at least one workspace.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${workspaceName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setWorkspaces((prev) => {
              const updated = prev.filter((item) => item.id !== id);

              const isCurrent = id === CurrentWorkspaceId;

              if (isCurrent) {
                const fallback = updated[0];
                if (fallback) {
                  setCurrentWorkspaceId(fallback.id);
                  dispose();
                  init({ initial: fallback.xml });
                }
              }
              return updated;
            });
          },
        },
      ]
    );
  };

  // Blockly Dialog Save 
  const [showDialogSave, setShowDialogSave] = useState(false);
  const [showDialogBack, setShowDialogBack] = useState(false);
  const [showDialogTerminal, setShowDialogTerminal] = useState(false);
  const colors = ['#FF6F79', '#62D063', '#6DBCFF', '#FDDA48', '#8398F5'];

  const handleSave = async (projectName: string) => {
    const numberprojects = await loadProjects();
    const colorIndex = numberprojects.length % colors.length;

    if (!IsExist) {
      const newProject: Project = {
        id: uuid.v4().toString(),
        name: projectName,
        color: colors[colorIndex],
        createdAt: new Date().toISOString(),
        workspaces: Workspaces,
      };
      await saveProject(newProject);
      setIsSave(true);
    }
    else {
      await updateProjectById(projectId, { name: projectName, workspaces: Workspaces });
      setIsSave(true);
    }
  };

  // Bluetooth Device Connection Modal
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    onSendData,
    onUpload,
    receiveData,
    setReceiveData,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  // Run Python code with Skulpt
  const [isRunning, setIsRunning] = useState(false);

  const handlePython = async (code: string) => {
    if (!isRunning) {
      setIsRunning(true);
      try {
        const result = await runPython(
          code,
          (msg) => { setReceiveData(msg); },
          (blockId) => { editorRef.current.postMessage(JSON.stringify({ event: "highlight", data: blockId })); }
        );
        // console.log("Python finished:", result);
        editorRef.current.postMessage(JSON.stringify({ event: "highlight", data: null }));
      } catch (err) {
        // console.log("Python stopped:", err);
        editorRef.current.postMessage(JSON.stringify({ event: "highlight", data: null }));
      } finally {
        setIsRunning(false);
      }
    }
    else {
      stopPython();
    }
  };

  // switch state upload code (online/ offline)
  const [status, setStatus] = useState("Online");

  const iconName = (() => {
    if (status === 'Offline') {
      return 'cloud-upload';
    }
    // online
    return isRunning ? 'stop' : 'play';
  })();

  const handleMainButtonPress = async () => {
    if (!connectedDevice) return;

    if (status === 'Online') {
      if (!isRunning) {
        setTimeout(async () => {
          handlePython(python_code);
        }, 1000);
      } else {
        stopPython();
        setIsRunning(false);
      }
    } else {
      // OFFLINE MODE
      onUpload(micropython_code);
      setShowDialogTerminal(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <View style={{
        position: 'absolute',
        top: 0,
        zIndex: 2,
      }} pointerEvents="box-none">
        <AppBar_code
          navigation={navigation}
          isOn={isOn}
          setIsOn={setIsOn}
          setShowDialogList={setShowDialogList}
          setShowDialogSave={setShowDialogSave}
          setShowDialogBack={setShowDialogBack}
          setShowDialogTerminal={setShowDialogTerminal}
          isChange={IsChange}
          isSave={IsSave}
          openModal={openModal}
          connectedDevice={connectedDevice}
          disconnectFromDevice={disconnectFromDevice}
          onSendData={onSendData}
          onUpload={onUpload}
          data={micropython_code}
          receiveData={receiveData}
        />
      </View>

      <View style={{ flex: 1, zIndex: 1 }}>
        {/* Code Blockly */}
        <WebView
          style={{ flex: 1, margin: -0.5 }}
          ref={editorRef}
          originWhitelist={['*']}
          source={{ html: htmlRender({ script: scripts, style: toolbox_style }), baseUrl: 'file:///android_asset' }}
          onMessage={onMessage}
          onLoadEnd={onLoadEnd}
        />
        {/* Code Python */}
        {isOn && (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            backgroundColor: '#282C34',
            width: '100%',
            height: height,
            top: 50,
          }}>
            {/* <Text> coding python</Text> */}
            <ScrollView horizontal style={{ backgroundColor: '#282C34', width: '100%' }}>
              <View style={{ flexDirection: 'row', paddingVertical: 16, paddingLeft: 16, minWidth: '100%' }}>
                {/* Line numbers */}
                <View style={{ marginRight: 12 }}>
                  {lines.map((_, i) => (
                    <Text key={i} style={{
                      color: '#888',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      lineHeight: 24,
                    }}>
                      {i + 1}
                    </Text>
                  ))}
                </View>

                {/* Code Python */}
                <View style={{ flex: 1 }}>
                  <CodeHighlighter
                    language="python"
                    containerStyle={{ width: '100%' }}
                    hljsStyle={atomOneDarkReasonable}
                    textStyle={{
                      fontFamily: 'monospace',
                      fontSize: 14,
                      color: '#fff',
                      lineHeight: 24,
                    }}>
                    {micropython_code}
                  </CodeHighlighter>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'white',
              // opacity: 0.6,
            }}
          />
          {/* Lottie loading */}
          <LottieView
            source={require('../../assets/lottie/Programing.json')}
            autoPlay
            loop
            speed={1}
            style={{ width: 300, height: 300 }}
          />
        </View>
      )}

      <BlocklyDialogList
        visible={showDialogList}
        onClose={() => setShowDialogList(false)}
        data={Workspaces}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onCopy={handleCopy}
        onDelete={handleDelete}
        onSelect={handleSelect}
        selectedId={CurrentWorkspaceId}
      />

      <BlocklyDialogSave
        visible={showDialogSave}
        onClose={() => setShowDialogSave(false)}
        onSave={(newName) => {
          handleSave(newName);
          setShowDialogSave(false);

          if (Platform.OS === 'android') {
            ToastAndroid.show(`Save Project: ${newName}`, ToastAndroid.SHORT);
          } else {
            Alert.alert('Save Project', `with name: ${newName}`);
          }
        }}
        initialName={ProjectName}
      />

      <BlocklyDialogBack
        visible={showDialogBack}
        onClose={() => { setShowDialogBack(false); navigation.navigate('CodeScreen'); }}
        onSave={async () => {
          await handleSave(ProjectName);
          setShowDialogBack(false);
          navigation.navigate('CodeScreen');
        }}
      />

      <BlocklyDialogTerminal
        visible={showDialogTerminal}
        onClose={() => setShowDialogTerminal(false)}
        connectedDevice={connectedDevice}
        onSendData={onSendData}
        onReceiveData={receiveData}
        setReceiveData={setReceiveData}
      />

      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />


      <View style={styles.container}>
        <StatusDropdown
          selectedValue={status}
          onValueChange={setStatus}
        />
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isRunning ? "#FF6F79" : "#6DBCFF" },
            !connectedDevice && { opacity: 0.5 }
          ]}
          disabled={!connectedDevice}
          onPress={handleMainButtonPress}>
          <Icon name={iconName} size={36} color="white" />
        </TouchableOpacity>
      </View>


    </View>
  );
}

export { ComponentWithHook };

const styles = StyleSheet.create({
  icon: {
    backgroundColor: '#373C4C',
    opacity: 0.9,
    padding: 8,
    borderRadius: 20,
  },
  container: {
    flexDirection: "row",
    position: 'absolute',
    zIndex: 3,
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
    padding: 8,
    borderRadius: 30,
    margin: 10,
    marginLeft: 20,
  }
});