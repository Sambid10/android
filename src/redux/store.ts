import { createMMKV } from 'react-native-mmkv'
import {
  FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE,
  persistReducer, persistStore,
} from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from "./slices/userSlice"
import {movieApi} from "./api/movie/movieApi"
export const storage = createMMKV({
  id: 'app-storage',
  encryptionKey: 'secretKey',
  encryptionType: 'AES-256'
})
const reduxStorage = {
  setItem: (key: string, value: string): Promise<boolean> => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string): Promise<string | undefined> => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string): Promise<void> => {
    storage.remove(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
};
const rootReducer=combineReducers({
  [movieApi.reducerPath]:movieApi.reducer,
  user:userReducer
})

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store=configureStore({
    reducer:persistedReducer,
    middleware:getDefaultMiddleware=>getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(movieApi.middleware)
})

export const persistor = persistStore(store);
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;