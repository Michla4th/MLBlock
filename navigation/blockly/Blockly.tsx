import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StatusBar, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { ComponentWithHook } from './ComponentBlockly';
import ConfigFiles from './content';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';

import {DarkModeTheme} from './Blockly_style';

import {clearStorage, getProjectById, Workspace} from '../../service/projectStorage';

interface BlocklyProps {
  xml: string;
  json: any;
  python?: string;
}

export default function Blockly() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { projectId } = route.params as {projectId: string};

  const [code, setCode] = useState('');
  const [xml, setxml] = useState('');

  const workspaceConfiguration = {
    grid: {
      spacing: 0,
      length: 3,
      colour: '#ccc',
      snap: true,
    },
    toolbox: ConfigFiles.INITIAL_TOOLBOX_JSON,
    // null safety example
    collapse: true,
    comments: true,
    css: undefined,
    disable: undefined,
    horizontalLayout: undefined,
    maxBlocks: undefined,
    maxInstances: undefined,
    media: undefined,
    modalInputs: undefined,
    move: undefined,
    oneBasedIndex: undefined,
    readOnly: undefined,
    renderer: 'zelos',
    rendererOverrides: undefined,
    rtl: undefined,
    scrollbars: undefined,
    sounds: undefined,
    theme: DarkModeTheme,
    toolboxPosition: undefined,
    trashcan: false,
    maxTrashcanContents: undefined,
    plugins: undefined,
    zoom: {
      controls: false,
      wheel: true,
      startScale: 1.0,
      maxScale: 2,
      minScale: 0.5,
      scaleSpeed: 1.2,
      pinch: true
    },
    parentWorkspace: undefined,
  };

  const [IsChange, setChange] = useState(false);
  const [IsSave, setIsSave] = useState(false);
  const [IsExist, setIsExist] = useState(false);
  const [ProjectName, setProjectName] = useState('Blockly');
  const [Workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [CurrentWorkspaceId, setCurrentWorkspaceId] = useState('');

  useEffect(() => {
    const load = async () => {
      const project = await getProjectById(projectId);
      if (project) { 
        setIsExist(true);       
        setProjectName(project.name);
        setWorkspaces(project.workspaces);
        setCurrentWorkspaceId(project.workspaces[0].id)
      } else {
        const emptyWs = [{ id: '1', name: 'Workspace 1', xml: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>' }];
        setWorkspaces(emptyWs);
        setCurrentWorkspaceId('1')
      }
    };
    load();
  }, []);

  const onInject = useCallback(({ xml, json } : BlocklyProps) => {
    // console.log('onInject', xml, JSON.stringify(json));
  }, []);

  const onChange = useCallback(({ xml, json, python } : BlocklyProps) => {
    // console.log('onChange', xml, JSON.stringify(python));
    setCode(python ?? '');
    setxml(xml);
    if (hasWorkspaceChanged(xml, Workspaces, CurrentWorkspaceId)) {
      setChange(true);
      setIsSave(false);
      saveCurrentWorkspace(xml);
    }
  }, [Workspaces, CurrentWorkspaceId]);

  const onDispose = useCallback(({ xml, json, python }: BlocklyProps) => {
    // console.log('onDispose', xml, JSON.stringify(json));
    setCode(python ?? '');
    setxml(xml);
    saveCurrentWorkspace(xml);
  }, [Workspaces, CurrentWorkspaceId]);

  const onError = useCallback((error: unknown) => {
    console.log('onError', (error as Error)?.toString());
  }, []);

  const saveCurrentWorkspace = (newXml: string) => {
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === CurrentWorkspaceId
          ? { ...ws, xml: newXml }
          : ws
      )
    );
  };

  const hasWorkspaceChanged = (currentXml: string, workspaces: Workspace[], currentWorkspaceId: string) => {
    const currentWorkspace = workspaces.find(ws => ws.id === currentWorkspaceId);
    
    if (!currentWorkspace) {
      return true;
    }

    return currentWorkspace.xml !== currentXml;
  };

  return (
    <View style={{ flex: 1 }}>
      <ComponentWithHook
        workspaceConfiguration={workspaceConfiguration}
        onInject={onInject}
        onChange={onChange}
        onDispose={onDispose}
        onError={onError}
        navigation = {navigation}
        code = {code}

        IsExist={IsExist}
        IsChange={IsChange}
        projectId={projectId}
        IsSave={IsSave}
        setIsSave={setIsSave}
        ProjectName={ProjectName}
        Workspaces={Workspaces}
        setWorkspaces={setWorkspaces}
        CurrentWorkspaceId={CurrentWorkspaceId}
        setCurrentWorkspaceId={setCurrentWorkspaceId}
      />
    </View>
  );
}
