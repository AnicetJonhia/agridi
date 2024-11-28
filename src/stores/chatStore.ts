import { create } from 'zustand';
import { getGroups, getSpecificGroup } from '@/services/chats-api';
import { Group } from '@/types/chat-type';

interface ChatStoreState {
  token: string | null;
  groups: Group[];
  specificGroup: Group | null;
  setToken: (token: string) => void;
  fetchGroups: () => Promise<void>;
  fetchSpecificGroup: (groupId: number) => Promise<void>;
}

const useChatStore = create<ChatStoreState>((set, get) => ({
  token: localStorage.getItem('token'),
  groups: [],
  specificGroup: null,
  setToken: (token: string) => set({ token }),
  fetchGroups: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const groups = await getGroups(token);
      set({ groups });
      return groups;
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  },
  fetchSpecificGroup: async (groupId: number) => {
    const { token } = get();
    if (!token) return;
    try {
      const specificGroup = await getSpecificGroup(token, groupId);
      set({ specificGroup });
    } catch (error) {
      console.error('Failed to fetch specific group:', error);
    }
  },
}));

export default useChatStore;