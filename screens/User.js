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
	SafeAreaView,
	LogBox,
} from "react-native";

import TodoItem from "../components/todoItem";
import AddTodo from "../components/addTodo";
import { Block, theme, Text } from "galio-framework";
import * as firebase from "firebase";

const { width, height } = Dimensions.get("screen");

const User = ({ navigation }) => {
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
		const req = db
			.collection("TrackOrder")
			.where("email", "==", firebase.auth().currentUser.email.toString())
			.where("isComplete", "==", false);
		req.get().then(async (query) => {
			let arrIn = [];
			await query.forEach((doc) => {
				arrIn.push(doc.data());
			});
			setIncompleteTodo(arrIn);
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
					<Text />
					<Text style={styles.title}>Pending Cases</Text>
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
								<Text>There are no pending Cases</Text>
							</Block>
						)}
					</View>
				</View>
			</TouchableWithoutFeedback>
		</ScrollView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	content: {
		paddingLeft: 40,
		paddingRight: 40,
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

export default User;
