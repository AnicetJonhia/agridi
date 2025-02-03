import CryptoJS from 'crypto-js';

const SECRET_KEY =  import.meta.env.VITE_SECRET_KEY || 'my-secret-key';  // Utilisation de la variable d'environnement

export const encryptData = (data: string): string => {
  try {
    // Vérifie si data est bien une chaîne
    if (typeof data !== 'string') {
      throw new Error('Data must be a string');
    }
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    console.log("Encrypted data:", encrypted);
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

export const decryptData = (encryptedData: string): string => {
  try {

    if (typeof encryptedData !== 'string') {
      throw new Error('Encrypted data must be a string');
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Decryption failed, result is empty');
    }
    console.log("Decrypted data:", decrypted);
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};
