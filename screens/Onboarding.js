import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";

class Onboarding extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex style={styles.background}>
          <ImageBackground
            source={Images.Onboarding}
            style={{ height, width, zIndex: 1 }}
          />
        </Block>
        <Block center>
          <Image source={Images.LogoOnboarding} style={styles.logo} />
        </Block>
        <Block center>
          <Image source={Images.TitleOnboarding} style={styles.logotitle} />
        </Block>
        <Block flex space="between" style={styles.padded}>
          <Block flex space="around" style={{ zIndex: 2 }}>
            <Block style={styles.title}>
              <Block>
                <Text color="white" size={60}></Text>
              </Block>
              <Block>
                <Text color="white" size={60}></Text>
              </Block>
              {/* <Block style={styles.subTitle}>
                <Text color="black" size={20} textStyle={{ fontWeight: 900 }}>
                  An Emergency Service Tracking App
                </Text>
              </Block> */}
            </Block>
            <Block>
              <Button
                style={styles.button}
                color={argonTheme.COLORS.WARNING}
                onPress={() => navigation.navigate("App")}
                textStyle={{
                  color: argonTheme.COLORS.WHITE,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                GET HELP
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginTop: "-30%",
  },
  logo: {
    width: 350,
    height: 350,
    zIndex: 2,
    position: "relative",
    marginTop: "-40%",
  },
  logotitle: {
    width: 350,
    height: 200,
    zIndex: 2,
    position: "relative",
    marginTop: "-10%",
  },
  title: {
    // marginTop: "-5%",
  },
  subTitle: {
    marginTop: 20,
  },
  // background: {
  //   flex: 1,
  //   backgroundColor: "yellow",
  //   zIndex: 1,
  //   position: "relative",
  // },
});

export default Onboarding;
