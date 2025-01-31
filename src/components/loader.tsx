import { View, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

const LoaderScreen = ({ visible }: any) => {
    return (
        <View style={styles.container}>{visible && <ActivityIndicator size="large" color="orange" />}</View>
    )
}

export default LoaderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})