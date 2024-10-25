// src/services/chats-api.tsx
import axios from "axios";

const BASE_URL = "http://localhost:8000/api"; // Remplacez par l'URL de votre API

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
  file?: string; // Pour gérer les fichiers si nécessaire
  sender: Sender; // Le sender est maintenant un objet Sender
  receiver?: Sender; // L'expéditeur peut avoir un récepteur
  group?: Group; // L'option de groupe est maintenant un objet Group
  timestamp: string; // Représentation de la date/heure en format string
}

// Récupérer les groupes (senders)
export const getGroups = async (token: string): Promise<Group[]> => {
  try {
    const response = await axios.get<Group[]>(`${BASE_URL}/custom_messages/groups/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    return [];
  }
};

// Récupérer les messages d'un groupe donné
export const getMessages = async (groupId: number, token: string): Promise<Message[]> => {
  try {
    const response = await axios.get<Message[]>(`${BASE_URL}/custom_messages/?group=${groupId}`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return [];
  }
};

// Envoyer un message
export const sendMessage = async (groupId: number, content: string, token: string): Promise<Message> => {
  try {
    const response = await axios.post<Message>(`${BASE_URL}/custom_messages/`, {
      group: groupId,
      content,
    }, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    throw error;
  }
};
