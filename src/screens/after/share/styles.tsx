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
})