import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { News } from '../models/news.model';

export interface NewsState {
  list: News[];
  singleNews: News | null;
  totalPages: number;
  totalItems: number;
  page: number;
  perPage: number;
  loading: boolean;
}

const initialState: NewsState = {
  list: [],
  singleNews: null,
  totalItems: 0,
  page: 1,
  perPage: 5,
  totalPages: 0,
  loading: true,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSingleNews(state, action: PayloadAction<News>) {
      state.singleNews = action.payload;
    },
    setNews(state, action: PayloadAction<NewsState>) {
      state.list = action.payload.list;
      state.totalPages = action.payload.totalPages;
      state.totalItems = action.payload.totalItems;
    },
    addNews(state, action: PayloadAction<NewsState>) {
      state.list = [...state.list, ...action.payload.list];
      state.totalPages = action.payload.totalPages;
      state.totalItems = action.payload.totalItems;
    },
    changePage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    changePerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearNewsList(state) {
      state.list = [];
    },
  },
});

export const getSignleNews = (id: number) => {
  return async (dispatch: any) => {
    dispatch(newsActions.setLoading(true));
    const response = await axios.get<News>(`/news/${id}`);
    if (response?.status === 200) {
      dispatch(newsActions.setSingleNews(response.data));
      dispatch(newsActions.setLoading(false));
    }
  };
};

export const getNews = (params: { page: number; perPage: number }) => {
  return async (dispatch: any) => {
    dispatch(newsActions.setLoading(true));
    const response = await axios.get<NewsState>('/news', { params });
    if (response?.status === 200) {
      dispatch(newsActions.addNews(response.data));
      dispatch(newsActions.setLoading(false));
    }
  };
};

export const refreshNews = (params: { page: number; perPage: number }) => {
  return async (dispatch: any) => {
    dispatch(newsActions.setLoading(true));
    const response = await axios.get<NewsState>('/news', { params });
    if (response?.status === 200) {
      dispatch(newsActions.setNews(response.data));
      dispatch(newsActions.setLoading(false));
    }
  };
};

export const newsActions = newsSlice.actions;

export default newsSlice.reducer;
