import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
    isLoading: boolean
};

const initialState: UIState = {

    isLoading: false
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        }
    }
})



export const uiActions = uiSlice.actions;

export default uiSlice.reducer;