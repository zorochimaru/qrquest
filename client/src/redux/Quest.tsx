import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { DropResult } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { httpClient } from '../api/httpClient';
export interface Answer {
    id?: string;
    value: string;
    isRight: boolean;
}
export interface Question {
    id?: string,
    questId: string,
    text: string,
    locationLink: string,
    order: number,
    answers: Answer[],
    imgUrl?: string,
    file?: File | null,
    quest?: { name: string, date: Date | '' }
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
    currentQuestId: string,
    questionList: Question[];
    singleQuestion: Question | null;
}

const initialState: QuestState = {
    loading: false,
    questList: [],
    currentQuestId: '',
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
        fillQuestions(state, action: PayloadAction<Question[]>) {
            state.questionList = action.payload;
        },
        changePage(state, action: PayloadAction<number>) {
            state.questPage = action.payload;
        },
        changePerPage(state, action: PayloadAction<number>) {
            state.perQuestPage = action.payload;
        },
        selectCurrentQuestId(state, action: PayloadAction<string>) {
            state.currentQuestId = action.payload;
        },
        clearQuestId(state) {
            state.currentQuestId = '';
        },
        changeOrder(state, action: PayloadAction<DropResult>) {
            const temp = [...state.questionList];
            const d = temp[action.payload.destination!.index];
            temp[action.payload.destination!.index] = temp[action.payload.source.index];
            temp[action.payload.source.index] = d;
            state.questionList = temp;
        },
        setLoader(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const changeOrderOnDB = (dropRes: DropResult, fromId: string, toId: string, questId: string) => {
    return async (dispatch: any) => {
        dispatch(questActions.setLoader(true));
        const response = await httpClient
            .post('questions/changeOrder',
                { fromId, toId, fromIndex: dropRes.source.index, toIndex: dropRes.destination?.index }, { headers: { 'disableGlobalLoader': 1 } });
        if (response?.status === 200) {
            
            dispatch(getQuestionsByQuestId(questId));
            // dispatch(questActions.changeOrder(dropRes));
            dispatch(questActions.setLoader(false));
        }
    }
}


export const getSignleQuestion = (id: number) => {
    return async (dispatch: any) => {
        const response = await httpClient.get<Question>(`/questions/${id}`);
        if (response?.status === 200) {
            dispatch(questActions.setSingleQuestion(response.data));
        }
    }
}



export const editQuestion = (data: { id: string, fData: FormData, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await httpClient.put(`/questions/${data.id}`, data.fData);
        if (response?.status === 200) {
            // dispatch(getQuestionsByQuestId({ page: data.page, perPage: data.perPage }));
            toast.success(`${data.fData.get('title')} edited`)
        }
    }
}


export const getQuestionsByQuestId = (questId: string) => {
    return async (dispatch: any) => {
        dispatch(questActions.selectCurrentQuestId(questId));
        const response = await httpClient.get<Question[]>(`/questions/questId/${questId}`, { headers: { 'disableGlobalLoader': 1 } });
        if (response?.status === 200) {
            dispatch(questActions.fillQuestions(response.data));
        }
    }
}

export const getQuestList = (params: {
    page: number, perPage: number
}) => {
    return async (dispatch: any) => {
        const response = await httpClient.get<{ data: any[], totalPages: number, totalItems: number }>(`/quests`, { params });
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
