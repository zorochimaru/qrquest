import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { News } from '../../../../../models/news.model';
import { REACT_APP_API_URL } from '@env';
import { Card, Chip } from 'react-native-paper';
import { Tag } from '../../../../../models/Tag.model';

const NewsCard: FC<{ item: News }> = ({ item }) => {
  const onPressTag = (tag: Tag) => {
    console.log(tag);
  };
  return (
    <View style={styles.newsCardWrapper}>
      <Card>
        <Card.Cover
          source={{
            uri: item.imgUrl || `${REACT_APP_API_URL}/uploads/images/logo.png`,
          }}
        />
        <Card.Title
          title={item.title}
          subtitle={`${item.text.substring(0, 80)}...`}
        />
        <Card.Content style={styles.tags}>
          {item.tags.map(tag => (
            <Chip
              style={{ marginRight: 10 }}
              key={tag.id}
              onPress={() => onPressTag(tag)}>
              {tag.value}
            </Chip>
          ))}
        </Card.Content>
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  description: {
    marginBottom: 10,
    fontSize: 15,
    marginLeft: 5,
  },
  newsCardWrapper: {
    minHeight: 200,
    padding: 20,
  },
  cover: {
    width: '100%',
    height: 150,
  },
  tags: {
    flexDirection: 'row',
  },
});
export default NewsCard;
