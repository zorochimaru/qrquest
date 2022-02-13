import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { httpClient } from '../api/httpClient';

export interface Tag {
    id: string,
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

export const deleteTag = (id: string) => {
    return async (dispatch: any) => {
        const response = await httpClient.delete('library/tag/' + id);
        if (response?.status === 200) {
            dispatch(fetchTags());
            toast.success(response.data);
        }
    }
}

export const editTag = (tag: Tag) => {
    return async (dispatch: any) => {
        const response = await httpClient.put('library/tag', tag);
        if (response?.status === 200) {
            dispatch(fetchTags());
            toast.success(response.data);
        }
    }
}

export const createTag = (text: string) => {
    return async (dispatch: any) => {
        const response = await httpClient.post('library/tag', { text });
        if (response?.status === 200) {
            dispatch(fetchTags());
            toast.success(response.data);
        }
    }
}

export const fetchTags = () => {
    return async (dispatch: any) => {
        const response = await httpClient.get<Tag[]>(`library/tags`);
        if (response?.status === 200) {
            dispatch(libraryActions.fillTags(response.data));
        }
    }
}

export const libraryActions = librarySlice.actions;

export default librarySlice.reducer;
