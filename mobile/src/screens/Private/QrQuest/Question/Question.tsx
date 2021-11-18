import React, { FC, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestion } from '../../../../redux/QrQuest';
import { RootState } from '../../../../redux/store';
import { QuestionProps } from '../QrQuestStack';

export const QuestionScreen: FC<QuestionProps> = props => {
  const dispatch = useDispatch();
  const questionId = props.route.params.questionId;
  const question = useSelector((state: RootState) => state.qrQuest.question);
  useEffect(() => {
    dispatch(fetchQuestion(questionId));
  }, [dispatch, questionId]);

  const handleClick = (answerId: string) => {
    // TODO answer to the question to API
    console.log(answerId);
  };
  return (
    <View style={styles.centeredView}>
      <Text>{question?.text}</Text>
      {question?.answers.map(answer => (
        <Button key={answer.id} onPress={() => handleClick(answer.id)}>
          {answer.text}
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
