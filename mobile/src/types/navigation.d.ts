import { NavigatorScreenParams } from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootDrawerParamList {}
  }
}

export type RootDrawerParamList = {
  auth: NavigatorScreenParams<AuthParamList>;
  news: undefined;
  account: undefined;
  qrQuest: NavigatorScreenParams<QrQuestParamList>;
};

export type AuthParamList = {
  login: undefined;
  register: undefined;
  forgotPassword: undefined;
};

export type QrQuestParamList = {
  scanner: undefined;
  question: { questionId: string };
  map: undefined;
  results: undefined;
};
