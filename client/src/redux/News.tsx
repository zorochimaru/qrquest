import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tag } from "./Library";
import { toast } from "react-toastify";
import { httpClient } from '../api/httpClient';
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
        const response = await httpClient.get<News>(`/news/${id}`);
        if (response?.status === 200) {
            dispatch(newsActions.setSingleNews(response.data));
        }
    }
}


export const createNews = (data: { fData: FormData, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await httpClient.post(`/news/create`, data.fData);
        if (response?.status === 200) {
            dispatch(getNews({ page: data.page, perPage: data.perPage }));
            toast.success(response.data);
        }
    }
}

export const editNews = (data: { id: string, fData: FormData, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await httpClient.put(`/news/${data.id}`, data.fData);
        if (response?.status === 200) {
            dispatch(getNews({ page: data.page, perPage: data.perPage }));
            toast.success(`${data.fData.get('title')} edited`);
        }
    }
}

export const deleteNews = (data: { id: string, page: number, perPage: number }) => {
    return async (dispatch: any) => {
        const response = await httpClient.delete(`/news/delete/${data.id}`);
        if (response?.status === 200) {
            dispatch(getNews({ page: data.page, perPage: data.perPage }));
            toast.success(response.data);
        }
    }
}

export const getNews = (params: {
    page: number, perPage: number
}) => {
    return async (dispatch: any) => {
        const response = await httpClient.get<NewsState>(`/news`, { params });
        if (response?.status === 200) {
            dispatch(newsActions.fillNews(response.data));
        }
    }
}



export const newsActions = newsSlice.actions;

export default newsSlice.reducer;
