import React from "react";
import { withNavigation } from "@react-navigation/compat";
import PropTypes from "prop-types";
import LottieView from "lottie-react-native";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback, Linking, Platform } from "react-native";
import { Block, Text, theme, Button, Icon } from "galio-framework";

import { argonTheme } from "../constants";

class Card extends React.Component {
	dialCall = (phone) => {
		let phoneNumber = "";

		if (Platform.OS === "android") {
      
			phoneNumber = "tel:${" + phone + "}";
		} else {
			phoneNumber = "telprompt:${"+ phone +"}";
		}

		Linking.openURL(phoneNumber);
	};

	render() {
		const { navigation, item, horizontal, full, style, ctaColor, imageStyle } = this.props;
		const imageStyles = [full ? styles.fullImage : styles.horizontalImage, imageStyle];
		const cardContainer = [styles.card, styles.shadow, style];
		const imgContainer = [styles.imageContainer, horizontal ? styles.horizontalStyles : styles.verticalStyles, styles.shadow];

		return (
			<Block row={horizontal} card flex style={cardContainer}>
				<TouchableWithoutFeedback onPress={() => navigation.navigate("Pro")}>
					<Block flex style={imgContainer}>
						<Image source={item.image} style={imageStyles} />

						{/* <LottieView
              source={require("../assets/animation/police.json")}
              autoPlay
              loop
            /> */}
					</Block>
				</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={() => navigation.navigate("Pro")}>
					<Block flex space="between" style={styles.cardDescription}>
						<Text size={20} style={styles.cardTitle}>
							{item.title}
						</Text>

						<Button
							color={theme.COLORS.SUCCESS}
							icon="phone"
							iconFamily="feather"
							iconSize={20}
							iconColor="#fff"
							onPress={() => {
								this.dialCall(this.props.item.phone);
							}}
						>
							{item.cta}
						</Button>

						{/* <Text
              size={12}
              muted={!ctaColor}
              color={ctaColor || argonTheme.COLORS.ACTIVE}
              bold
            ></Text> */}
					</Block>
				</TouchableWithoutFeedback>
			</Block>
		);
	}
}

Card.propTypes = {
	item: PropTypes.object,
	horizontal: PropTypes.bool,
	full: PropTypes.bool,
	ctaColor: PropTypes.string,
	imageStyle: PropTypes.any,
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: theme.COLORS.WHITE,
		marginVertical: theme.SIZES.BASE,
		borderWidth: 0,
		minHeight: 200,
		marginBottom: 16,
	},
	cardTitle: {
		flex: 1,
		flexWrap: "wrap",
		padding: 16,
		textAlign: "center",
		fontWeight: "bold",
	},
	cardDescription: {
		padding: theme.SIZES.BASE / 2,
	},
	imageContainer: {
		borderRadius: 3,
		elevation: 1,
		overflow: "hidden",
	},
	image: {
		// borderRadius: 3,
	},
	horizontalImage: {
		height: 190,
		width: "auto",
	},
	horizontalStyles: {
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
	},
	verticalStyles: {
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
	},
	fullImage: {
		height: 215,
	},
	shadow: {
		shadowColor: theme.COLORS.BLACK,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.1,
		elevation: 2,
	},
});

export default withNavigation(Card);
