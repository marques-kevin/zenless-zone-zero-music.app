import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { playerReducer } from "./player/reducers";
import { diReducer } from "./di/reducers";
import { actions } from "./actions";
import { authReducer } from "./auth/reducers";
import { DiInjectable } from "./di/types";
import { modalsReducer } from "./modals/reducers";
import { playlistsReducer } from "./playlists/reducers";
import { newsReducer } from "./news/reducers";
import { globalReducer } from "./global/reducers";

const reducers = combineReducers({
  player: playerReducer,
  di: diReducer,
  global: globalReducer,
  news: newsReducer,
  auth: authReducer,
  modals: modalsReducer,
  playlists: playlistsReducer,
});

export const init = (initialState = {}, di: DiInjectable) => {
  const store = configureStore({
    reducer: reducers,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  store.dispatch(actions.di.register(di));

  return { store };
};

export type RootState = ReturnType<typeof reducers>;
