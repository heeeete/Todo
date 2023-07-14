import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	Text,
	View,
	TouchableOpacity,
	Alert,
	Animated,
	Easing,
	Modal,
	SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./styles";
import MySwitch from "./Switch";
import DatePicker from "react-native-date-picker";
import * as React from "react";
import {
	Button,
	TextInput,
	Provider as PaperProvider,
} from "react-native-paper";
import { theme } from "./react-native-paper-theme"; // theme.js에서 theme 가져오기
import OpenAddModal from "./open-add-modal";
import DraggableFlatList from "react-native-draggable-flatlist";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const underlineColor = "pink"; // focus 상태일 때와 아닐 때의 색상
const STORAGE_KEY = "@item";

const clearAllData = async () => {
	try {
		await AsyncStorage.clear();
		console.log("All data cleared successfully.");
	} catch (error) {
		console.log("Failed to clear data:", error);
	}
};

function IsEdit({ edit, deleteTodo, toggleModal }) {
	return edit ? (
		<View style={styles.edit}>
			<TouchableOpacity onPress={() => deleteTodo("check")}>
				<Text style={{ ...styles.editText, color: "red" }}>삭제</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => deleteTodo()}>
				<Text style={styles.editText}>전체삭제</Text>
			</TouchableOpacity>
		</View>
	) : (
		<View style={styles.addTodo}>
			<Button
				style={{ backgroundColor: "#F2BED1" }}
				mode="contained"
				onPress={() => toggleModal()}
			>
				<FontAwesome name="calendar-plus-o" size={20} color="white" />
				<Text style={{ fontFamily: "IMHyemin-Regular" }}> 할 일 추가</Text>
			</Button>
		</View>
	);
}

function TodoItem({
	todo,
	index,
	modifyToggleModal,
	toggleCheck,
	backgroundColor,
	drag,
	isActive,
}) {
	if (!todo) return;
	return (
		<TouchableOpacity
			onPress={() => modifyToggleModal(todo)}
			onLongPress={drag}
		>
			<View
				style={{
					...styles.todo,
					backgroundColor: backgroundColor,
				}}
			>
				<Text
					style={[
						todo.isSwitch
							? {
									...styles.todoText,
									color: "grey",
									textDecorationLine: "line-through",
							  }
							: styles.todoText,
					]}
				>
					{todo.maintain ? (
						<FontAwesome name="star" size={15} color="#F2BED1" />
					) : null}
					{todo.text}
				</Text>
				<MySwitch
					onValueChange={() => toggleCheck(index)}
					value={todo.isSwitch}
				/>
			</View>
		</TouchableOpacity>
	);
}

function EditTodo({
	todo,
	index,
	toggleCheckBox,
	checkBoxStyles,
	backgroundColor,
}) {
	return (
		<TouchableOpacity onPress={() => toggleCheckBox(index)}>
			<View style={{ ...styles.todo, backgroundColor: backgroundColor }}>
				<Animated.View style={[checkBoxStyles]}>
					<Checkbox
						onValueChange={() => toggleCheckBox(index)}
						value={todo.isChecked}
						color={todo.isChecked ? "#ffeefd" : undefined}
						style={styles.CheckBox}
					/>
					<Text
						style={[
							todo.isSwitch
								? {
										...styles.todoText,
										color: "grey",
										textDecorationLine: "line-through",
								  }
								: styles.todoText,
						]}
					>
						{todo.maintain ? (
							<FontAwesome name="star" size={15} color="#F2BED1" />
						) : null}
						{todo.text}
					</Text>
				</Animated.View>
			</View>
		</TouchableOpacity>
	);
}

function Todo({ navigation }) {
	const [isSwitch, setIsSwitch] = useState(false);
	const [maintainStatus, setMaintainStatus] = useState(false);
	const [edit, setEdit] = useState(false);
	const [text, setText] = useState("");
	const [todos, setTodos] = useState([]);
	const [load, setLoad] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentTodo, setCurrentTodo] = useState([]);
	const [date, setDate] = useState(new Date());
	const [currentDate, setCurrentDate] = useState(new Date());
	const [alarm, setAlarm] = useState(false);
	const [modifyTodoModalStatus, setModifyTodoModalStatus] = useState(false);
	const [localMaintainStatus, setLocalMaintainStatus] = useState(false);
	const [currentAlarm, setCurrentAlarm] = useState(false);

	// const underlineColor = "pink"; // focus 상태일 때와 아닐 때의 색상

	const todosLen = todos.length;

	useEffect(() => {
		const fetchTodos = async () => {
			await loadTodos();
			setLoad(false);
		};
		fetchTodos();
	}, []);
	/* ======================Todo 다음날 오전6시 넘으면 자동 삭제=============================== */
	useEffect(() => {
		if (load === false) {
			const now = new Date();
			const discardTodos = todos.filter((todo) => !todo.maintain);
			if (!discardTodos.length) {
				return;
			}
			const firstArrayCreateDay = discardTodos[0].createDay;
			if (firstArrayCreateDay - now.getDate() && now.getHours() >= 6) {
				const deleteKeys = discardTodos
					.filter((todo) => todo.createDay === firstArrayCreateDay)
					.map((todo) => todos.indexOf(todo));
				const newTodos = [...todos];
				for (const index of deleteKeys) {
					newTodos.splice(index, 1);
				}
				setTodos(newTodos);
				saveTodos(newTodos);
			}
		}
	});
	/* =============================================================================== */
	/* ======================애니메이션=============================== */
	const checkBoxAnimatedValue = useState(new Animated.Value(-100))[0];
	const checkBoxStyles = {
		transform: [{ translateX: checkBoxAnimatedValue }],
		flexDirection: "row",
		alignItems: "center",
	};

	const startAnimation = (Value) => {
		Animated.timing(Value, {
			toValue: 0,
			duration: 200,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start();
	};
	/* ======================애니메이션=============================== */

	const modifyAlarmSwitch = () => {
		if (currentTodo) {
			if (currentAlarm === true) setCurrentDate(new Date());
			setCurrentAlarm((prevStatus) => !prevStatus);
		}
	};

	const alarmSwitch = () => {
		setAlarm((prevStatus) => !prevStatus);
	};

	const maintainSwitch = () => {
		setMaintainStatus((prevStatus) => !prevStatus);
	};

	const toggleModal = () => {
		if (maintainStatus) setMaintainStatus((prevStatus) => !prevStatus);
		if (alarm) setAlarm((prevStatus) => !prevStatus);
		if (text) setText("");
		setIsModalVisible(!isModalVisible);
	};

	const onChangeText = (payload) => {
		setText(payload);
	};

	const saveTodos = async (todos) => {
		try {
			AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
		} catch (error) {
			console.log("Failed to svaTodos", error);
		}
	};

	const Edit = () => {
		setEdit(!edit);
		checkBoxAnimatedValue.setValue(-30); // reset the value
		startAnimation(checkBoxAnimatedValue);

		if (!edit) {
			const newTodos = [...todos];
			Object.keys(newTodos).forEach((key) => {
				newTodos[key].isChecked = false;
			});
			setTodos(newTodos);
		}
	};

	const deleteTodo = async (check) => {
		const todosLen = todos.length;
		if (!todosLen) {
			return Alert.alert("empty");
		}
		if (check) {
			const checkedTodos = todos.filter((todo) => todo.isChecked);
			const len = checkedTodos.length;
			if (!len) return Alert.alert("항목을 선택해 주세요");
			Alert.alert(
				`${len}개의 항목을 삭제하시겠습니까?`,
				"삭제하시려면 '확인'을 눌러 주세요.",
				[
					{
						text: "확인",
						onPress: async () => {
							const newTodos = todos.filter(
								(todo) => !checkedTodos.includes(todo)
							);
							setTodos(newTodos);
							await saveTodos(newTodos);
							setEdit();
						},
					},
					{ text: "취소" },
				]
			);
		} else {
			Alert.alert(
				"모든 할 일을 삭제하시겠습니까?",
				"삭제하시려면 '확인'을 눌러 주세요.",
				[
					{
						text: "확인",
						onPress: async () => {
							await clearAllData();
							setTodos([]);
							setEdit();
						},
					},
					{ text: "취소" },
				]
			);
		}
	};

	const loadTodos = async () => {
		try {
			const s = await AsyncStorage.getItem(STORAGE_KEY);
			if (s === null) {
				setTodos([]);
			} else {
				setTodos(JSON.parse(s));
			}
		} catch (error) {
			console.log("Local Storage Error");
		}
	};

	// ===================================Todo 수정==================================================
	const updateTodo = async () => {
		const updateTodos = JSON.parse(JSON.stringify(todos));
		const index = todos.findIndex((todo) => todo === currentTodo);
		if (text) {
			updateTodos[index].text = text;
		}
		updateTodos[index].maintain = localMaintainStatus;
		updateTodos[index].alarm = currentAlarm;
		updateTodos[index].date = currentDate;
		setCurrentDate(new Date());
		setTodos(updateTodos);
		await saveTodos(updateTodos);
		setText("");
		setModifyTodoModalStatus(!modifyTodoModalStatus);
	};

	const resetTodo = async () => {
		setText("");
		setModifyTodoModalStatus(!modifyTodoModalStatus);
	};

	const modifyToggleModal = (todo) => {
		setCurrentTodo(todo);
		setLocalMaintainStatus(todo.maintain);
		setCurrentAlarm(todo.alarm);
		setCurrentDate(todo.date);
		setModifyTodoModalStatus(!modifyTodoModalStatus);
	};

	const modifyMaintainStatus = () => {
		if (currentTodo) {
			setLocalMaintainStatus((prevStatus) => !prevStatus);
		}
	};
	// ======================================================================================

	const addTodo = async () => {
		if (text === "") return toggleModal();
		const newTodo = {
			text,
			alarm,
			isSwitch,
			isChecked: false,
			maintain: maintainStatus ? true : false,
			createDay: new Date().getDate(),
			date: date,
		};
		const newTodos = [...todos, newTodo];
		setTodos(newTodos);
		await saveTodos(newTodos);
		setDate(new Date());
		setText("");
		toggleModal();
	};

	const toggleCheck = async (index) => {
		// const newTodos = [...todos];
		// const updatedTodo = { ...newTodos[index] };
		// console.log("newTodos === todos = ", newTodos === todos);
		// console.log(
		// 	"newTodos[index] === todos[index] = ",
		// 	newTodos[index] === todos[index]
		// );
		// updatedTodo.isSwitch = !updatedTodo.isSwitch;
		// newTodos[index] = updatedTodo;
		// setTodos(newTodos);
		// await saveTodos(newTodos);
		const newTodos = JSON.parse(JSON.stringify(todos));
		newTodos[index].isSwitch = !newTodos[index].isSwitch;
		setTodos(newTodos);
		await saveTodos(newTodos);
	};

	const toggleCheckBox = (index) => {
		const newTodos = JSON.parse(JSON.stringify(todos));
		newTodos[index].isChecked = !newTodos[index].isChecked;
		setTodos(newTodos);
	};
	// clearAllData();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<PaperProvider theme={theme}>
				<View style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.hText}>오늘 할 일</Text>
						<TouchableOpacity onPress={() => Edit()}>
							<Text style={styles.editBtn}>{edit ? "닫기" : "편집"}</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1 }}>
						{
							load ? (
								<Text>Loading...</Text>
							) : todosLen === 0 ? (
								<View style={styles.undefinedTodoView}>
									<Text style={styles.undefinedTodoText}>
										현재 할 일이 없습니다{"\n"}오늘 해야 할 일을 기록해보세요📋
									</Text>
								</View>
							) : (
								<DraggableFlatList
									style={{ height: "100%" }}
									data={todos}
									renderItem={({ item: todo, getIndex, drag, isActive }) => {
										index = getIndex();
										const isOdd = index % 2 !== 0;
										const backgroundColor = isOdd
											? "white"
											: "rgb(248, 248, 248)";
										if (edit) {
											return (
												<EditTodo
													key={index}
													index={index}
													todo={todo}
													toggleCheckBox={toggleCheckBox}
													checkBoxStyles={checkBoxStyles}
													backgroundColor={backgroundColor}
													isActive={isActive}
													drag={drag}
												/>
											);
										} else {
											return (
												<TodoItem
													key={index}
													index={index}
													todo={todo}
													toggleCheckBox={toggleCheckBox}
													toggleCheck={toggleCheck}
													modifyToggleModal={modifyToggleModal}
													backgroundColor={backgroundColor}
													isActive={isActive}
													drag={drag}
												/>
											);
										}
									}}
									keyExtractor={(item, index) => `draggable-item-${index}`}
									onDragEnd={({ data }) => {
										setTodos(data);
										saveTodos(data);
									}}
								/>
							)
							//===============================ToDo_List================================//
						}
					</View>
					{/* edit 의 상태를 확인 하여 어떤 Btn을 랜더링 할지 확인 */}
					<IsEdit
						edit={edit}
						deleteTodo={deleteTodo}
						toggleModal={toggleModal}
					/>
					<OpenAddModal
						setIsModalVisible={setIsModalVisible}
						toggleModal={toggleModal}
						addTodo={addTodo}
						maintainSwitch={maintainSwitch}
						alarmSwitch={alarmSwitch}
						isModalVisible={isModalVisible}
						text={text}
						onChangeText={onChangeText}
						maintainStatus={maintainStatus}
						alarm={alarm}
						date={date}
						setDate={setDate}
					/>
					{/* =====================================밑에 수정 투투=========================================== */}
					{currentTodo ? (
						<Modal
							style={{ marginTop: 300 }}
							animationType="slide"
							visible={modifyTodoModalStatus}
							presentationStyle="pageSheet"
							onRequestClose={() => {
								setModifyTodoModalStatus(false);
							}}
						>
							<View style={{ flex: 1, marginHorizontal: 20 }}>
								<View style={styles.addTodoHeader}>
									<TouchableOpacity onPress={() => resetTodo()}>
										<Text
											style={{
												padding: 15,
												fontFamily: "IMHyemin-Regular",
											}}
										>
											취소
										</Text>
									</TouchableOpacity>
									<Text
										style={{ fontSize: 22, fontFamily: "IMHyemin-Regular" }}
									>
										수정하기
									</Text>
									<TouchableOpacity onPress={() => updateTodo()}>
										<Text
											style={{
												padding: 15,
												fontFamily: "IMHyemin-Regular",
											}}
										>
											저장
										</Text>
									</TouchableOpacity>
								</View>
								<View style={{ flex: 1 }}>
									<TextInput
										value={text}
										returnKeyType="done"
										onChangeText={onChangeText}
										style={styles.Input}
										label={currentTodo.text}
										underlineColor={underlineColor}
									></TextInput>
									<View style={styles.addText}>
										<View>
											<Text
												style={{ fontSize: 17, fontFamily: "IMHyemin-Regular" }}
											>
												유지
											</Text>
											<Text
												style={{
													fontSize: 10,
													marginTop: 5,
													color: "grey",
												}}
											>
												체크하지 않으시면 다음날 오전 6시에 자동 삭제됩니다.
											</Text>
										</View>
										<MySwitch
											onValueChange={() => modifyMaintainStatus()}
											value={localMaintainStatus}
										/>
									</View>
									<View
										style={{
											...styles.addText,
											alignItems: "center",
										}}
									>
										<View>
											<Text
												style={{ fontSize: 17, fontFamily: "IMHyemin-Regular" }}
											>
												알람
											</Text>
										</View>
										<MySwitch
											onValueChange={() => modifyAlarmSwitch()}
											value={currentAlarm}
										/>
									</View>
									{currentAlarm ? (
										<DatePicker
											date={new Date(currentDate)}
											onDateChange={setCurrentDate}
											minimumDate={new Date()}
										/>
									) : null}
								</View>
							</View>
						</Modal>
					) : null}
				</View>
			</PaperProvider>
		</SafeAreaView>
	);
}

export default Todo;
