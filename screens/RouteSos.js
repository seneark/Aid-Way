import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, ScrollView, Image, ImageBackground, LogBox, ToastAndroid, SafeAreaView } from "react-native";
import { Block, Text, theme } from "galio-framework";
import Icon1 from "../components/Icon";
import Input1 from "../components/Input";
import { Button, Select, Icon, Input } from "../components/";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import Header from "../components/Header";
// import SearchBar from "../components/searchbar";
import SearchableDropdown from "react-native-searchable-dropdown";
const { width, height } = Dimensions.get("screen");
import * as firebase from "firebase";

const thumbMeasure = (width - 48 - 32) / 3;
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
];
export default function Route(props) {
	const [service, setService] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [issue, setIssue] = useState("");
	const [description, setDescription] = useState("");
	const [phone, setPhone] = useState("");
	const [selectedEmergency, setSelectedEmergency] = useState(null);
	const generateId = (length) => {
		var result = "";
		var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	};
	const submitHandler = () => {
		const db = firebase.firestore();
		const sos = db.collection("sosRequest").doc(props.route.params._id.toString());
		let arr = [];
		for (let i = 0; i < selectedItems.length; i++) {
			arr.push(selectedItems[i].email);
		}
		sos.get().then((doc) => {
			let obj = doc.data();
			obj["isAssigned"] = true;
			obj["id"] = generateId(10);
			obj["isComplete"] = false;
			obj["emergency"] = true;
			obj["department"] = arr;
			delete obj["selectedEmergency"];
			sos.update({
				isAssigned: true,
			});
			db.collection("TrackOrder").add(obj);
			ToastAndroid.show("Successfully Assigned", ToastAndroid.LONG);
		});
	};
	const getDepartment = async () => {
		let arr = [];
		const db = firebase.firestore();
		await db
			.collection("userInfo")
			.where("type", "==", "Department")
			.get()
			.then((query) => {
				query.forEach((doc) => {
					let obj = doc.data();
					obj["email"] = doc.id;
					arr.push(obj);
				});
			});
		setService(arr);
	};
	useEffect(() => {
		LogBox.ignoreAllLogs();
		getDepartment();
		const db = firebase.firestore();
		const sos = db.collection("sosRequest").doc(props.route.params._id.toString());
		sos.get().then((doc) => {
			setPhone(doc.data().phone);
			setDescription(doc.data().description);
			setIssue(doc.data().title);
			setSelectedEmergency(doc.data().selectedEmergency);
		});
	}, []);
	return (
		<Block flex>
			<ImageBackground source={Images.Onboarding} style={styles.profileContainer} imageStyle={styles.profileBackground}>
				<Block flex>
					{/* <ScrollView showsVerticalScrollIndicator={false}> */}
					<Block flex style={styles.profileCard}>
						<Block center style={{ marginTop: -30 }}>
							<Text style={styles.title}>Welcome {firebase.auth().currentUser.email.toString()}</Text>
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
								items={service}
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
						</Block>

						<Block flex>
							<Block>
								<Text>Selected Emergency:</Text>
								{selectedEmergency
									? selectedEmergency.map((item) => {
											return (
												<Block>
													<Text>{item.name}</Text>
												</Block>
											);
									  })
									: null}
							</Block>
							<Text />
							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Text h3 size={16} color={argonTheme.COLORS.DEFAULT} style={{ marginTop: 10 }}>
									Phone Number
								</Text>

								<Input
									right
									placeholder="Phone Number"
									type={"numeric"}
									iconContent={<Icon size={18} color={argonTheme.COLORS.ICON} name="phone" family="Entypo" />}
									style={{
										borderColor: argonTheme.COLORS.DEFAULT,
										borderRadius: 4,
										backgroundColor: "#fff",
									}}
									onChangeText={(e) => {
										setPhone(e);
									}}
									value={phone}
								/>
							</Block>
							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Text h3 size={16} color={argonTheme.COLORS.DEFAULT} style={{ marginTop: 10 }}>
									Issue
								</Text>

								<Input
									right
									placeholder="What is your issue?"
									iconContent={<Icon size={18} color={argonTheme.COLORS.ICON} name="pencil" family="Entypo" />}
									style={{
										borderColor: argonTheme.COLORS.DEFAULT,
										borderRadius: 4,
										backgroundColor: "#fff",
									}}
									onChangeText={(e) => {
										setIssue(e);
									}}
									value={issue}
								/>
							</Block>
							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Text h3 size={16} color={argonTheme.COLORS.DEFAULT} style={{ marginTop: 10 }}>
									Description
								</Text>

								<Input
									right
									placeholder="Emergency Description"
									iconContent={<Icon size={18} color={argonTheme.COLORS.ICON} name="pencil" family="Entypo" />}
									style={{
										borderColor: argonTheme.COLORS.DEFAULT,
										borderRadius: 4,
										backgroundColor: "#fff",
										height: 80,
									}}
									onChangeText={(e) => {
										setDescription(e);
									}}
									value={description}
								/>
							</Block>
							<Block center>
								<Button color="success" style={styles.button} onPress={submitHandler}>
									ASSIGN
								</Button>
							</Block>
						</Block>
					</Block>
				</Block>
			</ImageBackground>
		</Block>
	);
}

const styles = StyleSheet.create({
	profile: {
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
		paddingHorizontal: theme.SIZES.BASE * 2,
		marginTop: 34,
		color: argonTheme.COLORS.HEADER,
		fontSize: 18,
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
