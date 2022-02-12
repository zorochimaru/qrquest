import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
    loadStack: string[];
};

const initialState: UIState = {

    loadStack: []
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addLoadRequest(state, action: PayloadAction<string>) {
            state.loadStack.push(action.payload);
        },
        removeLoadRequest(state, action: PayloadAction<string>) {
            state.loadStack = state.loadStack.filter(x => x !== action.payload);
        },
    }
})



export const uiActions = uiSlice.actions;

export default uiSlice.reducer;