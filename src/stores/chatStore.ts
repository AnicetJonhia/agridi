// useChatStore.js
import {create} from "zustand";
import { getConversations, getChatHistory, sendMessage } from "@/services/chats-api";

const useChatStore = create((set) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],

  fetchConversations: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const fetchedConversations = await getConversations(token);
        const sortedConversations = fetchedConversations.sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        set({ conversations: sortedConversations });
        // Optionnel : Sélectionner la première conversation si aucune n'est sélectionnée
        if (sortedConversations.length > 0) {
          set({ selectedConversation: sortedConversations[0] });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des conversations :", error);
      }
    }
  },

  selectConversation: (conversation) => {
    set({ selectedConversation: conversation });
    // Récupérer l'historique pour la conversation sélectionnée
    useChatStore.getState().fetchMessages(conversation);
  },

  fetchMessages: async (conversation) => {
    if (conversation) {
      try {
        const token = localStorage.getItem("token");
        const fetchedMessages = await getChatHistory(conversation.group?.id || conversation.receiver?.id, token);
        set({ messages: fetchedMessages });
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique du chat :", error);
      }
    }
  },

  sendMessage: async (content) => {
    const { selectedConversation, messages } = useChatStore.getState();
    if (selectedConversation) {
      try {
        const token = localStorage.getItem("token");
        const newMessage = await sendMessage(
          selectedConversation.group?.id,
          selectedConversation.receiver?.id,
          content,
          token
        );
        set({
          messages: [...messages, newMessage],
          conversations: useChatStore.getState().conversations.map((conv) =>
            conv.id === (selectedConversation.group?.id || selectedConversation.receiver?.id)
              ? { ...conv, lastMessage: newMessage, timestamp: newMessage.timestamp }
              : conv
          ),
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
      }
    }
  },
}));

export default useChatStore;
