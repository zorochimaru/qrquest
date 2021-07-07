import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
    status: 'success' | 'info' | 'warning' | 'error',
    text: string
}

export interface UI {
    notifications: Notification[]
};

const initialState: UI = {
    notifications: []
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<Notification>) {
            if (state.notifications.length < 3) {
                state.notifications.push({ status: action.payload.status, text: action.payload.text });
            } else {
                state.notifications.splice(0, 1);
                state.notifications.push({ status: action.payload.status, text: action.payload.text });
            }
        },
        closeNotification(state, action: PayloadAction<number>) {
            state.notifications.splice(action.payload, 1);
        }
    }
})

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;