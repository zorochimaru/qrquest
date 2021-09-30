import React, { FC } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const Chip: FC<any> = (props) => {
    return (
        <View style={styles.container}>
            <TouchableHighlight onPress={props.onPress(props.tag.id)}>
                <View style={styles.button}>
                    <Text>{props.tag.value}</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
    },
    countContainer: {
        alignItems: 'center',
        padding: 10,
    },
    countText: {
        color: '#FF00FF',
    },
});
export default Chip;
