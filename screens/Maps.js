import React, { useState, useEffect } from "react";
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
import { Button, Icon, Input } from "../components";
const { width, height } = Dimensions.get("screen");
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Modal from "react-native-modal";
import * as IntentLauncher from "expo-intent-launcher";
import * as firebase from "firebase";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";

const Maps = () => {
	const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
	const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
	const [openSettings, setOpenSetting] = useState(false);
	const [appState, setAppState] = useState(AppState.currentState);
	const [isLoading, setIsLoading] = useState(true);
	const longitudeDelta = 0.1;
	const latitudeDelta = 0.1;
	const [info_display, setInfo_Display] = useState(false);
	const [data, setData] = useState([]);
	const [distData, setDistData] = useState({});
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		LogBox.ignoreAllLogs();
		AppState.addEventListener("change", handleAppStateChange);
		_getLocationAsync();

		return () => {
			AppState.removeEventListener("change", handleAppStateChange);
		};
	}, []);
	const openSetting = () => {
		if (Platform.OS == "ios") {
			Linking.openURL("app-settings:");
		} else {
			IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS);
		}
		setOpenSetting(false);
	};
	const _onRefresh = () => {
		setRefreshing(true);
		_getLocationAsync().then(() => {
			setRefreshing(false);
		});
	};
	const handleAppStateChange = (nextAppState) => {
		if (appState.match(/inactive|background/) && nextAppState === "active") {
			console.log("App has come to the foreground!");
			_getLocationAsync();
		}
		setAppState(nextAppState);
	};
	const _getLocationAsync = async () => {
		try {
			let { status } = await Permissions.askAsync(Permissions.LOCATION);
			if (status !== "granted") {
				console.log("Permission to access location was denied");
				return;
			}
			let location = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.Balanced,
					timeInterval: 50000,
					distanceInterval: 0,
				},
				async (newLocation) => {
					// console.log(newLocation.coords);
					let location = JSON.parse(JSON.stringify(newLocation));
					let obj = {};
					obj["latitude"] = location.coords.latitude;
					obj["longitude"] = location.coords.longitude;
					setLocation(obj);
					console.log();

					await getTrack();
				}
			);
		} catch (error) {
			let status = Location.getProviderStatusAsync();
			if (!status.locationServicesEnabled) {
				setIsLocationModalVisible(true);
			}
			console.log(error);
		}
	};
	const getTrack = async () => {
		const db = firebase.firestore();
		const rdb = firebase.database();
		await db
			.collection("userInfo")
			.doc(firebase.auth().currentUser.email.toString())
			.get()
			.then(async (doc) => {
				await rdb.ref("/location " + doc.data().phone).update({
					location: location,
				});
			});
		let arr = [];
		await db
			.collection("TrackOrder")
			.where("isComplete", "==", false)
			.get()
			.then(async (querySnapshot) => {
				await querySnapshot.forEach((doc) => {
					let obj = doc.data();
					let junk = 0;
					junk += obj.department.length;
					junk *= 2;
					junk += obj.sos === true ? 5 : 0;
					if (junk >= 8) {
						obj["color"] = "rgba(255,0,0,0.3)";
						obj["radius"] = 600;
					} else if (junk >= 4) {
						obj["color"] = "rgba(255,255,0,0.5)";
						obj["radius"] = 300;
					} else {
						obj["color"] = "rgba(0,255,0,0.3)";
						obj["radius"] = 100;
					}
					arr.push(obj);
				});
			});

		let obj = {};
		for (let i = 0; i < arr.length; i++) {
			await rdb.ref("/location " + arr[i].phone.toString()).on("value", (snapshot) => {
				if (snapshot.val()) {
					let obj = distData;
					obj[arr[i].phone.toString()] = snapshot.val();
					setDistData(obj);
				}
			});
		}
		setData(arr);
		setIsLoading(false);
	};

	return (
		<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />}>
			<Block flex center>
				<StatusBar hidden />
				<Modal onModalHide={openSettings ? openSetting : undefined} isVisible={isLocationModalVisible}>
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
							onPress={() => {
								setIsLocationModalVisible(false);
								setOpenSetting(true);
							}}
						>
							Enable Location Services
						</Button>
					</Block>
				</Modal>
				{isLoading ? (
					<Image source={require("../assets/map_loader.gif")} style={styles.mapStyle} />
				) : (
					<Block>
						<MapView
							style={styles.mapStyle}
							provider={PROVIDER_GOOGLE}
							region={{
								latitude: location.latitude,
								longitude: location.longitude,
								latitudeDelta: 0.04,
								longitudeDelta: 0.04,
							}}
							followUserLocation={true}
							zoomEnabled={true}
							showsUserLocation={true}
						>
							{data.length > 0
								? data.map((item, idx) => {
										return (
											<Circle
												center={
													typeof distData[item.phone.toString()] !== "undefined"
														? distData[item.phone.toString()].location
														: location
												}
												radius={typeof distData[item.phone.toString()] !== "undefined" ? item.radius : 0}
												strokeColor={item.color}
												fillColor={item.color}
											/>
										);
								  })
								: null}
						</MapView>
						<Block>
							<Text style={{color:"rgba(255,0,0,0.8)"}}>High Emergency</Text>
							<Text style={{color:"rgba(200,200,0,1)"}}>Can expect a delay</Text>
							<Text style={{color:"rgba(0,0,255,0.8)"}}>Blue: No Delay in Traffic but there is a emergency</Text>
						</Block>
					</Block>
				)}
			</Block>
		</ScrollView>
	);
};

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
		height: 500,
	},
	card: {
		width: Dimensions.get("window").width,
		height: 100,
	},
});

export default Maps;
