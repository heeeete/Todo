import Todo from "./todo";
import RememberBook from "./rememberbook";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// screenOptions를 별도의 객체로 선언
const screenOptions = {
	drawerActiveBackgroundColor: "#F2BED1",
	drawerActiveTintColor: "white",
	headerShown: false,
	drawerStyle: {},
	drawerLabelStyle: {
		fontSize: 20,
		fontFamily: "IMHyemin-Regular",
	},
};

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer>
				<Drawer.Navigator initialRouteName="Todo" screenOptions={screenOptions}>
					<Drawer.Screen name="Todo" component={Todo} />
					<Drawer.Screen name="RememberBook" component={RememberBook} />
				</Drawer.Navigator>
			</NavigationContainer>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	drawerContainer: {
		flex: 1,
		backgroundColor: "red",
	},
});
