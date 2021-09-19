import React from "react";
import { StyleSheet, Dimensions, ScrollView, LogBox } from "react-native";
import { Block, theme, Text } from "galio-framework";
import { argonTheme } from "../constants";
import { Card, Button, Icon } from "../components";
import articles from "../constants/articles";
import * as firebase from "firebase";
const { width } = Dimensions.get("screen");

class Home extends React.Component {
	componentDidMount() {
		LogBox.ignoreAllLogs();
	}
	renderArticles = () => {
		return (
			<ScrollView contentContainerStyle={styles.articles}>
				<Block flex>
					{/* <Card item={articles[0]} horizontal  /> */}
					{/* <Block flex row>
            <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} />
            <Card item={articles[2]} />
          </Block> */}
					{/* <Card item={articles[3]} horizontal /> */}
					<Card item={articles[0]} horizontal />
					<Card item={articles[1]} horizontal />
					<Card item={articles[2]} horizontal />
					<Card item={articles[3]} horizontal />
					<Card item={articles[4]} horizontal />
				</Block>
			</ScrollView>
		);
	};

	render() {
		return (
			<Block flex center style={styles.home}>
        <Text style={{ fontSize: 25, color: theme.COLORS.INFO, fontWeight: "bold", textAlign: "center" }}>
						Welcome, {firebase.auth().currentUser.email.toString()}
					</Text>
				{this.renderArticles()}
				<Block row>
					<Button color="error" onPress={() => this.props.navigation.navigate("Sos")}>
						SOS
					</Button>
					<Button color="error" onPress={() => this.props.navigation.navigate("User")}>
						SEE REQUESTS
					</Button>
				</Block>
			</Block>
		);
	}
}

const styles = StyleSheet.create({
	home: {
		width: width,
	},
	articles: {
		// borderColor: "black",
		// borderWidth: 5,
		width: width - theme.SIZES.BASE * 2,
		paddingVertical: theme.SIZES.BASE,
		height: 1200,
	},
});

export default Home;
