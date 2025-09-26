import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import * as rp from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./ducks/rootReducer";
import type { AuthState } from "../interface/Auth";
import { initialState } from "./ducks/auth/slice";

const authTransform = rp.createTransform<AuthState, Partial<AuthState>>(
  (inboundState, key) => {
    return {
      user: inboundState.user,
      token: inboundState.token,
      isAuthenticated: inboundState.isAuthenticated,
    };
  },
  (outboundState, key) => {
    return {
      ...initialState,
      ...outboundState,
    };
  },
  { whitelist: ["auth"] }
);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ['auth'],
  transforms: [authTransform],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          rp.FLUSH,
          rp.REHYDRATE,
          rp.PAUSE,
          rp.PERSIST,
          rp.PURGE,
          rp.REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
