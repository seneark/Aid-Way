import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, ScrollView, Image, ImageBackground, LogBox, ToastAndroid } from "react-native";
import { Block, Text, theme } from "galio-framework";
import Icon1 from "../components/Icon";
import Input1 from "../components/Input";
import { Button, Select, Icon, Input } from "../components/";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import Header from "../components/Header";
import SearchableDropdown from "react-native-searchable-dropdown";
import * as firebase from "firebase";
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function Route() {
	const [service, addService] = useState([
		{ key: 1, title: "Delhi Thane" },
		{ key: 2, title: "Delhi Firebrigade" },
		{ key: 3, title: "Delhi Hospital" },
	]);
	const generateId = (length) => {
		var result = "";
		var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	};

	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [issue, setIssue] = useState("");
	const [description, setDescription] = useState("");
	const [phone, setPhone] = useState("");
	const submitHandler = () => {
		let arr = [];
		selectedItems.forEach((item) => {
			arr.push(item.email);
		});
		let foo = generateId(10);
		const db = firebase.firestore();
		db.collection("userInfo")
			.where("phone", "==", phone)
			.get()
			.then((query) => {
				query.forEach((doc) => {
					db.collection("TrackOrder").add({
						department: arr,
						description: description,
						title: issue,
						phone: phone,
						email: doc.id,
						emergency: true,
						isAssigned: true,
						isComplete: false,
						name: doc.data().name,
						id: foo,
					});
				});
			});
		ToastAndroid.show("Request sent successfully!", ToastAndroid.LONG);
		setSelectedItems([]);
		setIssue("");
		setDescription("");
		setPhone("");
	};

	useEffect(() => {
		LogBox.ignoreAllLogs();
		const db = firebase.firestore();
		const usr = db.collection("userInfo").where("type", "==", "Department");
		usr.get().then((query) => {
			query.forEach((doc) => {
				let obj = {};
				obj["email"] = doc.id;
				obj["name"] = doc.data().name;
				obj["phone"] = doc.data().phone;
				let junk = items;
				junk.push(obj);
				setItems(junk);
			});
		});
	}, []);

	return (
		<Block flex>
			<ImageBackground source={Images.Onboarding} style={styles.profileContainer} imageStyle={styles.profileBackground}>
				<Block flex>
					<Block flex style={styles.profileCard}>
						<Block center style={{ marginTop: -30 }}>
							<Text style={styles.title}>
								Welcome {firebase.auth().currentUser.email.toString()}
							</Text>
						</Block>
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

						<Block flex>
							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Text h3 size={16} color={argonTheme.COLORS.DEFAULT} style={{ marginTop: 10 }}>
									Phone Number
								</Text>
								<Input
									right
									placeholder="Phone Number"
									type={"numeric"}
									iconContent={
										<Icon size={18} color={argonTheme.COLORS.PRIMARY} name="phone" family="Entypo" />
									}
									style={{
										borderColor: argonTheme.COLORS.DEFAULT,
										borderRadius: 4,
										backgroundColor: "#fff",
									}}
									onChangeText={(e) => {
										setPhone(e);
									}}
								/>
							</Block>
							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Text h3 size={16} color={argonTheme.COLORS.DEFAULT} style={{ marginTop: 10 }}>
									Issue
								</Text>

								<Input
									right
									placeholder="What is your issue?"
									iconContent={
										<Icon size={18} color={argonTheme.COLORS.PRIMARY} name="pencil" family="Entypo" />
									}
									style={{
										borderColor: argonTheme.COLORS.DEFAULT,
										borderRadius: 4,
										backgroundColor: "#fff",
									}}
									onChangeText={(e) => {
										setIssue(e);
									}}
								/>
							</Block>
							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Text h3 size={16} color={argonTheme.COLORS.DEFAULT} style={{ marginTop: 10 }}>
									Description
								</Text>

								<Input
									right
									placeholder="Emergency Description"
									iconContent={
										<Icon size={18} color={argonTheme.COLORS.PRIMARY} name="pencil" family="Entypo" />
									}
									style={{
										borderColor: argonTheme.COLORS.DEFAULT,
										borderRadius: 4,
										backgroundColor: "#fff",
										height: 80,
									}}
									onChangeText={(e) => {
										setDescription(e);
									}}
								/>
							</Block>
							<Block center>
								<Button color="success" style={styles.button} onPress={submitHandler}>
									ASSIGN
								</Button>
							</Block>
						</Block>
					</Block>

					{/* </ScrollView> */}
				</Block>
			</ImageBackground>
		</Block>
	);
}

const styles = StyleSheet.create({
	profile: {
		// marginBottom: -HeaderHeight * 2,
		flex: 1,
	},
	profileContainer: {
		width: width,
		height: height,
		padding: 0,
		zIndex: -1,
	},
	profileBackground: {
		width: width,
		height: height,
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
	info: {
		paddingHorizontal: 40,
	},
	avatarContainer: {
		position: "relative",
		marginTop: -80,
	},
	avatar: {
		width: 124,
		height: 124,
		borderRadius: 62,
		borderWidth: 0,
	},
	nameInfo: {
		marginTop: 35,
	},
	divider: {
		width: "90%",
		borderWidth: 1,
		borderColor: "#E9ECEF",
	},
	thumb: {
		borderRadius: 4,
		marginVertical: 4,
		alignSelf: "center",
		width: thumbMeasure,
		height: thumbMeasure,
	},
	title: {
		paddingBottom: theme.SIZES.BASE,
		paddingHorizontal: theme.SIZES.BASE * 2,
		marginTop: 44,
		color: argonTheme.COLORS.HEADER,
		fontSize: 15,
	},
	group: {
		paddingTop: theme.SIZES.BASE * 2,
	},
	shadow: {
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.2,
		elevation: 2,
	},
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 5.2,
	},
	optionsButton: {
		width: "auto",
		height: 34,
		paddingHorizontal: theme.SIZES.BASE,
		paddingVertical: 10,
	},
	service: {
		padding: 12,
		fontSize: 16,
	},
	input: {
		borderBottomWidth: 1,
	},
	inputDefault: {
		borderBottomColor: argonTheme.COLORS.PLACEHOLDER,
	},
	inputTheme: {
		borderBottomColor: argonTheme.COLORS.PRIMARY,
	},
	inputInfo: {
		borderBottomColor: argonTheme.COLORS.INFO,
	},
	inputSuccess: {
		borderBottomColor: argonTheme.COLORS.SUCCESS,
	},
	inputWarning: {
		borderBottomColor: argonTheme.COLORS.WARNING,
	},
	inputDanger: {
		borderBottomColor: argonTheme.COLORS.ERROR,
	},
});
