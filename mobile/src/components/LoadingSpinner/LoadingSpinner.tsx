import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingSpinner = (props: any) => {
    return (
        props.isLoading ?
            <View style={[styles.container, styles.horizontal]}>

                <ActivityIndicator size="large" />

            </View> :
            props.children
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});
export default LoadingSpinner;
