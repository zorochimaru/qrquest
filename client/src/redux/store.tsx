import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth';
import UiReducer from './Ui';
import NewsReducer from './News';
import LibraryReducer from './Library';
import QuestReducer from './Quest';

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