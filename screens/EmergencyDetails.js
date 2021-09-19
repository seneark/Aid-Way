import { Block, theme, Toast } from "galio-framework";
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Dimensions, LogBox } from "react-native";
import { Select, Button } from "../components";
import * as firebase from "firebase";
import SearchableDropdown from "react-native-searchable-dropdown";

const { width, height } = Dimensions.get("screen");

export default function Emergency(props) {
	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState(null);
	const [assignedPerson, setAssignedPerson] = useState([]);
	const [err, setErr] = useState("");
	const [isShow, setIsShow] = useState(false);
	useEffect(() => {
		LogBox.ignoreAllLogs();
	});
	// const wait = (timeout) => {
	// 	return new Promise((resolve) => setTimeout(resolve, timeout));
	// };
	// useEffect(() => {
	// 	const db = firebase.firestore();
	// 	const req = db
	// 		.collection("TrackOrder")
	// 		.where("department", "==", firebase.auth().currentUser.email.toString())
	// 		.where("id", "==", props.route.params.item.id)
	// 		.where("emergency", "==", false);
	// 	req.get().then((query) => {
	// 		let arr = [];
	// 		query.forEach((doc) => {
	// 			let obj = doc.data();
	// 			arr.push(obj);
	// 		});
	// 		setAssignedPerson(arr);
	// 	});

	// 	const usr = db.collection("userInfo").where("department", "==", firebase.auth().currentUser.email.toString());
	// 	usr.get().then((query) => {
	// 		let arr = [];
	// 		query.forEach((doc) => {
	// 			let obj = doc.data();
	// 			obj["email"] = doc.id;

	// 			arr.push(obj);
	// 		});
	// 		setItems(arr);
	// 	});
	// }, []);
	// const assign = () => {
	// 	const db = firebase.firestore();
	// 	let flag = 1;
	// 	for (let i = 0; i < assignedPerson.length; i++) {
	// 		if (assignedPerson[i].email === selectedItems.email) flag = 0;
	// 	}
	// 	if (flag === 1) {
	// 		const req = db.collection("TrackOrder").add({
	// 			department: selectedItems.department,
	// 			email: selectedItems.email,
	// 			id: props.route.params.item.id,
	// 			phone: selectedItems.phone,
	// 			name: selectedItems.name,
	// 			title: selectedItems.title,
	// 			emergency: false,
	// 		});
	// 	} else {
	// 		setErr("Already assigned to this person");
	// 		setIsShow(true);
	// 		wait(2000).then(() => setIsShow(false));
	// 	}
	// };
	return (
		<Block center>
			<Block center>
				<Text style={styles.title}>Title</Text>
				<Text style={styles.subtitle}>Name</Text>
				<Text style={styles.description}>Description</Text>
				<Text>List Officals assigned to this case will come here</Text>
				<Text>Map wil be shown</Text>
				{/* <Block>
					{assignedPerson.length > 0 ? (
						<Block>
							<Text>Assigned to</Text>
							{assignedPerson.map((item) => {
								return (
									<Block>
										<Text>{item.name}</Text>
									</Block>
								);
							})}
						</Block>
					) : null}
				</Block> */}
				{/* <SearchableDropdown
					selectedItems={selectedItems}
					onItemSelect={(item) => {
						setSelectedItems(item);
					}}
					containerStyle={{ padding: 5, width: 380 }}
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
					defaultIndex={0}
					chip={true}
					resetValue={false}
					textInputProps={{
						placeholder: "Select official",
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
				/> */}
				{/* <Block>{selectedItems ? <Text>Selected Official:{selectedItems.name} </Text> : null}</Block> */}
				{/* <Button
					color="success"
					style={styles.button}
					onPress={() => {
						assign();
					}}
				>
					ASSIGN
				</Button> */}
				<Toast
					color="warning"
					isShow={isShow}
					style={{ marginTop: "-30%" }}
					fadeOutDuration={1000}
					fadeInDuration={1000}
					positionIndicator="top"
				>
					{err}
				</Toast>
			</Block>
		</Block>
	);
}
const styles = StyleSheet.create({
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 5.2,
	},
	title: {
		fontSize: 25,
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 22,
		marginBottom: 10,
	},
	description: {
		fontSize: 10,
		textAlign: "center",
	},
});
