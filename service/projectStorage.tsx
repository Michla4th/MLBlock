import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export type Workspace = {
  id: string;
  name: string;
  xml: string;
};

export type Project = {
  id: string;
  name: string;
  color: string;
  createdAt: string; // ISO string
  workspaces: Workspace[];
};

export type ProjectInfo = {
  id: string;
  name: string;
  color: string;
};

const STORAGE_KEY = 'projects';

// load all project info
export const loadProjects = async (): Promise<ProjectInfo[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];

    const projects: Project[] = JSON.parse(json);

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      color: project.color,
    }));
  } catch (error) {
    console.error('error loadProjects:', error);
    return [];
  }
};

// Get project by id
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    // 1. Load toàn bộ project từ AsyncStorage
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const projects: Project[] = json ? JSON.parse(json) : [];

    // 2. Tìm project theo id
    const project = projects.find(p => p.id === id);

    // 3. Trả kết quả
    return project ?? null;
  } catch (error) {
    console.error('Lỗi getProjectById:', error);
    return null;
  }
};

// update project by id
export const updateProjectById = async (id: string, updatedFields: Partial<Project>) => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const projects: Project[] = json ? JSON.parse(json) : [];

    const updatedProjects = projects.map(p =>
      p.id === id ? { ...p, ...updatedFields } : p
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));

  } catch (error) {
    console.error('Lỗi updateProjectById:', error);
  }
};

// delet project by id
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const existing = await loadProjects();
    const updated = existing.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Lỗi deleteProject:', error);
  }
};

// Lưu 1 project mới vào danh sách
export const saveProject = async (
  project: Omit<Project, 'id'> & Partial<Pick<Project, 'id'>>
): Promise<void> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const existing: Project[] = json ? JSON.parse(json) : [];
    let updated: Project[];


    let baseName = project.name?.trim() || 'New Project';
    let uniqueName = baseName;
    let counter = 1;

    const nameExists = (name: string) =>
      existing.some(p => p.name.toLowerCase() === name.toLowerCase());

    while (nameExists(uniqueName)) {
      uniqueName = `${baseName} ${counter}`;
      counter++;
    }

    if (project.id && existing.some(p => p.id === project.id)) {

      updated = existing.map(p =>
        p.id === project.id
          ? { ...p, ...project, id: p.id, name: uniqueName }
          : p
      );
    } else {

      const newProject: Project = {
        ...project,
        id: uuid.v4().toString(),
        name: uniqueName,
      };
      updated = [newProject, ...existing];
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Lỗi saveProject:', error);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage đã được xóa toàn bộ');
  } catch (e) {
    console.error('Lỗi khi xóa AsyncStorage:', e);
  }
};
