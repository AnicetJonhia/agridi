import axios, { AxiosError } from "axios";

const BASE_URL = "http://localhost:8000/api";

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
interface Sender {
  id: number;
  name: string;
  avatar?: string;
}

interface Group {
  id: number;
  name: string;
  members: number[];
  owner: number;
  photo?: string;
}

interface Message {
  id: number;
  content: string;
  file?: string;
  sender: Sender;
  receiver?: Sender;
  group?: Group;
  timestamp: string;
}

// Utilitaire pour la gestion des erreurs
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

// Créer un groupe
export const createGroup = async (
  name: string,
  members: number[],
  token: string
): Promise<Group> => {
  setAuthToken(token);
  try {
    const response = await api.post<Group>("/custom_messages/groups/", {
      name,
      members,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
};

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

// Récupérer l'historique du chat
export const getChatHistory = async (pk: number, token: string): Promise<Message[]> => {
  setAuthToken(token);
  try {
    const response = await api.get<Message[]>(`/custom_messages/${pk}/chat_history/`);
    return response.data;
  } catch (error) {
    handleRequestError(error);
    return [];
  }
};

// Exemple d'envoi de message avec vérification du token
export const sendMessage = async (

  groupId?: number,
  receiverId?: number,
  content: string,
  token: string
): Promise<Message> => {
  setAuthToken(token); // S'assurer que le token est bien défini

  try {
    const data = {

      ...(groupId && { group: groupId }),
      ...(receiverId && { receiver: receiverId }),
        content,
        token
    };

    // Envoyer la requête
    const response = await api.post<Message>("/custom_messages/send_message/", data);
    return response.data;

  } catch (error) {
    handleRequestError(error);
    throw error;
  }
};

