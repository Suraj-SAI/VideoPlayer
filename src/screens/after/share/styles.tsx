import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    videoText: {
        fontSize: hp(2.5),
        color: "red",
        fontWeight: "bold",
        fontStyle: "italic",
        marginHorizontal: wp(2),
    },
    videTextView: {
        paddingHorizontal: wp(2),
        flexDirection: "row",
        justifyContent: "space-between"
    },
    videoTextBox: {
        flexDirection: "row",
        alignItems: "center"
    },
    playImage: {
        height: hp(3),
        width: hp(3)
    },
    line: {
        height: hp(0.2),
        backgroundColor: "red",
        width: wp(96),
        alignSelf: "center",
        marginTop: hp(1),
    },
    bodyView: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    recieveView: {
        backgroundColor: "red",
        marginBottom: hp(2),
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        borderRadius: wp(2),
        width : wp(40)
    },
    recieveText: {
        color: "#fff",
        fontSize : hp(2.1),
        fontWeight : "bold",
        textAlign : "center"
    },
    sendView: {
        backgroundColor: "red",
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        borderRadius: wp(2),
        width : wp(40)
    },
    sendText: {
        color: "#fff",
        fontSize : hp(2.1),
        fontWeight : "bold",
        textAlign : "center"
    }
})