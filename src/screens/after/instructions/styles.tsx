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
    instructionView: {
        paddingHorizontal: wp(2),
        marginTop: hp(1)
    },
    instructionText: {
        fontSize: hp(2.5),
        fontWeight: "bold",
        color : "#000"
    }
})