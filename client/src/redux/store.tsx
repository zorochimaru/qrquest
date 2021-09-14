import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './Auth';
import UiReducer, { UIState } from './Ui';
import NewsReducer, { NewsState } from './News';
import LibraryReducer, { LibraryState } from './Library';
import QuestionReducer, { QuestionState } from './Questions';

export interface RootState {
    auth: AuthState
    ui: UIState
    news: NewsState
    library: LibraryState
    question: QuestionState
}

const rootReducer = combineReducers({
    auth: authReducer,
    ui: UiReducer,
    news: NewsReducer,
    library: LibraryReducer,
    question: QuestionReducer
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