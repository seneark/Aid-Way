import React from "react";
import { StyleSheet, ImageBackground, Dimensions, StatusBar, KeyboardAvoidingView, LogBox } from "react-native";
import { Block, Checkbox, Text, theme, Toast, Radio } from "galio-framework";
import ModalDropdown from "react-native-modal-dropdown";
import * as firebase from "firebase";
import { Button, Icon, Input, Select } from "../components";
import { Images, argonTheme } from "../constants";

const { width, height } = Dimensions.get("screen");

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			phone: "",
			password: "",
			privacy: false,
			err: "",
			isShow: false,
			color: "",
			dropOption: ["User", "Router", "Department", "Emergency Person"],
			selectOption: "User",
		};

		this.registerUser = this.registerUser.bind(this);
	}
	componentDidMount() {
		LogBox.ignoreAllLogs();
	}
	async registerUser() {
		const db = firebase.firestore();
		if (this.state.privacy) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then(async (result) => {
					let usr = db.collection("userInfo").doc(this.state.email);
					// yha likho
					await usr
						.set({
							name: this.state.name,
							phone: this.state.phone,
							type: this.state.selectOption,
						})
						.then(async (res) => {
							await this.props.navigation.navigate("Login");
						})
						.catch(async (err) => {
							await this.setState({ isShow: true, err: err.toString(), color: "error" });
						});
				})
				.catch(async (err) => {
					await this.setState({ isShow: true, err: err.toString(), color: "error" });
				});
		} else {
			await this.setState({ isShow: true, err: "Agree to the privacy policy", color: "error" });
		}

		setTimeout(() => {
			this.setState({ isShow: false });
		}, 5000);
	}
	render() {
		const { navigation } = this.props;
		return (
			<Block flex middle>
				<StatusBar hidden />
				<ImageBackground source={Images.Onboarding} style={{ width, height, zIndex: 1 }}>
					<Block safe flex middle>
						<Block style={styles.registerContainer}>
							<Block flex>
								<Block flex={0.19} middle>
									<Text h5 color={argonTheme.COLORS.PRIMARY}>
										Register Yourself
									</Text>
								</Block>
								<Block flex center middle>
									<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
										<Block width={width * 0.8} style={{ marginBottom: 15 }}>
											<Input
												onChangeText={(txt) => {
													this.setState({ name: txt });
												}}
												borderless
												placeholder="Name"
												iconContent={
													<Icon
														size={16}
														color={argonTheme.COLORS.ICON}
														name="hat-3"
														family="ArgonExtra"
														style={styles.inputIcons}
													/>
												}
											/>
										</Block>
										<Block width={width * 0.8} style={{ marginBottom: 15 }}>
											<Input
												onChangeText={(txt) => {
													this.setState({ email: txt });
												}}
												type={"email-address"}
												borderless
												placeholder="Email"
												iconContent={
													<Icon
														size={16}
														color={argonTheme.COLORS.ICON}
														name="ic_mail_24px"
														family="ArgonExtra"
														style={styles.inputIcons}
													/>
												}
											/>
										</Block>
										<Block width={width * 0.8} style={{ marginBottom: 15 }}>
											<Input
												onChangeText={(txt) => {
													this.setState({ phone: txt });
												}}
												type={"numeric"}
												borderless
												placeholder="Phone Number"
												iconContent={
													<Icon
														size={16}
														color={argonTheme.COLORS.ICON}
														name="g-check"
														family="ArgonExtra"
														style={styles.inputIcons}
													/>
												}
											/>
										</Block>
										<Block width={width * 0.8} style={{ marginBottom: 15 }}>
											<Input
												onChangeText={(txt) => {
													this.setState({ password: txt });
												}}
												password
												borderless
												placeholder="Password"
												iconContent={
													<Icon
														size={16}
														color={argonTheme.COLORS.ICON}
														name="padlock-unlocked"
														family="ArgonExtra"
														style={styles.inputIcons}
													/>
												}
											/>
										</Block>
										{/* add Drop down below this */}
										<ModalDropdown
											style={styles.shadow}
											dropdownStyle={styles.dropdown}
											dropdownTextStyle={{ paddingLeft: 16, fontSize: 12 }}
											options={this.state.dropOption}
											textStyle={styles.dropdownTextNormal}
											defaultValue={"User"}
											dropdownTextStyle={styles.dropdownTextStyle}
											onSelect={async (value) => {
												await this.setState({
													selectOption: this.state.dropOption[value],
												});
											}}
										></ModalDropdown>
										<Block row width={width * 0.75}>
											<Checkbox
												checkboxStyle={{
													borderWidth: 3,
												}}
												color={argonTheme.COLORS.PRIMARY}
												label="I agree with the"
												initialValue={this.state.privacy}
												onChange={() => this.setState({ privacy: !this.state.privacy })}
											/>
											<Button
												style={{ width: 100, elevation: -1 }}
												color="transparent"
												textStyle={{
													color: argonTheme.COLORS.PRIMARY,
													fontSize: 14,
												}}
											>
												Privacy Policy
											</Button>
										</Block>

										<Block middle>
											<Button color="primary" style={styles.createButton} onPress={this.registerUser}>
												<Text bold size={14} color={argonTheme.COLORS.WHITE} style={{ marginRight: 10 }}>
													CREATE ACCOUNT
												</Text>
												<Icon size={16} color={argonTheme.COLORS.WHITE} name="login" family="Entypo" />
											</Button>
										</Block>
									</KeyboardAvoidingView>
									<Block flex={0.15} middle row>
										<Text color="#8898AA" size={15}>
											Already a User? &nbsp;
										</Text>
										<Button
											style={{ width: 100 }}
											color="success"
											shadowless
											textStyle={{
												color: argonTheme.COLORS.WHITE,
												fontSize: 14,
											}}
											onPress={() => navigation.navigate("Login")}
										>
											Login here
										</Button>
									</Block>
								</Block>
							</Block>
						</Block>
					</Block>
				</ImageBackground>
				<Toast
					color={this.state.color}
					isShow={this.state.isShow}
					style={{ marginTop: "5%" }}
					fadeOutDuration={1000}
					fadeInDuration={1000}
					positionIndicator="bottom"
				>
					{this.state.err}
				</Toast>
			</Block>
		);
	}
}

const styles = StyleSheet.create({
	registerContainer: {
		width: width * 0.9,
		height: height * 0.875,
		backgroundColor: "#F4F5F7",
		borderRadius: 4,
		shadowColor: argonTheme.COLORS.BLACK,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowRadius: 8,
		shadowOpacity: 0.1,
		// elevation: 1,
		overflow: "hidden",
		flex: 0.8,
		alignItems: "center",
		justifyContent: "center",
	},
	socialConnect: {
		backgroundColor: argonTheme.COLORS.WHITE,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "#8898AA",
	},
	socialButtons: {
		width: 120,
		height: 40,
		backgroundColor: "#fff",
		shadowColor: argonTheme.COLORS.BLACK,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowRadius: 8,
		shadowOpacity: 0.1,
		elevation: 1,
	},
	inputIcons: {
		marginRight: 12,
	},
	passwordCheck: {
		paddingLeft: 15,
		paddingTop: 13,
		paddingBottom: 30,
	},
	createButton: {
		display: "flex",
		flexDirection: "row",
		width: width * 0.5,
		marginTop: 25,
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
	text: {
		color: argonTheme.COLORS.WHITE,
		fontWeight: "600",
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
});

export default Register;
