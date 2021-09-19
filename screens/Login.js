import React from "react";
import { StyleSheet, ImageBackground, Dimensions, StatusBar, KeyboardAvoidingView, LogBox } from "react-native";
import { Block, Checkbox, Text, Toast } from "galio-framework";
import * as firebase from "firebase";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";

const { width, height } = Dimensions.get("screen");

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			privacy: false,
			err: "",
			isShow: false,
			color: "",
		};
		this.LoginUser = this.LoginUser.bind(this);
	}
	componentDidMount() {
		LogBox.ignoreAllLogs();
	}
	async LoginUser() {
		const db = firebase.firestore();
		if (this.state.privacy) {
			// konsa dashboard kiska h
			// Router : "Route"
			// Victim : "Home"
			// Emergency : "EmergencyDash"
			//Puneet madarchod hai

			firebase
				.auth()
				.signInWithEmailAndPassword(this.state.email, this.state.password)
				.then((user) => {
					let usr = db.collection("userInfo").doc(this.state.email);
					usr.get().then((doc) => {
						if (doc.data().type == "Router") {
							this.props.navigation.navigate("Route");
						} else if (doc.data().type == "User") {
							this.props.navigation.navigate("Home");
						} else if (doc.data().type == "Emergency Person") {
							this.props.navigation.navigate("EmergencyPerson");
						} else {
							this.props.navigation.navigate("EmergencyDash");
						}
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
								<Block flex={0.4} middle>
									<Text color="#8898AA" size={25}>
										Login Here
									</Text>
								</Block>
								<Block flex center middle>
									<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
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
										<Block width={width * 0.8}>
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
											<Button color="success" style={styles.createButton} onPress={this.LoginUser}>
												<Text bold size={14} color={argonTheme.COLORS.WHITE} style={{ marginRight: 10 }}>
													LOGIN
												</Text>
												<Icon size={16} color={argonTheme.COLORS.WHITE} name="login" family="Entypo" />
											</Button>
										</Block>
									</KeyboardAvoidingView>
									<Block flex={0.15} middle row>
										<Text color="#8898AA" size={15}>
											Don't have an account? &nbsp;
										</Text>
										<Button
											style={{ width: 100 }}
											color="primary"
											textStyle={{
												color: argonTheme.COLORS.WHITE,
												fontSize: 14,
											}}
											onPress={() => navigation.navigate("Register")}
										>
											Register Here
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
		elevation: 1,
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
	socialTextButtons: {
		color: argonTheme.COLORS.PRIMARY,
		fontWeight: "800",
		fontSize: 14,
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
});

export default Login;
