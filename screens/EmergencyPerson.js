// import React, { useState, useEffect } from "react";
// import { StyleSheet, View, FlatList, LogBox, TouchableWithoutFeedback, Keyboard, Dimensions,ImageBackground} from "react-native";
// import Header from "../components/header1";
// import TodoItem from "../components/todoItem";
// import AddTodo from "../components/addTodo";
// import { Select, Button } from "../components";
// import { Block, theme } from "galio-framework";
// import * as firebase from "firebase";
// import { Images, argonTheme } from "../constants";

// const { width, height } = Dimensions.get("screen");

// export default function App({ navigation }) {
// 	const [todo, setTodo] = useState([]);
// 	// const [loading, setLoading] = useState(true);
// 	// useEffect(() => {
// 	// 	LogBox.ignoreAllLogs();
// 	// 	getData();
// 	// }, []);
// 	// const getData = () => {
// 	// 	const db = firebase.firestore();
// 	// 	const req = db
// 	// 		.collection("TrackOrder")
// 	// 		.where("department", "array-contains", firebase.auth().currentUser.email.toString())
// 	// 		.where("isComplete", "==", false);
// 	// 	req.get().then((query) => {
// 	// 		let arr = [];
// 	// 		query.forEach((doc) => {
// 	// 			arr.push(doc.data());
// 	// 		});
// 	// 		console.log(arr);
// 	// 		setTodo(arr);
// 	// 		setLoading(false);
// 	// 	});
// 	// };

// 	return (
// 		<ImageBackground source={Images.Onboarding} style={{ width, height, zIndex: 1 }}>
// 		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
// 			<Block style={styles.container}>
// 					<View style={styles.content}>
// 						<View style={styles.list}>
// 							<FlatList
// 								data={todo}
// 								renderItem={({ item }) => (
// 									<TodoItem
// 										item={item}
// 										pressHandler={() => {
// 											navigation.navigate("Emergency", { item: item });
// 										}}
// 									/>
// 								)}
// 							/>
// 						</View>
// 					</View>
// 				<Block row center></Block>
// 			</Block>
// 		</TouchableWithoutFeedback>
// 		</ImageBackground>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 	//	flex: 1,
// 	},
// 	content: {
// 		padding: 40,
// 		padding: 30,
// 	},
// 	button: {
// 		marginBottom: theme.SIZES.BASE,
// 		width: width - theme.SIZES.BASE * 5.2,
// 	},
// });
import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	FlatList,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
	Dimensions,
	ScrollView,
	RefreshControl,
	LogBox,
} from "react-native";

import TodoItem from "../components/todoItem";
import AddTodo from "../components/addTodo";
import { Block, theme, Text } from "galio-framework";
import * as firebase from "firebase";

const { width, height } = Dimensions.get("screen");

export default function App({ navigation }) {
	const [incompleteTodo, setIncompleteTodo] = useState([]);
	const [completeTodo, setCompleteTodo] = useState([]);
	const [refreshing, setRefreshing] = React.useState(false);
	const wait = (timeout) => {
		return new Promise((resolve) => setTimeout(resolve, timeout));
	};
	const pressHandler = (item) => {
		// console.log(item)
		navigation.navigate("Track", { item: item });
	};
	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getData();
		wait(2000).then(() => setRefreshing(false));
	}, []);
	const getData = () => {
		const db = firebase.firestore();
		setIncompleteTodo([]);
		setCompleteTodo([]);
		const req = db.collection("TrackOrder").where("email", "==", firebase.auth().currentUser.email.toString());
		req.get().then((query) => {
			query.forEach(async (doc) => {
				let arrIn = [];
				let arrComp = [];
				const junk = db.collection("TrackOrder").where("id", "==", doc.data().id);
				await junk.get().then((qu) => {
					qu.forEach((d) => {
						if (d.data().isComplete == false) {
							arrIn.push(d.data());
						} else if (d.data().isComplete == true) {
							arrComp.push(d.data());
						}
					});
				});
				setIncompleteTodo(arrIn);
				setCompleteTodo(arrComp);
			});
		});
	};
	useEffect(() => {
		LogBox.ignoreAllLogs();
		getData();
	}, []);

	return (
		<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={styles.container}>
					<Text style={{ fontSize: 25, color: theme.COLORS.INFO, fontWeight: "bold", textAlign: "center" }}>
						Welcome, {firebase.auth().currentUser.email.toString()}
					</Text>

					<Text style={styles.title}>Current Cases</Text>
					<View style={styles.content}>
						{incompleteTodo.length > 0 ? (
							<View style={styles.list}>
								<FlatList
									data={incompleteTodo}
									renderItem={({ item }) => (
										<TodoItem
											item={item}
											pressHandler={() => {
												pressHandler(item);
											}}
										/>
									)}
								/>
							</View>
						) : (
							<Block center>
								<Text>There are no current Cases</Text>
							</Block>
						)}
					</View>
					<Text style={styles.title}>Previous Cases</Text>
					<View style={styles.content}>
						{completeTodo.length > 0 ? (
							<View style={styles.list}>
								<FlatList
									data={completeTodo}
									renderItem={({ item }) => (
										<TodoItem
											item={item}
											pressHandler={() => {
												pressHandler(item);
											}}
										/>
									)}
								/>
							</View>
						) : (
							<Block center>
								<Text>There are no previous solved Cases</Text>
							</Block>
						)}
					</View>
				</View>
			</TouchableWithoutFeedback>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	content: {
		padding: 40,
	},
	list: {
		marginTop: 20,
	},
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 5.2,
	},
	title: {
		fontSize: 22,
		color: theme.COLORS.PRIMARY,
		fontWeight: "bold",
		textAlign: "center",
	},

	scrollView: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
