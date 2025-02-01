import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    videoText: {
      fontSize: hp(2.5),
      color: "#000",
      textAlign: "center",
      marginTop: hp(1),
      fontWeight: "bold",
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
      paddingHorizontal: wp(2),
    },
    videoItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      margin: wp(2),
      borderRadius: 10,
      height: hp(20),
      position: "relative", 
    },
    textContainer: {
      position: "absolute",
      bottom: hp(1),
      left: wp(2),
      right: wp(2),
      zIndex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)", 
      padding: wp(1),
      borderRadius: 5,
    },
    videoName: {
      color: "#fff",
      fontSize: hp(1.8), 
      textAlign: "center",
    },
    videoImage: {
      width: "100%", 
      height: "100%", 
      resizeMode: "cover", 
      borderRadius: 10,

    },
  });
  