import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, LogBox, TouchableWithoutFeedback, Keyboard, Dimensions,ImageBackground} from "react-native";
import Header from "../components/header1";
import TodoItem from "../components/todoItem";
import AddTodo from "../components/addTodo";
import { Select, Button } from "../components";
import { Block, theme } from "galio-framework";
import * as firebase from "firebase";

const { width, height } = Dimensions.get("screen");

export default function App({ navigation }) {
	const [todo, setTodo] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		LogBox.ignoreAllLogs();
		getData();
	}, []);
	const getData = () => {
		const db = firebase.firestore();
		const req = db
			.collection("TrackOrder")
			.where("department", "array-contains", firebase.auth().currentUser.email.toString())
			.where("isComplete", "==", false);
		req.get().then((query) => {
			let arr = [];
			query.forEach((doc) => {
				arr.push(doc.data());
			});
			console.log(arr);
			setTodo(arr);
			setLoading(false);
		});
	};

	return (
		
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Block style={styles.container}>
				<Header />
				<Block middle row style={{ justifyContent: "space-between", marginLeft: "10%", marginRight: "10%" }}>
					<Button
						icon="person-add"
						iconFamily="Ionicons"
						iconSize={20}
						radius={100}
						color="success"
						onlyIcon
						onPress={() => navigation.navigate("ListOfficials")}
					></Button>
					<Button color="info" onlyIcon icon="refresh" iconFamily="Ionicons" iconSize={20}></Button>
				</Block>
				{loading ? null : (
					<View style={styles.content}>
						<View style={styles.list}>
							<FlatList
								data={todo}
								renderItem={({ item }) => (
									<TodoItem
										item={item}
										pressHandler={() => {
											navigation.navigate("Emergency", { item: item });
										}}
									/>
								)}
							/>
						</View>
					</View>
				)}
			</Block>
		</TouchableWithoutFeedback>
		
	);
}

const styles = StyleSheet.create({
	container: {
	//	flex: 1,
	},
	content: {
		padding: 40,
		padding: 30,
	},
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 5.2,
	},
});
