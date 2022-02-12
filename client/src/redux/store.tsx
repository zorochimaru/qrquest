import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './Auth';
import UiReducer, { UIState } from './Ui';
import NewsReducer, { NewsState } from './News';
import LibraryReducer, { LibraryState } from './Library';
import QuestReducer, { QuestState } from './Quest';

// export interface RootState {
//     auth: AuthState
//     ui: UIState
//     news: NewsState
//     library: LibraryState
//     quest: QuestState
// }

const rootReducer = combineReducers({
    auth: authReducer,
    ui: UiReducer,
    news: NewsReducer,
    library: LibraryReducer,
    quest: QuestReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActionPaths: ['payload.options.action'],
                ignoredPaths: ['ui.notifications']
            },
        }),

});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;