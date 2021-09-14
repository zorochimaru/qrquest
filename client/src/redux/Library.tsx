import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
 

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
