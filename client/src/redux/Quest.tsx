import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';
export interface Answer {
    id?: string;
    value: string;
    isRight: boolean;
}
export interface Question {
    id?: string,
    text: string,
    answers: Answer[],
    imgUrl?: string,
    file?: File | null
}
export interface Quest {
    id?: string;
    name: string;
    date: Date | '';
    imgUrl?: string;
    file?: File | null;
}
export interface QuestTable {
    questList: Quest[];
    totalQuests: number;
    questPage: number;
    perQuestPage: number;
    totalQuestPages: number;
}
export interface QuestState extends QuestTable {
    loading: boolean;
    questionList: Question[];
    singleQuestion: Question | null;
}

const initialState: QuestState = {
    loading: false,
    questList: [],
    totalQuests: 0,
    questPage: 1,
    perQuestPage: 5,
    totalQuestPages: 0,
    questionList: [],
    singleQuestion: null,
};

const questSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        fillQuestList(state, action: PayloadAction<{ list: Quest[], totalItems: number, totalPages: number }>) {
            state.questList = action.payload.list;
            state.totalQuestPages = action.payload.totalPages;
            state.totalQuests = action.payload.totalItems;
        },
        setSingleQuestion(state, action: PayloadAction<Question>) {
            state.singleQuestion = action.payload;
        },
        fillQuestion(state, action: PayloadAction<Question[]>) {
            state.questionList = action.payload;
        },
        changePage(state, action: PayloadAction<number>) {
            state.questPage = action.payload;
        },
        changePerPage(state, action: PayloadAction<number>) {
            state.perQuestPage = action.payload;
        },
    },
});

export const getSignleQuestion = (id: number) => {
    return async (dispatch: any) => {
        const response = await axios.get<Question>(`/question/${id}`);
        if (response?.status === 200) {
            dispatch(questActions.setSingleQuestion(response.data));
        }
    }
}



export const editQuestion = (data: { id: string, fData: FormData, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await axios.put(`/questions/${data.id}`, data.fData);
        if (response?.status === 200) {
            // dispatch(getQuestionsByQuestId({ page: data.page, perPage: data.perPage }));
            toast.success(`${data.fData.get('title')} edited`)
        }
    }
}


export const getQuestionsByQuestId = (questId: number) => {
    return async (dispatch: any) => {
        const response = await axios.get<Question[]>(`/questions`, { params: { questId } });
        if (response?.status === 200) {
            dispatch(questActions.fillQuestion(response.data));
        }
    }
}

export const getQuestList = (params: {
    page: number, perPage: number
}) => {
    return async (dispatch: any) => {
        const response = await axios.get<{ data: any[], totalPages: number, totalItems: number }>(`/quests`, { params });
        if (response?.status === 200) {
            dispatch(questActions.fillQuestList({
                list: response.data?.data,
                totalItems: response.data?.totalItems,
                totalPages: response.data?.totalPages,
            }));
        }
    }
}



export const questActions = questSlice.actions;

export default questSlice.reducer;
