import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Modal,
} from "react-native";
import { useState } from "react";
import Modal2 from "react-native-modal";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScrollView } from "react-native-gesture-handler";
import {
	Button,
	TextInput,
	Provider as PaperProvider,
} from "react-native-paper";
import { theme } from "./react-native-paper-theme"; // theme.js에서 theme 가져오기
import axios from "axios";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const underlineColor = "pink"; // focus 상태일 때와 아닐 때의 색상

function MyTextInput({ text, onChangeText, label }) {
	console.log(text);
	return (
		<TextInput
			value={text}
			returnKeyType="done"
			onChangeText={onChangeText}
			style={styles.Input}
			label={label}
			underlineColor={underlineColor}
			multiline={true}
		></TextInput>
	);
}

function AddModal({ isAddModal, setIsAddModal }) {
	const [title, setTitle] = useState("");
	const [review, setReview] = useState("");
	const [user, setUser] = useState("HUIPARK");

	const onChangeTitle = (payload) => {
		setTitle(payload);
	};
	const onChangeReview = (payload) => {
		setReview(payload);
	};

	const closeModal = () => {
		setIsAddModal(false);
		setTitle("");
		setReview("");
	};

	const AddRememberBook = async () => {
		try {
			const response = await axios.post(
				"http://127.0.0.1:3001/addrememberbook",
				{
					user: user,
					title: title,
					review: review,
				}
			);
			console.log("성공");
		} catch (error) {
			console.log(error);
		}
	};

	const Header = () => {
		return (
			<View style={styles.addReviewHeader}>
				<TouchableOpacity onPress={() => closeModal()}>
					<Text
						style={{
							padding: 15,
							fontFamily: "IMHyemin-Regular",
						}}
					>
						취소
					</Text>
				</TouchableOpacity>
				<Text style={{ fontSize: 19, fontFamily: "IMHyemin-Regular" }}>
					리뷰 작성
				</Text>
				<TouchableOpacity onPress={() => AddRememberBook()}>
					<Text style={{ padding: 15, fontFamily: "IMHyemin-Regular" }}>
						저장
					</Text>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<Modal
			visible={isAddModal}
			onRequestClose={() => closeModal()}
			style={{ marginTop: 300 }}
			animationType="silde"
			presentationStyle="pageSheet"
		>
			<View style={{ flex: 1, marginHorizontal: 20 }}>
				<Header />
				<View
					style={{ flex: 0.5, alignItems: "center", backgroundColor: "Red" }}
				>
					<View
						style={{ height: "100%", width: "50%", backgroundColor: "black" }}
					></View>
				</View>
				<View style={{ flex: 1 }}>
					<MyTextInput text={title} onChangeText={onChangeTitle} label="제목" />
					<ScrollView style={{ maxHeight: "30%" }}>
						<MyTextInput
							text={review}
							onChangeText={onChangeReview}
							label="내용"
						/>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}

function MenuModal({ isMenuModal, onBackdropPress }) {
	return (
		<View style={styles.modalContainer}>
			<Modal2
				isVisible={isMenuModal}
				onBackdropPress={() => onBackdropPress()}
				backdropColor={"none"}
				style={styles.modalStyle}
			>
				<View style={styles.modalView}>
					<TouchableOpacity>
						<View style={styles.categoryMenu}>
							<Text style={{ color: "white", fontSize: 20 }}>Movie</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity>
						<View style={styles.categoryMenu}>
							<Text style={{ color: "white", fontSize: 20 }}>Book</Text>
						</View>
					</TouchableOpacity>
				</View>
			</Modal2>
		</View>
	);
}

function RememberBook({ navigation }) {
	const [isMenuModal, setIsMenuModal] = useState(false);
	const [isAddModal, setIsAddModal] = useState(false);

	const onBackdropPress = () => setIsMenuModal((prevStatus) => !prevStatus);

	const categoryToggleModal = () => setIsMenuModal((prevStatus) => !prevStatus);

	const addToggleModal = () => setIsAddModal((prevStatus) => !prevStatus);

	return (
		<PaperProvider theme={theme}>
			<View style={styles.inner}>
				<View style={styles.menuContainer}>
					<MaterialIcons name="menu-book" size={30} />
					<TouchableOpacity
						onPress={() => categoryToggleModal()}
						style={styles.iconContainer}
					>
						<MaterialIcons name="keyboard-arrow-down" size={30} />
					</TouchableOpacity>
				</View>
				<MenuModal
					isMenuModal={isMenuModal}
					onBackdropPress={onBackdropPress}
				/>
				{/* <View style={{ height: "50%" }}> */}
				<ScrollView style={{ flex: 1, backgroundColor: "white" }}>
					<View style={{ flexDirection: "row" }}>
						<TouchableOpacity
							style={{
								height: windowHeight / 5,
								backgroundColor: "black",
								flex: 1,
							}}
							onPress={() => addToggleModal()}
						>
							<AddModal isAddModal={isAddModal} setIsAddModal={setIsAddModal} />
						</TouchableOpacity>
						<View
							style={{
								height: windowHeight / 5,
								backgroundColor: "yellow",
								flex: 1,
							}}
						></View>
						<View
							style={{
								height: windowHeight / 5,
								backgroundColor: "blue",
								flex: 1,
							}}
						></View>
					</View>
				</ScrollView>
				{/* </View> */}
			</View>
		</PaperProvider>
	);
}

const styles = StyleSheet.create({
	inner: {
		flex: 1,
		paddingHorizontal: "5%",
		backgroundColor: "green",
	},
	menuContainer: {
		marginTop: "20%",
		flex: 0.05,
		backgroundColor: "red",
		flexDirection: "row",
		alignItems: "center",
	},
	iconContainer: {
		flexDirection: "row",
		padding: 5,
	},
	modalContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	modalStyle: {
		justifyContent: "flex-start",
		marginTop: "27%",
		marginLeft: "15%",
	},
	modalView: {
		width: "30%",
		height: "auto",
	},
	categoryMenu: {
		borderWidth: 2,
		alignItems: "center",
		borderRadius: 12,
		fontSize: 20,
		marginBottom: 5,
		borderColor: "white",
		backgroundColor: "black",
	},
	Input: {
		backgroundColor: "white",
	},
	addReviewHeader: {
		flex: 0.1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});

export default RememberBook;
