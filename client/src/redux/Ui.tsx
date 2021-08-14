import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CloseReason, SnackbarKey, SnackbarMessage, VariantType } from "notistack";


export interface Notification {
    message: SnackbarMessage,
    options?: {
        variant?: VariantType,
        action?(key: SnackbarKey): void,
        onClose?(event: React.SyntheticEvent<any> | null, reason: CloseReason, key?: SnackbarKey): void
    },
    key?: SnackbarKey,
    dismissed?: boolean
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
            state.notifications.push({ ...action.payload, key: action.payload.key || new Date().getTime() + Math.random() });
        },
        closeNotification(state, action: PayloadAction<string | number | null>) {
            state.notifications = state.notifications.map(notification => (
                (!action?.payload || notification.key === action!.payload)
                    ? { ...notification, dismissed: true }
                    : { ...notification }
            ))
        },
        removeNotification(state, action: PayloadAction<string | number>) {
            state.notifications = state.notifications.filter(not => not.key !== action.payload);
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        }
    }
})



export const uiActions = uiSlice.actions;

export default uiSlice.reducer;