import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { createTransform } from 'redux-persist';
import { encryptData, decryptData } from "@/utils/cryptoUtils";

const encryptTransform = createTransform(
  (inboundState, key) => {
    if (key === 'auth') {

      if (inboundState.token) {
        return {
          ...inboundState,
          token: encryptData(inboundState.token),
        };
      }
    } else if (key === 'token' && inboundState) {

      return encryptData(inboundState);
    }

    return inboundState;
  },

  (outboundState, key) => {


    if (key === 'auth' && outboundState && outboundState.token) {
      const decryptedToken = decryptData(outboundState.token);
      return {
        ...outboundState,
        token: decryptedToken ? decryptedToken : null,
      };
    } else if (key === 'token' && outboundState) {
      const decryptedToken = decryptData(outboundState);
      return decryptedToken || null;
    }

    return outboundState;
  },
);




const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptTransform],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;