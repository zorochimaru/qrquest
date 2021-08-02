import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
    status: 'success' | 'info' | 'warning' | 'error',
    text: string
}

export interface UI {
    notifications: Notification[],
    isLoading: boolean
};

const initialState: UI = {
    notifications: [],
    isLoading: false
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
        },
        closeLastNotification(state) {
            state.notifications.splice(state.notifications.length - 1, 1);
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        }
    }
})

export const show5SecNotification = (notification: Notification) => {
    return async (dispatch: any) => {
        dispatch(uiActions.addNotification(notification));
        setTimeout(() => {
            dispatch(uiActions.closeLastNotification());
        }, 5000);
    }
}

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;