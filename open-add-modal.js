import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import MySwitch from "./Switch";
import DatePicker from "react-native-date-picker";
import { styles } from "./styles";
import { TextInput } from "react-native-paper";

const underlineColor = "pink"; // focus 상태일 때와 아닐 때의 색상

function OpenAddModal({
	setIsModalVisible,
	toggleModal,
	addTodo,
	maintainSwitch,
	alarmSwitch,
	isModalVisible,
	text,
	onChangeText,
	maintainStatus,
	alarm,
	date,
	setDate,
}) {
	return (
		<Modal
			style={{ marginTop: 300 }}
			animationType="slide"
			visible={isModalVisible}
			presentationStyle="pageSheet"
			onRequestClose={() => {
				setIsModalVisible(false);
			}}
		>
			<View style={{ flex: 1, marginHorizontal: 20 }}>
				<View style={styles.addTodoHeader}>
					<TouchableOpacity onPress={() => toggleModal()}>
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
						할 일 추가
					</Text>
					<TouchableOpacity onPress={() => addTodo()}>
						<Text style={{ padding: 15, fontFamily: "IMHyemin-Regular" }}>
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
						label={"Add a To Do"}
						underlineColor={underlineColor}
					></TextInput>
					<View style={styles.addText}>
						<View>
							<Text style={{ fontSize: 17, fontFamily: "IMHyemin-Regular" }}>
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
							onValueChange={() => maintainSwitch()}
							value={maintainStatus}
						/>
					</View>
					<View style={{ ...styles.addText, alignItems: "center" }}>
						<View>
							<Text style={{ fontSize: 17, fontFamily: "IMHyemin-Regular" }}>
								알람
							</Text>
						</View>
						<MySwitch onValueChange={() => alarmSwitch()} value={alarm} />
					</View>
					{alarm ? (
						<DatePicker
							date={date}
							onDateChange={setDate}
							minimumDate={new Date()}
						/>
					) : null}
				</View>
			</View>
		</Modal>
	);
}

export default OpenAddModal;
