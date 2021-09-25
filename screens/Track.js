import React from "react";
import {
	Image,
	StyleSheet,
	LogBox,
	Dimensions,
	StatusBar,
	AppState,
	Linking,
	Platform,
	RefreshControl,
	ScrollView,
} from "react-native";
import { Block, Checkbox, Text, Card } from "galio-framework";
import * as firebase from "firebase";

import { Button, Icon, Input } from "../components";
import * as axios from "axios";

const { width, height } = Dimensions.get("screen");
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Modal from "react-native-modal";
import * as IntentLauncher from "expo-intent-launcher";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import marker from "../assets/marker.png";

export default class Track extends React.Component {
	constructor(props) {
		super(props);
		this._getLocationAsync = this._getLocationAsync.bind(this);
		this.openSetting = this.openSetting.bind(this);
		this.handleAppStateChange = this.handleAppStateChange.bind(this);
		this.getTrack = this.getTrack.bind(this);

		this.state = {
			location: { latitude: 0, longitude: 0 },
			errors: "",
			isLocationModalVisible: false,
			openSetting: false,
			appState: AppState.currentState,
			location_other: [],
			isLoading: true,
			longitudeDelta: 0.009,
			latitudeDelta: 0.009,
			info_display: false,
			distance_time: [],
			user: null,
			refreshing: false,
		};
	}
	componentWillUnmount() {
		AppState.removeEventListener("change", this.handleAppStateChange);
	}
	componentDidMount() {
		LogBox.ignoreAllLogs();
		console.log(firebase.auth().currentUser.email);
		AppState.addEventListener("change", this.handleAppStateChange);
		this._getLocationAsync();
	}
	_onRefresh = () => {
		this.setState({ refreshing: true });
		this._getLocationAsync().then(() => {
			this.setState({ refreshing: false });
		});
	};
	getTrack = async () => {
		const db = firebase.firestore();
		const rdb = firebase.database();
		db.collection("userInfo")
			.doc(firebase.auth().currentUser.email.toString())
			.get()
			.then((doc) => {
				rdb.ref("/location " + doc.data().phone).update({
					location: this.state.location,
				});
			});

		db.collection("TrackOrder")
			.where("id", "==", this.props.route.params.item.id.toString())
			.get()
			.then(async (querySnapshot) => {
				let arr = [];
				await querySnapshot.forEach(async (doc) => {
					if (doc.data().email != firebase.auth().currentUser.email.toString()) {
						await rdb.ref("/location " + doc.data().phone).on("value", async (snapshot) => {
							await this.setState({
								distance_time: [],
								location_other: [],
							});
							if (snapshot.val()) {
								let obj = {};
								obj["info"] = doc.data();
								obj["location"] = snapshot.val();

								let LatDelta = Math.abs(snapshot.val().location.latitude - this.state.location.latitude);
								let LongDelta = Math.abs(snapshot.val().location.longitude - this.state.location.longitude);
								LatDelta = Math.max(2 * LatDelta, this.state.latitudeDelta);
								LongDelta = Math.max(2 * LongDelta, this.state.longitudeDelta);
								this.setState({
									latitudeDelta: LatDelta,
									longitudeDelta: LongDelta,
								});
								let url = "https://router.hereapi.com/v8/routes?transportMode=car&origin=";
								url +=
									this.state.location.latitude.toString() +
									"," +
									this.state.location.longitude.toString() +
									"&destination=" +
									snapshot.val().location.latitude.toString() +
									"," +
									snapshot.val().location.longitude.toString() +
									"&return=summary";
								// console.log(url)
								
								// url =
								// 	"https://apis.mapmyindia.com/advancedmaps/v1/d8beeae992a2a8cc21119da10d5fedbd/distance_matrix/driving/";
								// url +=
								// 	this.state.location.longitude.toString() +
								// 	"," +
								// 	this.state.location.latitude.toString() +
								// 	";" +
								// 	snapshot.val().location.longitude.toString() +
								// 	"," +
								// 	snapshot.val().location.latitude.toString();
								let token =
									"eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJaTmpLaUREUGN3Z3l2UEFVMnNHSSIsImlhdCI6MTYzMjU3OTg5MywiZXhwIjoxNjMyNjY2MjkzLCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLmlob2xLRlBPcXdHV2JLTERNYzgxSEEub3BzTFpsQ3ZWNlI0WWpDdTVYSkgxSFl3Q1ZDRnA1ck5fM2prQXpqNFdZTVRyOF9SRXlEeFNqSGh1U1RjTkE0N3FfYlZWV3Z2RnlHVWNEdkJpV09fSmJIWF82ZzhVeHFmMkZBRm5xMy1oWnFlZEd3V0cwU0FtMGtHTjFRZC1wa0IyQVloa3FWM21xd2tDVXJoWS1OZjZBLk12X0c4VWJ2V1dpVnlyRS1vcmdIYU9jcGpkcmd0ZlhxY0R2Wk92TFJzOG8.OWG6FTxsUOHTwSe_XyizcBaT1UkoNujIYlKO9DhA8P0W4viiFQy7KE6hnQ8jtcx-ZGGYCOoDdvxiAJj4M1V8C_cMunuP6JMlJIk6RqFYoIS8uT23P2csN_isH3aYpfH8rH9c4mvkx08fUxt1bjdglJ9lPTI1rrJzJ4-T8pOnNwMQIi8pAQ7oxUrro-p-qQfSv-vK6qdhbJTTa5IB6F1Aj0HpNey3PmZ-3En6GGzXkBHAjmBRa3LchzPkq0Kf7W4uLSC4qQjmV4O3_FqkDB7zaRdcw-jyn9Q4fjn9QDjj7dglgcqHhJ2BhHR9zn08ImeEj3dPNfUo4BBsUuqwkIp07A";
								const config = {
									headers: { Authorization: `Bearer ${token}` },
								};
								const bodyParameters = {
									key: "value",
								};
								axios
									.get(url, config)
									.then((data) => {
										// console.log(data.data.routes[0].sections[0].summary);
										let dist = data.data.routes[0].sections[0].summary.length;
										let time = data.data.routes[0].sections[0].summary.duration;
										let dist_str = "";
										let time_str = "";
										if (dist >= 1000) {
											dist_str =
												parseInt(dist / 1000).toString() +
												" Km " +
												parseInt(dist % 1000).toString() +
												" m";
										} else {
											dist_str = (dist % 1000).toString() + " m";
										}
										if (time >= 60) {
											time_str =
												parseInt(time / 60).toString() +
												" min " +
												parseInt(time % 60).toString() +
												" sec";
										} else {
											time_str = (time % 60).toString() + " sec";
										}
										let junk = this.state.distance_time;
										junk.push({
											distance: dist_str,
											time: time_str,
										});
										this.setState({
											distance_time: junk,
										});
									})
									.catch((err) => console.log(err));
								arr.push(obj);
							}
						});
					}
				});
				this.setState({ location_other: arr, isLoading: false });
			});

		// db.collection("TrackOrder")
		// 	.where("User", "==", firebase.auth().currentUser.email.toString())
		// 	.get()
		// 	.then((querySnapshot) => {
		// 		querySnapshot.forEach((doc) => {
		// 			try {
		// 				console.log(doc.data());
		// 				if (doc.data().Emergency == true) {
		// 					rdb.ref("order/" + doc.data().Id).update({
		// 						location_victim: {
		// 							user: firebase.auth().currentUser.email.toString(),
		// 							location: this.state.location,
		// 						},
		// 					});
		// 					rdb.ref("order/" + doc.data().Id).on("value", async (snapshot) => {
		// 						if (snapshot.val().location_service) {
		// 							let LatDelta = Math.abs(
		// 								snapshot.val().location_service.location.latitude - this.state.location.latitude
		// 							);
		// 							let LongDelta = Math.abs(
		// 								snapshot.val().location_service.location.longitude - this.state.location.longitude
		// 							);
		// 							this.setState({
		// 								location_other: snapshot.val().location_service.location,
		// 								latitudeDelta: 2 * LatDelta,
		// 								longitudeDelta: 2 * LongDelta,
		// 								user: snapshot.val().location_victim.user,
		// 							});
		// 							let url =
		// 								"https://apis.mapmyindia.com/advancedmaps/v1/66531ff291938b704ed43d9149ddc8c8/distance_matrix_eta/driving/";
		// 							url +=
		// 								this.state.location.longitude.toString() +
		// 								"," +
		// 								this.state.location.latitude.toString() +
		// 								";" +
		// 								this.state.location_other.longitude.toString() +
		// 								"," +
		// 								this.state.location_other.latitude.toString();

		// 							axios.get(url).then((data) => {
		// 								let dist = data.data.results.distances[0][1];
		// 								let time = data.data.results.durations[0][1];
		// 								let dist_str = "";
		// 								let time_str = "";
		// 								if (dist >= 1000) {
		// 									dist_str =
		// 										parseInt(dist / 1000).toString() +
		// 										" Km " +
		// 										parseInt(dist % 1000).toString() +
		// 										" m";
		// 								} else {
		// 									dist_str = (dist % 1000).toString() + " m";
		// 								}
		// 								if (time >= 60) {
		// 									time_str =
		// 										parseInt(time / 60).toString() +
		// 										" hrs " +
		// 										parseInt(time % 60).toString() +
		// 										" min";
		// 								} else {
		// 									time_str = (time % 60).toString() + " min";
		// 								}
		// 								this.setState({
		// 									distance: dist_str,
		// 									time: time_str,
		// 									info_display: true,
		// 								});
		// 							});
		// 						}
		// 					});
		// 				} else {
		// 					rdb.ref("order/" + doc.data().Id).update({
		// 						location_service: {
		// 							user: firebase.auth().currentUser.email.toString(),
		// 							location: this.state.location,
		// 						},
		// 					});
		// 					rdb.ref("order/" + doc.data().Id).on("value", async (snapshot) => {
		// 						if (snapshot.val().location_victim) {
		// 							let LatDelta = Math.abs(
		// 								snapshot.val().location_victim.location.latitude - this.state.location.latitude
		// 							);
		// 							let LongDelta = Math.abs(
		// 								snapshot.val().location_victim.location.longitude - this.state.location.longitude
		// 							);
		// 							this.setState({
		// 								location_other: snapshot.val().location_victim.location,
		// 								latitudeDelta: 2 * LatDelta,
		// 								longitudeDelta: 2 * LongDelta,
		// 								user: snapshot.val().location_victim.user,
		// 							});

		// 							let url =
		// 								"https://apis.mapmyindia.com/advancedmaps/v1/66531ff291938b704ed43d9149ddc8c8/distance_matrix_eta/driving/";
		// 							url +=
		// 								this.state.location.longitude.toString() +
		// 								"," +
		// 								this.state.location.latitude.toString() +
		// 								";" +
		// 								this.state.location_other.longitude.toString() +
		// 								"," +
		// 								this.state.location_other.latitude.toString();

		// 							axios.get(url).then((data) => {
		// 								let dist = data.data.results.distances[0][1];
		// 								let time = data.data.results.durations[0][1];
		// 								let dist_str = "";
		// 								let time_str = "";
		// 								if (dist >= 1000) {
		// 									dist_str =
		// 										parseInt(dist / 1000).toString() +
		// 										" Km " +
		// 										parseInt(dist % 1000).toString() +
		// 										" m";
		// 								} else {
		// 									dist_str = (dist % 1000).toString() + " m";
		// 								}
		// 								if (time >= 60) {
		// 									time_str =
		// 										parseInt(time / 60).toString() +
		// 										" hrs " +
		// 										parseInt(time % 60).toString() +
		// 										" min";
		// 								} else {
		// 									time_str = (time % 60).toString() + " min";
		// 								}
		// 								this.setState({
		// 									distance: dist_str,
		// 									time: time_str,
		// 									info_display: true,
		// 								});
		// 							});
		// 						}
		// 					});
		// 				}

		// 				this.setState({
		// 					isLoading: false,
		// 				});
		// 			} catch (error) {
		// 				console.log(error);
		// 			}
		// 		});
		// 	});
	};
	handleAppStateChange = (nextAppState) => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
			console.log("App has come to the foreground!");
			this._getLocationAsync();
		}
		this.setState({ appState: nextAppState });
	};
	_getLocationAsync = async () => {
		try {
			let { status } = await Permissions.askAsync(Permissions.LOCATION);
			if (status !== "granted") {
				this.setState({
					errorMessage: "Permission to access location was denied",
				});
				return;
			}
			let location = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.Balanced,
					timeInterval: 5000,
					distanceInterval: 0,
				},
				async (newLocation) => {
					// console.log(newLocation.coords);
					let location = JSON.parse(JSON.stringify(newLocation));
					let obj = {};
					obj["latitude"] = location.coords.latitude;
					obj["longitude"] = location.coords.longitude;
					await this.setState({
						location: obj,
					});
					await this.getTrack();
				}
			);
		} catch (error) {
			let status = Location.getProviderStatusAsync();
			if (!status.locationServicesEnabled) {
				this.setState({ isLocationModalVisible: true });
			}
			console.log(error);
		}
	};
	openSetting = () => {
		if (Platform.OS == "ios") {
			Linking.openURL("app-settings:");
		} else {
			IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS);
		}
		this.setState({ openSetting: false });
	};
	render() {
		return (
			<Block flex>
				<ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
					<StatusBar hidden />
					<Modal
						onModalHide={this.state.openSetting ? this.openSetting : undefined}
						isVisible={this.state.isLocationModalVisible}
					>
						<Block
							style={{
								height: 300,
								width: 300,
								backgroundColor: "white",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Button
								onPress={() =>
									this.setState({
										isLocationModalVisible: false,
										openSetting: true,
									})
								}
							>
								Enable Location Services
							</Button>
						</Block>
					</Modal>
					{this.state.isLoading ? (
						<Image source={require("../assets/map_loader.gif")} style={{ width: 300, height: 300 }} />
					) : (
						<Block>
							<MapView
								style={styles.mapStyle}
								provider={PROVIDER_GOOGLE}
								region={{
									latitude: this.state.location.latitude,
									longitude: this.state.location.longitude,
									latitudeDelta: this.state.latitudeDelta,
									longitudeDelta: this.state.longitudeDelta,
								}}
								followUserLocation={true}
								ref={(ref) => (this.mapView = ref)}
								zoomEnabled={true}
								showsUserLocation={true}
							>
								{this.state.location_other.length > 0
									? this.state.location_other.map((item, idx) => {
											return (
												<Marker key={idx} coordinate={item.location.location} title={"Other Location"}>
													<Image source={marker} style={{ width: 40, height: 40 }} />
												</Marker>
											);
									  })
									: null}
							</MapView>
						</Block>
					)}
					<Text />

					<Block middle center>
						{this.state.location_other.length > 0 ? (
							this.state.distance_time.length > 0 ? (
								this.state.location_other.map((item, idx) => {
									return (
										<Block key={idx}>
											<Card
												title={item.info.name}
												caption={this.state.distance_time[idx].time}
												style={styles.card}
												location={this.state.distance_time[idx].distance}
												avatar={"https://robohash.org/" + item.info.name}
											/>
										</Block>
									);
								})
							) : (
								<Text>Loading</Text>
							)
						) : (
							<Text>Loading</Text>
						)}
					</Block>
				</ScrollView>
			</Block>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 10,
		alignItems: "center",
	},
	animationContainer: {
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
	buttonContainer: {
		paddingTop: 20,
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: 400,
	},
	card: {
		width: Dimensions.get("window").width,
		height: 100,
	},
});
