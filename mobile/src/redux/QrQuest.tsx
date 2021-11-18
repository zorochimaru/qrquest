import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Question } from '../models/question.model';

export interface QrQuestState {
  question: Question | null;
}

const initialState: QrQuestState = {
  question: null,
};

const qrQuestSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setQuestion(state, action: PayloadAction<Question>) {
      state.question = action.payload;
    },
  },
});

export const fetchQuestion = (id: string) => {
  return async (dispatch: any) => {
    try {
      const response = await axios.get<any>(`/questions/${id}`);
      if (response?.status === 200) {
        const question: Question = {
          id: response.data.id,
          text: response.data.question,
          answers: (response.data.answers as Array<any>).map(a => {
            return { id: a.id, text: a.value };
          }),
        };
        dispatch(qrQuestActions.setQuestion(question));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const qrQuestActions = qrQuestSlice.actions;

export default qrQuestSlice.reducer;
