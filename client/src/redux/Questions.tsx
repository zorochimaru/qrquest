import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Notification, uiActions } from "./Ui";
export interface Answer {
    id: string,
    value: string
}
export interface Question {
    id?: string,
    question: string,
    answers: Answer[],
    imgUrl?: string,
    file?: File | null
}
export interface QuestionState {
    list: Question[],
    singleQuestion: Question | null,
    totalPages?: number
    totalItems: number,
    page: number,
    perPage: number
}

const initialState: QuestionState = {
    list: [],
    singleQuestion: null,
    totalItems: 0,
    page: 1,
    perPage: 5,
};

const questionSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        setSingleQuestion(state, action: PayloadAction<Question>) {
            state.singleQuestion = action.payload;
        },
        fillQuestion(state, action: PayloadAction<QuestionState>) {
            state.list = action.payload.list;
            state.totalPages = action.payload.totalPages;
            state.totalItems = action.payload.totalItems;
        },
        changePage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        changePerPage(state, action: PayloadAction<number>) {
            state.perPage = action.payload;
        },
    },
});

export const getSignleQuestion = (id: number) => {
    return async (dispatch: any) => {
        const response = await axios.get<Question>(`/question/${id}`);
        if (response?.status === 200) {
            dispatch(questionActions.setSingleQuestion(response.data));
        }
    }
}

export const createQuestion = (data: { fData: FormData, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await axios.post<Notification>(`/questions/create`, data.fData);
        if (response?.status === 200) {
            dispatch(getQuestion({ page: data.page, perPage: data.perPage }));
            dispatch(uiActions.addNotification(response.data));
        }
    }
}

export const editQuestion = (data: { id: string, fData: FormData, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await axios.put<Notification>(`/questions/${data.id}`, data.fData);
        if (response?.status === 200) {
            dispatch(getQuestion({ page: data.page, perPage: data.perPage }));
            dispatch(uiActions.addNotification({ message: `${data.fData.get('title')} edited` }));
        }
    }
}

export const deleteQuestion = (data: { id: string, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await axios.delete<Notification>(`/questions/${data.id}`);
        if (response?.status === 200) {
            dispatch(getQuestion({ page: data.page, perPage: data.perPage }));
            dispatch(uiActions.addNotification(response.data));
        }
    }
}

export const getQuestion = (params: {
    page: number, perPage: number
}) => {
    return async (dispatch: any) => {
        const response = await axios.get<QuestionState>(`/questions`, { params });
        if (response?.status === 200) {
            dispatch(questionActions.fillQuestion(response.data));
        }
    }
}



export const questionActions = questionSlice.actions;

export default questionSlice.reducer;
