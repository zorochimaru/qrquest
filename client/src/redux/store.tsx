import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './Auth';
import UiReducer, { UI } from './Ui';

export interface RootState {
    auth: AuthState,
    ui: UI
}

const rootReducer = combineReducers({
    auth: authReducer,
    ui: UiReducer
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