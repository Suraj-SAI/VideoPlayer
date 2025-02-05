import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Path } from "../constants/path";
import Home from "../screens/after/home";
import { navigationRef } from "../services/navigationService";
import FullScreenVideoScreen from "../screens/after/FullScreenVideo";
import Music from "../screens/after/audio";
import Instructions from "../screens/after/instructions";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import { music, play, share } from "../constants/images";
import Share from "../screens/after/share";
import AudioFullScreen from "../screens/after/audioFullScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PlayTimeTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { position: 'absolute' },
                tabBarActiveTintColor: "orange",
                tabBarInactiveTintColor: "red"
            }}
        >
            <Tab.Screen
                name={Path.AFTER}
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={play}
                            style={{ width: size, height: size }}
                        />
                    )
                }}
            />
            <Tab.Screen name={Path.MUSIC} component={Music} options={{
                tabBarIcon: ({ color, size }) => (
                    <Image
                        source={music}
                        style={{ width: size, height: size }}
                    />
                )
            }} />
            <Tab.Screen name={Path.SHARE} component={Share} options={{
                tabBarIcon: ({ color, size }) => (
                    <Image
                        source={share}
                        style={{ width: size, height: size }}
                    />
                )
            }} />
        </Tab.Navigator>
    );
};

const Navigator = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={Path.BOTTOMTABTAB} screenOptions={{ headerShown: false }}>
                <Stack.Screen name={Path.BOTTOMTABTAB} component={PlayTimeTabs} />
                <Stack.Screen name={Path.FullScreenVideo} component={FullScreenVideoScreen} />
                <Stack.Screen name={Path.INSTRUCTIONS} component={Instructions} />
                <Stack.Screen name={Path.MUSICFULLSCREEN} component={AudioFullScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator;