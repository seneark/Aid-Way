import React from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { argonTheme } from "../constants";
import { Text, Card, theme, Icon } from "galio-framework";
const { width, height } = Dimensions.get("screen");
export default function TodoItem({ pressHandler, item }) {
	return (
		<TouchableOpacity onPress={() => pressHandler(item.id)}>
			<Card
				flex
				style={styles.card}
				title={item.title}
				caption={item.name}
				avatar={"https://robohash.org/" + item.name + item.title}
			/>
      <Text/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	item: {
		padding: 15,
		borderColor: "orange",
		borderWidth: 1,
		borderStyle: "solid",
		borderRadius: 10,
		height: 60,
		textAlign: "center",
		backgroundColor: "lightblue",
		fontWeight: "bold",
		fontSize: 22,
		color: "white",
	},
	socialTextButtons: {
		color: argonTheme.COLORS.BLOCK,
		fontWeight: "800",
		fontSize: 18,
		color: argonTheme.COLORS.WHITE,
	},
	socialButtons: {
		width: width - theme.SIZES.BASE * 5,
		height: 60,
		backgroundColor: argonTheme.COLORS.INFO,
		shadowColor: argonTheme.COLORS.BLACK,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowRadius: 8,
		shadowOpacity: 0.2,
		elevation: 6,
	},
});
