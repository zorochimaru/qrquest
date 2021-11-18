import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import { QrQuestParamList } from '../../../types/navigation';
import { QrScanner } from './QrScanner/QrScanner';
import { QuestionScreen } from './Question/Question';

const QrStack = createNativeStackNavigator<QrQuestParamList>();

export type QuestionProps = NativeStackScreenProps<
  QrQuestParamList,
  'question'
>;

export const QrQuestStack = () => {
  return (
    <QrStack.Navigator initialRouteName="scanner">
      <QrStack.Screen
        options={{
          title: 'Scan QR',
        }}
        name="scanner"
        component={QrScanner}
      />
      <QrStack.Screen
        options={{
          title: 'Question',
        }}
        name="question"
        component={QuestionScreen}
      />
    </QrStack.Navigator>
  );
};
