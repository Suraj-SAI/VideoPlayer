import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Path } from "../constants/path";
import FirstTime from "../screens/firstTime/indx";
import Home from "../screens/after/home";
import { navigationRef } from "../services/navigationService";
import FullScreenVideoScreen from "../screens/after/FullScreenVideo";

const Stack = createNativeStackNavigator();

const Navigator = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={Path.AFTER} screenOptions={{ headerShown: false }}>
                <Stack.Screen name={Path.FIRST_TIME} component={FirstTime} />
                <Stack.Screen name={Path.AFTER} component={Home} />
                <Stack.Screen name={Path.FullScreenVideo} component={FullScreenVideoScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator;