import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        color: 'red',
        fontSize: hp(3.1),
        fontWeight: '600',
    },
    iconText: {
        height: hp(4),
        width: wp(10)
    },
    artworkContainer: {
        height: hp(30),
        width: hp(30),
        borderRadius: hp(20),
        marginBottom: hp(10),
        borderWidth: wp(2),
        borderColor: "red",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row"
    },
    artworkText: {
        height: hp(10),
        width: hp(10)
    },
    trackInfo: {
        alignItems: 'center',
        marginBottom: hp(5),
    },
    trackTitle: {
        color: '#000',
        fontSize: hp(2.4),
        fontWeight: 'bold',
        marginBottom: hp(2),
        textAlign: "center"
    },
    trackArtist: {
        color: '#bbb',
        fontSize: 16,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(10),
    },
    progressBar: {
        width: '100%',
    },
    timeText: {
        color: '#000',
        fontSize: 12,
        marginHorizontal : wp(2)
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(10),
        paddingHorizontal: wp(10),
    },
    controlText: {
        color: '#000',
        fontSize: 28,
    },
    activeControl: {
        color: '#4CAF50',
    },
    playButtonText: {
        fontSize: 34,
        color: '#fff',
        marginLeft: 4,
    },
    volumeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    volumeSlider: {
        flex: 1,
        marginHorizontal: 10,
    },
    volumeIcon: {
        color: '#fff',
        fontSize: 20,
    },
    videoprogressBar : {
        marginBottom : hp(10)
    }
});