import React, { useState, useEffect } from "react";
import { StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, Dimensions, LogBox } from "react-native";
import { Images, argonTheme } from "../constants";
import { Button, Icon, Input, Select } from "../components";
import { Block, theme, Text, Toast } from "galio-framework";
import * as firebase from "firebase";
const { width, height } = Dimensions.get("screen");

export default function App({ navigation }) {
	const [title, setTitle] = useState("");
	const [email, setEmail] = useState("");
	const [err, setErr] = useState("");
	const [color, setColor] = useState("warning");
	const [isShow, setIsShow] = useState(false);
	useEffect(() => {
		LogBox.ignoreAllLogs();
	}, []);
	const addOOfficial = () => {
		if (email.length > 0 && title.length > 0) {
			const db = firebase.firestore();
			let usr = db.collection("userInfo").doc(email);
			usr.get().then((doc) => {
				if (doc.exists && doc.data().type == "Emergency Person") {
					usr.update({
						department: firebase.auth().currentUser.email.toString(),
						title: title,
					}).then(() => {
						setErr("Successfully added");
						setIsShow(true);
						setColor("success")
					});
				} else {
					setErr("Email doesn't exists");
					setIsShow(true);
					setColor("warning");
				}
			});
		} else {
			setErr("Badly formatted title or email");
			setIsShow(true);
			setColor("warning")
		}
		setTimeout(async() => {
			await setIsShow(false);
		}, 3000);
	};
	return (
		<Block>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<ImageBackground source={Images.Onboarding} style={{ width, height, zIndex: 1 }}>
					<Block middle flex center>
						<Block style={styles.container}>
							<Text bold size={20} style={styles.title}>
								Enter all the Details below
							</Text>
							<Input
								onChangeText={(txt) => {
									setTitle(txt);
								}}
								borderless
								placeholder="Title"
								iconContent={
									<Icon
										size={22}
										color={argonTheme.COLORS.ICON}
										name="person"
										family="Ionicons"
										style={styles.inputIcons}
									/>
								}
							/>
							<Input
								onChangeText={(txt) => {
									setEmail(txt);
								}}
								type={"email-address"}
								borderless
								placeholder="email"
								iconContent={
									<Icon
										size={22}
										color={argonTheme.COLORS.ICON}
										name="mail"
										family="Feather"
										style={styles.inputIcons}
									/>
								}
							/>
							<Text italic size={12} style={styles.title}>
								*Make sure that the emails already exists.
							</Text>
							<Block middle center>
								<Button
									color="success"
									textStyle={{
										fontSize: 14,
									}}
									icon="plus"
									iconFamily="Feather"
									iconSize={19}
									onPress={() => addOOfficial()}
								>
									Add Person
								</Button>
							</Block>
						</Block>
					</Block>
				</ImageBackground>
			</TouchableWithoutFeedback>
			<Toast
				color={color}
				isShow={isShow}
				style={{ marginTop: "-30%" }}
				fadeOutDuration={1000}
				fadeInDuration={1000}
				positionIndicator="top"
			>
				{err}
			</Toast>
		</Block>
	);
}

const styles = StyleSheet.create({
	container: {
		width: width * 0.9,
		flex: 0.6,
		marginTop: "-30%",
		backgroundColor: "#F4F5F7",
		borderRadius: 4,
		shadowColor: argonTheme.COLORS.BLACK,
		shadowRadius: 8,
		shadowOpacity: 0.1,
		elevation: 1,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
		padding: "3%",
	},
	title: {
		paddingBottom: theme.SIZES.BASE,
		paddingHorizontal: theme.SIZES.BASE * 2,
		color: argonTheme.COLORS.HEADER,
	},
});
