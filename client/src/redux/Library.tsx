import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Notification, uiActions } from "./Ui";


export interface Tag {
    id: number,
    value: string
}

export interface LibraryState {
    tags: Tag[],
}

const initialState: LibraryState = {
    tags: [],
};

const librarySlice = createSlice({
    name: 'library',
    initialState,
    reducers: {
        fillTags(state, action: PayloadAction<Tag[]>) {
            state.tags = action.payload;
        },
    },
});

export const deleteTag = (id: number) => {
    return async (dispatch: any) => {
        const response = await axios.delete<Notification>('library/tag/' + id);
        if (response?.status === 200) {
            dispatch(uiActions.addNotification(response.data));
        }
    }
}

export const editTag = (tag: Tag) => {
    return async (dispatch: any) => {
        const response = await axios.put<Notification>('library/tag', tag);
        if (response?.status === 200) {
            dispatch(uiActions.addNotification(response.data));
        }
    }
}

export const createTag = (text: string) => {
    return async (dispatch: any) => {
        const response = await axios.post<Notification>('library/tag', { text });
        if (response?.status === 200) {
            dispatch(uiActions.addNotification(response.data));
        }
    }
}

export const fetchTags = () => {
    return async (dispatch: any) => {
        const response = await axios.get<Tag[]>(`library/tags`);
        if (response?.status === 200) {
            dispatch(libraryActions.fillTags(response.data));
        }
    }
}

export const libraryActions = librarySlice.actions;

export default librarySlice.reducer;
