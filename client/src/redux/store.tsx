import { combineReducers, configureStore } from '@reduxjs/toolkit';

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
const store = configureStore({ reducer: rootReducer });


export default store;