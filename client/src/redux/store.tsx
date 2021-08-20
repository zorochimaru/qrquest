import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './Auth';
import UiReducer, { UIState } from './Ui';
import NewsReducer, { NewsState } from './News';

export interface RootState {
    auth: AuthState,
    ui: UIState,
    news: NewsState
}

const rootReducer = combineReducers({
    auth: authReducer,
    ui: UiReducer,
    news: NewsReducer
});

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.options.action'],
            ignoredPaths: ['ui.notifications']
        },
    }),
});


export default store;