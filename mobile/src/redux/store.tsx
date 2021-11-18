import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './Auth';
import newsReducer, { NewsState } from './News';
import qrQuestReducer, { QrQuestState } from './QrQuest';
import UiReducer, { UIState } from './Ui';

export interface RootState {
  auth: AuthState;
  news: NewsState;
  ui: UIState;
  qrQuest: QrQuestState;
}

const rootReducer = combineReducers({
  auth: authReducer,
  news: newsReducer,
  ui: UiReducer,
  qrQuest: qrQuestReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload.options.action'],
      },
    }),
});

export default store;
