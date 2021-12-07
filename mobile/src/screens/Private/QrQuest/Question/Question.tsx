import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { answerToQuestion, fetchQuestion } from '../../../../redux/QrQuest';
import { RootState } from '../../../../redux/store';
import { QuestionProps } from '../QrQuestStack';

export const QuestionScreen: FC<QuestionProps> = props => {
  const dispatch = useDispatch();
  const questionId = props.route.params.questionId;
  const question = useSelector((state: RootState) => state.qrQuest.question);
  useEffect(() => {
    dispatch(fetchQuestion(questionId));
  }, [dispatch, questionId]);

  const handleClick = async (answerId: string) => {
    dispatch(answerToQuestion(question!.questId, questionId, answerId));
  };
  return (
    <View style={styles.centeredView}>
      <Card>
        <Card.Cover source={{ uri: question?.imgUrl }} />
        <Card.Content>
          <Title>{question?.text}</Title>
          <Paragraph>{question?.text}</Paragraph>
        </Card.Content>
        <Card.Actions>
          {question?.answers.map(answer => (
            <Button key={answer.id} onPress={() => handleClick(answer.id)}>
              {answer.text}
            </Button>
          ))}
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
});
