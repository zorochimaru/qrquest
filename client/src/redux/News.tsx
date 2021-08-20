import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface News {
    id: string,
    title: string,
    text: string,
    authorId: string,
    link?: string,
    imgUrl?: string,
}
export interface NewsState {
    list?: News[],
    totalPages?: number
    totalItems?: number
}

const initialState: NewsState = {};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        fillNews(state, action: PayloadAction<NewsState>) {
            state.list = action.payload.list;
            state.totalPages = action.payload.totalPages;
            state.totalItems = action.payload.totalItems;
        },

    },
});

export const createNews = (data: {
    title: string, text: string, imgUrl: string
}) => {
    return async (dispatch: any) => {
        const response = await axios.post<NewsState>(`/news/create`, data);
        if (response) {
            dispatch(newsActions.fillNews(response.data));
        }
    }
}

export const getNews = (params: {
    page: number, perPage: number
}) => {
    return async (dispatch: any) => {
        const response = await axios.get<NewsState>(`/news`, { params });
        if (response) {
            dispatch(newsActions.fillNews(response.data));
        }
    }
}

export const newsActions = newsSlice.actions;

export default newsSlice.reducer;
