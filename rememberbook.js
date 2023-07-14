import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Modal,
	SafeAreaView,
	FlatList,
	Image,
} from "react-native";
import { useEffect, useState } from "react";
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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
	getStorage,
	ref,
	uploadBytes,
	listAll,
	getDownloadURL,
} from "firebase/storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const underlineColor = "pink"; // focus 상태일 때와 아닐 때의 색상

function MyTextInput({ text, onChangeText, label }) {
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

function AddModal({ isAddModal, setIsAddModal, loadRememberBooks }) {
	const [title, setTitle] = useState("");
	const [review, setReview] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
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
		setSelectedImage(null);
	};

	const AddRememberBook = async () => {
		try {
			const response = await axios.post(
				"http://127.0.0.1:3001/addRememberBook",
				{
					user: user,
					title: title,
					review: review,
				}
			);
			closeModal();
			loadRememberBooks();
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

	const selectImage = () => {
		const options = {
			title: "사진 선택",
		};

		launchImageLibrary(options, (response) => {
			if (response.didCancel) {
				console.log("사용자가 이미지 선택을 취소했습니다.");
			} else if (response.error) {
				console.log("ImagePicker 에러: ", response.error);
			} else if (response.customButton) {
				console.log("Custom button clicked :", response.customButton);
			} else {
				const source = { uri: response.assets[0].uri };
				setSelectedImage(source);
			}
		});
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
				<View style={{ flex: 0.5, alignItems: "center" }}>
					{selectedImage ? (
						<Image
							source={selectedImage}
							style={{ height: "100%", width: "50%" }}
						/>
					) : (
						<TouchableOpacity
							style={{ height: "100%", width: "50%", backgroundColor: "black" }}
							onPress={() => selectImage()}
						></TouchableOpacity>
					)}
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
	const [rememberBooks, setRememberBooks] = useState([]);
	const [numColumns, setNumColumns] = useState(3); // 기본 컬럼 수로 초기화합니다.

	const [user, d] = useState("HUIPARK");

	const onBackdropPress = () => setIsMenuModal((prevStatus) => !prevStatus);

	const categoryToggleModal = () => setIsMenuModal((prevStatus) => !prevStatus);

	const addToggleModal = () => setIsAddModal((prevStatus) => !prevStatus);

	useEffect(() => {
		const fetchRememberBooks = async () => {
			// try {
			// 	const response = await axios.get(
			// 		"http://127.0.0.1:3001/getRememberBooks",
			// 		{
			// 			params: {
			// 				user: user,
			// 			},
			// 		}
			// 	);
			// 	setRememberBooks([addItem, ...response.data]);
			// } catch (error) {
			// 	console.log(error);
			// }
			await loadRememberBooks();
		};
		fetchRememberBooks();
	}, []);

	const loadRememberBooks = async () => {
		try {
			const response = await axios.get(
				"http://127.0.0.1:3001/getRememberBooks",
				{
					params: {
						user: user,
					},
				}
			);
			setRememberBooks([addItem, ...response.data]);
		} catch (error) {
			console.log(error);
		}
	};

	const Item = ({ title }) => {
		if (title === "addItem") {
			return (
				<TouchableOpacity
					style={{
						// flex: 0.2,
						marginVertical: 8,
						marginHorizontal: 1,
						backgroundColor: "black",
						width: "33.3%",
						height: windowHeight / 6,
					}}
					onPress={() => addToggleModal()}
				></TouchableOpacity>
			);
		}

		return (
			<View
				style={{
					backgroundColor: "#f9c2ff",
					marginVertical: 8,
					marginHorizontal: 1,
					width: "33.3%",
					height: windowHeight / 6,
				}}
			>
				<Text style={{ color: "black", fontSize: 14 }}>{title}</Text>
			</View>
		);
	};

	const addItem = { title: "addItem", review: "addItem" };

	return (
		<SafeAreaView style={{ flex: 1 }}>
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
					<View style={{ flex: 1 }}>
						<FlatList
							style={{ flex: 1 }}
							data={rememberBooks}
							keyExtractor={(item) => item.idx}
							renderItem={({ item }) => <Item title={item.title} />}
							numColumns={numColumns}
						/>
					</View>
				</View>
				<MenuModal
					isMenuModal={isMenuModal}
					onBackdropPress={onBackdropPress}
				/>
				<AddModal
					isAddModal={isAddModal}
					setIsAddModal={setIsAddModal}
					loadRememberBooks={loadRememberBooks}
				/>
			</PaperProvider>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	inner: {
		flex: 1,
		paddingHorizontal: "5%",
		backgroundColor: "green",
	},
	menuContainer: {
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
