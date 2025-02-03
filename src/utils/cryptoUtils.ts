import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encryptData = (data: string | object) => {
  try {
    const dataToEncrypt = typeof data === 'object' ? JSON.stringify(data) : data;
    const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption Error: ", error);
    return null; // Retourner null en cas d'erreur
  }
};

export const decryptData = (data: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // Si la décryption échoue ou renvoie un résultat vide
    if (!decryptedData) {
      console.error("Decryption Error: Unable to decrypt the token.");
      return null;
    }
    return decryptedData;
  } catch (error) {
    console.error("Decryption Error: ", error);
    return null;
  }
};
