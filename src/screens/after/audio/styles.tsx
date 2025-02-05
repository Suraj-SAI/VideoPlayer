import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    videoText: {
        fontSize: hp(2.5),
        color: "red",
        fontWeight: "bold",
        fontStyle: "italic",
        marginHorizontal: wp(2),
    },
    videoTextBox: {
        flexDirection: "row",
        alignItems: "center"
    },
    videTextView: {
        paddingHorizontal: wp(2),
        flexDirection: "row",
        justifyContent: "space-between"
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
    videoItem: {
        flex: 1,
        margin: wp(2),
        height: hp(20),
        borderColor: "red",
        borderWidth: wp(0.2),
        borderRadius: wp(2),
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-around",
        paddingHorizontal: wp(2)
    },
    videoImage: {
        borderRadius: 10,
        height: hp(8),
        width: hp(8),
        marginTop : hp(2)
    },
    videoName: {
        color: "#000",
        fontSize: hp(2.1),
        textAlign: "center",
    },
    videoList: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(2),
    },
    noVideosText: {
        fontSize: hp(2),
        color: "#555",
        textAlign: "center",
        marginTop: hp(5),
    },
})