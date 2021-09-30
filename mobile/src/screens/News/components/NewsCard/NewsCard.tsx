import React, { FC } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import Chip from '../../../../components/Chip/Chip';
import { News } from '../../../../models/news.model';
import { REACT_APP_API_URL } from '@env';

const NewsCard: FC<{ item: News }> = ({ item }) => {
    const onPressLearnMore = () => {
    };
    const onPressTag = (tagId: string) => {

    };
    return (
        <View
            style={styles.newsCardWrapper}
        >
            <View>
                <Text style={styles.title}>{item.title}</Text>
            </View>
            <View><Image
                style={styles.cover}
                source={{ uri: item.imgUrl || `${REACT_APP_API_URL}/uploads/images/logo.png` }}
            /></View>
            <View style={styles.tags}>
                {item.tags.map(tag => (
                    <Chip key={tag.id} tag={tag} onPress={onPressTag} />
                ))}
            </View>
            <View>
                <Text style={styles.description}>{item.text.substring(0, 80)}...</Text>
            </View>
            <View><Button onPress={onPressLearnMore} title="Learn More" /></View>
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
        flexDirection: 'column',
        minHeight: 200,
        padding: 20,
        width: '100%',
        marginVertical: 10,
    },
    cover: {
        width: '100%',
        height: 150,

    },
    tags: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
});
export default NewsCard;
