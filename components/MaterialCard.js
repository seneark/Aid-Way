import React, { Component } from "react";
import { View, StyleSheet, ScrollView, FlatList, Dimensions } from "react-native";
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from "react-native-cards";
import { Block, Text, theme } from "galio-framework";
import { Button, Select, Icon, Input } from "../components/";
import { Images, argonTheme } from "../constants";
import * as firebase from "firebase";

const { width, height } = Dimensions.get("screen");
class MaterialCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: true,
		};
	}
	removeUser() {
		const db = firebase.firestore();
		const usr = db
			.collection("userInfo")
			.where("department", "==", firebase.auth().currentUser.email.toString())
			.where("name", "==", this.props.officials.name)
			.where("phone", "==", this.props.officials.phone);
		usr.get().then((query) => {
			query.forEach((doc) => {
				let foo = db.collection("userInfo").doc(doc.id);
				foo.update({
					department: null,
					title: null,
				});
			});
			this.setState({isShow: false});
		});
	}
	render() {
		const { officials } = this.props;

		return (
			<Block>
				{this.state.isShow ? (
					<ScrollView>
						<Card avatarSource={{ uri: "https://robohash.org/" + officials.name + officials.title }}>
							<CardTitle title={officials.name} subtitle={officials.title} />
							<Block middle flex center style={styles.btn}>
								<Button color="success" style={styles.button} onPress={() => this.removeUser()}>
									REMOVE
								</Button>
							</Block>
						</Card>
					</ScrollView>
				) : null}
			</Block>
		);
	}
}

const styles = StyleSheet.create({
	btn: {
		position: "absolute",
		top: "15%",
		right: 0,
	},
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 18,
	},
	title: {
		paddingBottom: theme.SIZES.BASE,
		paddingHorizontal: theme.SIZES.BASE,
		color: argonTheme.COLORS.HEADER,
	},
});

export default MaterialCard;
