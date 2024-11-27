import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Configuration de l'instance Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter le token d'authentification à chaque requête
const setAuthToken = (token: string) => {
  api.defaults.headers['Authorization'] = `Token ${token}`;
};

// Types pour les données de l'API
interface User {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
}

interface Group {
  id: number;
  name: string;
  members: User[];
  owner: number;
  photo?: string;
}

interface Message {
  id: number;
  content?: string;
  files?: { id: number; file?: string; uploaded_at: string }[];
  sender: User;
  receiver?: User;
  group?: Group;
  timestamp: string;
}


const handleRequestError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error("Erreur API :", axiosError.response?.data || error.message);
  } else {
    console.error("Erreur :", error);
  }
};

// Récupérer les groupes
export const getGroups = async (token: string): Promise<Group[]> => {
  setAuthToken(token);
  try {
    const response = await api.get<Group[]>("/custom_messages/groups/");
    return response.data;
  } catch (error) {
    handleRequestError(error);
    return [];
  }
};

export const getSpecificGroup = async (token: string, groupId: number): Promise<Group> => {
    setAuthToken(token);
    try {
        const response = await api.get<Group>(`/custom_messages/groups/${groupId}/`);
        return response.data;
    } catch (error) {
        handleRequestError(error);
        throw error;
    }
}





export const createGroup = async (
  name: string,
  members: User[],
  photo: File | null,
  token: string
): Promise<Group> => {
  setAuthToken(token);
  try {
    const formData = new FormData();
    formData.append('name', name);
    members.forEach(member => {
      if (member.id !== undefined) {
        formData.append('members', member.id.toString());
      }
    });
    if (photo) {
      formData.append('photo', photo);
    }

    const response = await api.post<Group>("/custom_messages/groups/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

export const updateGroup = async (
    groupId: number,
    updatedData: Partial<{ name: string; members: User[]; photo: File | null }>,
    token: string
): Promise<Group> => {
    setAuthToken(token);
    try {
        const formData = new FormData();
        if (updatedData.name) {
            formData.append('name', updatedData.name);
        }
        if (updatedData.members) {
            updatedData.members.forEach(member => {
                if (member.id !== undefined) {
                    formData.append('members', member.id.toString());
                }
            });
        }
        if (updatedData.photo) {
            formData.append('photo', updatedData.photo);
        }

        const response = await api.patch<Group>(`/custom_messages/groups/${groupId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating group:", error);
        throw error;
    }
}

// Quitter un groupe
export const leaveGroup = async (groupId: number, token: string): Promise<void> => {
  setAuthToken(token);
  try {
    await api.post(`/custom_messages/groups/${groupId}/leave/`);
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
};

// Récupérer les conversations
export const getConversations = async (token: string): Promise<Message[]> => {
  setAuthToken(token);
  try {
    const response = await api.get<Message[]>("/custom_messages/conversations/");
    return response.data;
  } catch (error) {
    handleRequestError(error);
    return [];
  }
};

export const deleteConversation = async(type: 'group'| 'private', pk:number,token :string): Promise<void> => {
    setAuthToken(token);
    try {
        const response = await api.delete(`/custom_messages/${type}/${pk}/delete_conversation/`);
        return response.data;
    } catch (error) {
        handleRequestError(error);
        throw error;
    }
}

export const getChatHistory = async (type: 'group' | 'private', pk: number, token: string): Promise<Message[]> => {

    setAuthToken(token);

  try {
    const response = await api.get<Message[]>(`/custom_messages/${type}/${pk}/chat_history/`);
    return response.data;
  } catch (error) {
    handleRequestError(error);
    return [];
  }
};


export const sendMessage = async (
  groupId?: number,
  receiverId?: number,
  content?: string,
  token: string,
  files?: File[]
): Promise<Message> => {
  setAuthToken(token); // Ensure the token is set

  try {
    const formData = new FormData();
    if (groupId) formData.append('group', groupId.toString());
    if (receiverId) formData.append('receiver', receiverId.toString());
    if (content) formData.append('content', content);
    if (files) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await api.post<Message>("/custom_messages/send_message/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });



    return response.data;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
};




export const deleteMessage = async (
    token: string,
    messageId: number,
): Promise<Message> => {
    setAuthToken(token);
    try {
        const response = await api.delete<Message>(`/custom_messages/${messageId}/`);
        return response.data;
    } catch (error) {
        handleRequestError(error);
        throw error;
    }
}

export const deleteFile = async (
    token: string,
    messageId: number,
    fileId: number,
): Promise<void> => {
    setAuthToken(token);
    try {
        const response = await api.delete(`/custom_messages/${messageId}/remove_file/${fileId}/`);
        return response.data;
    }
    catch (error) {
        handleRequestError(error);
        throw error;
    }
}

export const updateMessage = async (
    token: string,
    messageId: number,
    content: string,
): Promise<Message> => {
    setAuthToken(token);
    try {
        const response = await api.patch<Message>(`/custom_messages/${messageId}/`, { content });
        return response.data;
    } catch (error) {
        handleRequestError(error);
        throw error;
    }
}

