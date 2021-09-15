import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Tag } from "./Library";
import { Notification, uiActions } from "./Ui";

export interface News {
    id?: string,
    title: string,
    text: string,
    tags: Tag[],
    authorId?: string,
    link?: string,
    imgUrl?: string,
    file?: File | null
}
export interface NewsState {
    list: News[],
    singleNews: News | null,
    totalPages?: number
    totalItems: number,
    page: number,
    perPage: number
}

const initialState: NewsState = {
    list: [],
    singleNews: null,
    totalItems: 0,
    page: 1,
    perPage: 5,
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        setSingleNews(state, action: PayloadAction<News>) {
            state.singleNews = action.payload;
        },
        fillNews(state, action: PayloadAction<NewsState>) {
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

export const getSignleNews = (id: number) => {
    return async (dispatch: any) => {
        const response = await axios.get<News>(`/news/${id}`);
        if (response?.status === 200) {
            dispatch(newsActions.setSingleNews(response.data));
        }
    }
}


export const createNews = (data: { fData: FormData, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await axios.post<Notification>(`/news/create`, data.fData);
        if (response?.status === 200) {
            dispatch(getNews({ page: data.page, perPage: data.perPage }));
            dispatch(uiActions.addNotification(response.data));
        }
    }
}

export const editNews = (data: { id: string, fData: FormData, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await axios.put<Notification>(`/news/${data.id}`, data.fData);
        if (response?.status === 200) {
            dispatch(getNews({ page: data.page, perPage: data.perPage }));
            dispatch(uiActions.addNotification({ message: `${data.fData.get('title')} edited` }));
        }
    }
}

export const deleteNews = (data: { id: string, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await axios.delete<Notification>(`/news/delete/${data.id}`);
        if (response?.status === 200) {
            dispatch(getNews({ page: data.page, perPage: data.perPage }));
            dispatch(uiActions.addNotification(response.data));
        }
    }
}

export const getNews = (params: {
    page: number, perPage: number
}) => {
    return async (dispatch: any) => {
        const response = await axios.get<NewsState>(`/news`, { params });
        if (response?.status === 200) {
            dispatch(newsActions.fillNews(response.data));
        }
    }
}



export const newsActions = newsSlice.actions;

export default newsSlice.reducer;
