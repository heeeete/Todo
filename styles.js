import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 30,
	},
	header: {
		flex: 0.2,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 20,
	},
	hText: {
		fontSize: 23,
		fontFamily: "IMHyemin-Regular",
	},
	Input: {
		backgroundColor: "white",
	},
	todo: {
		backgroundColor: "rgb(248, 248, 248)",
		paddingHorizontal: 10,
		paddingVertical: 15,
		marginBottom: 10,
		borderRadius: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 3,
		shadowColor: "black",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 1,
		height: 40,
	},
	todoText: {
		flex: 1,
		fontSize: 15,
		fontFamily: "IMHyemin-Regular",
	},
	edit: {
		flex: 0.1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	CheckBox: {
		borderRadius: 50,
		marginRight: 10,
	},
	addTodo: {
		flex: 0.1,
	},
	addTodoHeader: {
		flex: 0.1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	addText: {
		padding: 15,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	editText: {
		padding: 20,
		fontSize: 18,
		fontFamily: "IMHyemin-Regular",
	},
	editBtn: {
		padding: 20,
		fontFamily: "IMHyemin-Regular",
	},
	undefinedTodoView: {
		flex: 0.5,
		alignItems: "center",
		justifyContent: "flex-end",
	},
	undefinedTodoText: {
		color: "grey",
		textAlign: "center",
		fontFamily: "IMHyemin-Regular",
	},
});
