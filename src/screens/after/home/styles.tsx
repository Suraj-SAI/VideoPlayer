import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    videoText: {
        fontSize: hp(2.5),
        color: "#000",
        textAlign: "center",
        marginTop: hp(1),
        fontWeight: "bold"
    },
    line: {
        height: hp(0.2),
        backgroundColor: "#000",
        width: wp(90),
        alignSelf: "center",
        marginTop: hp(1),
    },
    noVideosText: {
        fontSize: hp(2),
        color: "#555",
        textAlign: "center",
        marginTop: hp(5),
    },
    videoList: {
        paddingVertical: hp(1),
        paddingHorizontal : wp(2)
    },
    videoItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: wp(2),
        padding: wp(2),
        backgroundColor: "#000",
        borderRadius: 10,
        height: hp(18)
    },
    videoImage: {
        height: hp(9),
        width: hp(9)
    },
    videoName: {
        color: "#fff",
        marginTop: hp(2),
        textAlign: "center"
    }
})