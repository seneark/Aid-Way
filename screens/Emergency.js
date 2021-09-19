import { Block, theme, Toast, Card } from "galio-framework";
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Dimensions, LogBox } from "react-native";
import { Select, Button, Icon } from "../components";
import * as firebase from "firebase";
import SearchableDropdown from "react-native-searchable-dropdown";
import { argonTheme } from "../constants";
const { width, height } = Dimensions.get("screen");

export default function Emergency(props) {
	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState(null);
	const [assignedPerson, setAssignedPerson] = useState([]);
	const [err, setErr] = useState("");
	const [isShow, setIsShow] = useState(false);
	const [color, setColor] = useState("warning");
	const wait = (timeout) => {
		return new Promise((resolve) => setTimeout(resolve, timeout));
	};
	const getData = () => {
		const db = firebase.firestore();
		const req = db
			.collection("TrackOrder")
			.where("department", "==", firebase.auth().currentUser.email.toString())
			.where("id", "==", props.route.params.item.id)
			.where("emergency", "==", false);
		req.get().then((query) => {
			let arr = [];
			query.forEach((doc) => {
				let obj = doc.data();
				arr.push(obj);
			});
			setAssignedPerson(arr);
		});

		const usr = db.collection("userInfo").where("department", "==", firebase.auth().currentUser.email.toString());
		usr.get().then((query) => {
			let arr = [];
			query.forEach((doc) => {
				let obj = doc.data();
				obj["email"] = doc.id;

				arr.push(obj);
			});
			setItems(arr);
		});
	};
	useEffect(() => {
		LogBox.ignoreAllLogs();
		getData();
	}, []);
	const assign = () => {
		const db = firebase.firestore();
		let flag = 1;
		for (let i = 0; i < assignedPerson.length; i++) {
			if (assignedPerson[i].email === selectedItems.email) flag = 0;
		}
		if (flag === 1) {
			const req = db.collection("TrackOrder").add({
				department: selectedItems.department,
				email: selectedItems.email,
				id: props.route.params.item.id,
				phone: selectedItems.phone,
				name: selectedItems.name,
				title: selectedItems.title,
				emergency: false,
			});
			let junk = assignedPerson;
			junk.push(selectedItems);
			setSelectedItems(junk);
			setErr("Successfully Assigned");
			setIsShow(true);
			setColor("success");
			wait(2000).then(() => setIsShow(false));
		} else {
			setErr("Already assigned to this person");
			setColor("warning");
			setIsShow(true);
			wait(2000).then(() => setIsShow(false));
		}
	};
	return (
		<Block>
			<Block center style={styles.profileCard}>
				<Text style={styles.title}>Issue : {props.route.params.item.title}</Text>
				<Block center middle row>
					<Icon size={22} color={argonTheme.COLORS.ERROR} name="report" family="MaterialIcons" />
					<Text style={styles.subtitle}>Reported By : {props.route.params.item.name}</Text>
				</Block>
				<Text />
				<Text style={styles.description}>
					<Text style={{ fontWeight: "bold" }}>Description</Text> : {props.route.params.item.description}
				</Text>
				<Block>
					{assignedPerson.length > 0 ? (
						<Block>
							{assignedPerson.map((item) => {
								return (
									<Block middle center row>
										<Text style={styles.caption}>Assigned To {item.name} </Text>
										<Icon size={22} color={argonTheme.COLORS.SUCCESS} name="person" family="Octicons" />
									</Block>
								);
							})}
						</Block>
					) : null}
				</Block>
				<SearchableDropdown
					selectedItems={selectedItems}
					onItemSelect={(item) => {
						setSelectedItems(item);
					}}
					containerStyle={{ padding: 5, width: 320 }}
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
						placeholder: "Select Officials",
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
				{/* <Block>{selectedItems ? <Text>Selected Official:{selectedItems.name} </Text> : null}</Block> */}
				<Button
					color="success"
					style={styles.button}
					onPress={() => {
						assign();
					}}
				>
					ASSIGN
				</Button>
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
		</Block>
	);
}
const styles = StyleSheet.create({
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 5.2,
	},
	title: {
		fontSize: 22,
		marginBottom: 10,
		color: theme.COLORS.TWITTER,
	},
	subtitle: {
		fontSize: 19,
	},
	caption: {
		fontSize: 15,
		color: theme.COLORS.MUTED,
		marginLeft: 100,
		fontWeight: "800",
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
});
