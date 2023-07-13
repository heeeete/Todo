import { Switch, View } from "react-native";

const MySwitch = ({ onValueChange, value }) => (
	<View
		style={{
			transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
		}}
	>
		<Switch
			trackColor={{ false: "#ffeefd", true: "#F2BED1" }}
			thumbColor={value ? "#ffeefd" : "#ffeefd"}
			ios_backgroundColor="#F9F5F6"
			onValueChange={onValueChange}
			value={value}
		/>
	</View>
);

export default MySwitch;
