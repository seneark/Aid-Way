import React, { useState, Fragment, useEffect } from "react";
import { StyleSheet, Dimensions, ToastAndroid, Image, ImageBackground, LogBox, FlatList } from "react-native";
import { Block, Text, theme, Button } from "galio-framework";
import Icon1 from "../components/Icon";
import Input1 from "../components/Input";
import { Select, Icon, Input } from "../components/";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import Header from "../components/Header";
const { width, height } = Dimensions.get("screen");
import ModalDropdown from "react-native-modal-dropdown";
import SearchableDropdown from "react-native-searchable-dropdown";
import * as firebase from "firebase";

export default function listofficials() {
	var items = [
		{
			id: 1,
			name: "Ambulance",
		},
		{
			id: 2,
			name: "Police",
		},
		{
			id: 3,
			name: "Fire Brigade",
		},
		{
			id: 4,
			name: "Women Help",
		},
		{
			id: 5,
			name: "Hospital",
		},
		{
			id: 6,
			name: "Disaster Management",
		},
	];
	const sendSignal = () => {
		const db = firebase.firestore();
		const usr = db.collection("userInfo").doc(firebase.auth().currentUser.email.toString());
		usr.get()
			.then((doc) => {
				const sos = db.collection("sosRequest");
				sos.add({
					name: doc.data().name,
					phone: doc.data().phone,
					email: firebase.auth().currentUser.email.toString(),
					isAssigned: false,
					sos: true,
					title: issue,
					description: description,
					selectedEmergency: selectedItems,
				});
			})
			.then((data) => {
				ToastAndroid.show("Successfully Sent your SOS", ToastAndroid.LONG);
			})
			.catch((err) => {
				ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			});
	};
	const [selectedItems, setSelectedItems] = useState([]);
	const [issue, setIssue] = useState("");
	const [description, setDescription] = useState("");
	const [err, setErr] = useState("dsa");
	const [color, setColor] = useState("warning");
	const [isShow, setIsShow] = useState(true);
	useEffect(() => {
		LogBox.ignoreAllLogs();
	});
	return (
		<Block flex>
			<ImageBackground source={Images.Onboarding} style={styles.profileContainer} imageStyle={styles.profileBackground}>
				<Block flex>
					<Block flex style={styles.profileCard}>
						<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
							<Text h3 size={16} color={argonTheme.COLORS.ACTIVE} style={{ marginTop: 10 }}>
								Issue
							</Text>

							<Input
								right
								placeholder="What is your issue?"
								iconContent={<Icon size={20} color={argonTheme.COLORS.PRIMARY} name="pencil" family="Entypo" />}
								style={{
									borderColor: argonTheme.COLORS.DEFAULT,
									borderRadius: 4,
									backgroundColor: "#fff",
								}}
								onChangeText={(txt) => {
									setIssue(txt);
								}}
							/>
						</Block>
						<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
							<Text h3 size={16} color={argonTheme.COLORS.ACTIVE} style={{ marginTop: 10 }}>
								Description
							</Text>
							<Input
								right
								placeholder="Emergency Desription"
								iconContent={<Icon size={20} color={argonTheme.COLORS.PRIMARY} name="pencil" family="Entypo" />}
								style={{
									borderColor: argonTheme.COLORS.DEFAULT,
									borderRadius: 4,
									backgroundColor: "#fff",
									height: 80,
								}}
								onChangeText={(txt) => {
									setDescription(txt);
								}}
							/>
						</Block>
						<Fragment>
							<SearchableDropdown
								multi={true}
								selectedItems={selectedItems}
								onItemSelect={(item) => {
									const junk = selectedItems;
									junk.push(item);
									setSelectedItems(junk);
								}}
								containerStyle={{ padding: 5, width: 330, marginTop: 20, borderColor: argonTheme.COLORS.DEFAULT }}
								onRemoveItem={(item, index) => {
									const items = selectedItems.filter((sitem) => sitem.id !== item.id);
									setSelectedItems(items);
								}}
								itemStyle={{
									padding: 10,
									marginTop: 2,
									backgroundColor: "#ddd",
									borderColor: "#bbb",
									borderWidth: 1,
									borderRadius: 5,
								}}
								itemTextStyle={{ color: "#222" }}
								itemsContainerStyle={{ maxHeight: 140 }}
								items={items}
								defaultIndex={2}
								chip={true}
								resetValue={false}
								textInputProps={{
									placeholder: "Select Emergency Service Helper",
									underlineColorAndroid: "transparent",
									style: {
										padding: 16,
										borderWidth: 1,
										borderColor: "#ccc",
										borderRadius: 5,
										borderColor: "#bbb",
										borderWidth: 1,
									},
								}}
								listProps={{
									nestedScrollEnabled: true,
								}}
							/>
						</Fragment>
						<Block center>
							<Button
								color="info"
								style={styles.button}
								icon="send-outline"
								iconFamily="Ionicon"
								iconSize={22}
								onPress={() => sendSignal()}
							>
								SEND SIGNAL
							</Button>
						</Block>
					</Block>
				</Block>
			</ImageBackground>
		</Block>
	);
}

const styles = StyleSheet.create({
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 10,
	},
	shadow: {
		shadowColor: theme.COLORS.BLACK,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.1,
		elevation: 2,
		marginLeft: 3,
		backgroundColor: "white",
		width: 310,
		height: 30,
		color: "white",
		borderRadius: 4,
		borderColor: argonTheme.COLORS.BORDER,
		height: 44,
		justifyContent: "center",
		padding: 13,
	},
	dropdown: {
		marginTop: 8,
		width: 310,
		marginLeft: -12,
		height: 120,
	},
	dropdownTextNormal: {
		fontSize: 15,
		color: "#808080",
	},
	dropdownTextStyle: {
		fontSize: 15,
		color: "#808080",
	},
	profileCard: {
		// position: "relative",
		padding: theme.SIZES.BASE,
		marginHorizontal: theme.SIZES.BASE,
		marginTop: 25,
		borderTopLeftRadius: 6,
		borderTopRightRadius: 6,
		backgroundColor: theme.COLORS.WHITE,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 0 },
		shadowRadius: 8,
		shadowOpacity: 0.2,
		zIndex: 2,
	},
	profileContainer: {
		width: width,
		height: height / 1.5,
		padding: 0,
		zIndex: -1,
	},
	profileBackground: {
		width: width,
		height: height,
	},
});
