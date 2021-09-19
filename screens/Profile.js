import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  FlatList,
  LogBox
} from "react-native";
import { Block, Text, theme, Input, Icon,Radio } from "galio-framework";
import Icon1 from "../components/Icon";
import Input1 from "../components/Input";
import { Button, Select } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import Header from "../components/Header";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

function Profile() {
  const [service, addService] = useState([
    { key: 1, title: "Delhi Thane" },
    { key: 2, title: "Delhi Firebrigade" },
    { key: 3, title: "Delhi Hospital" },
  ]);
  return (
    <Block flex style={styles.profile}>
      <Block flex>
        {/* <Block center>
            <Header search />
          </Block> */}
        <ImageBackground
          source={Images.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: "25%" }}
          >
            <Block flex style={styles.profileCard}>
              {/* <Block>
                <FlatList
                  data={service}
                  renderItem={({ item }) => (
                    <View>
                      <Text>{item.title}</Text>
                    </View>
                  )}
                ></FlatList>
              </Block> */}
              <Block style={styles.info}>
                <Text
                  h1
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Router Page
                </Text>
                <Block
                  middle
                  row
                  space="evenly"
                  style={{ marginTop: 20, paddingBottom: 30 }}
                >
                  {/* <Block middle style={styles.avatarContainer}>
                      <Image
                        source={{ uri: Images.ProfilePicture }}
                        style={styles.avatar}
                      />
                    </Block> */}
                </Block>
              </Block>
              <Block flex center style={{ marginTop: 8 }}>
                <Select
                  defaultIndex={0}
                  options={["H1", "H2", "H3", "H4", "H5"]}
                />
                {/* <Select
                    defaultIndex={0}
                    options={[
                      "Heart Attack",
                      "Labour",
                      "Accident",
                      "Brain Stroke",
                      "Other",
                    ]}
                  /> */}
              </Block>
              <Block flex>
                <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                  <Text
                    h3
                    size={16}
                    color={argonTheme.COLORS.DEFAULT}
                    style={{ marginTop: 10 }}
                  >
                    Issue
                  </Text>
                  <Block style={styles.divider} />
                  <Input
                    right
                    placeholder="What is your issue?"
                    style={{
                      borderColor: argonTheme.COLORS.DEFAULT,
                      borderRadius: 4,
                      backgroundColor: "#fff",
                    }}
                  />
                </Block>
                <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                  <Text
                    h3
                    size={16}
                    color={argonTheme.COLORS.DEFAULT}
                    style={{ marginTop: 10 }}
                  >
                    Description
                  </Text>
                  <Block style={styles.divider} />
                  <Input
                    right
                    placeholder="Emergency Desription"
                    style={{
                      borderColor: argonTheme.COLORS.DEFAULT,
                      borderRadius: 4,
                      backgroundColor: "#fff",
                    }}
                  />
                </Block>
              </Block>
            </Block>
            <Block center>
              <Button color="success" style={styles.button}>
                ASSIGN
              </Button>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
      {/* <ScrollView showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{ flex: 1, width, height, zIndex: 9000, backgroundColor: 'red' }}>
        <Block flex style={styles.profileCard}>
          <Block middle style={styles.avatarContainer}>
            <Image
              source={{ uri: Images.ProfilePicture }}
              style={styles.avatar}
            />
          </Block>
          <Block style={styles.info}>
            <Block
              middle
              row
              space="evenly"
              style={{ marginTop: 20, paddingBottom: 24 }}
            >
              <Button small style={{ backgroundColor: argonTheme.COLORS.INFO }}>
                CONNECT
              </Button>
              <Button
                small
                style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
              >
                MESSAGE
              </Button>
            </Block>

            <Block row space="between">
              <Block middle>
                <Text
                  bold
                  size={12}
                  color="#525F7F"
                  style={{ marginBottom: 4 }}
                >
                  2K
                </Text>
                <Text size={12}>Orders</Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 4 }}>
                  10
                </Text>
                <Text size={12}>Photos</Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 4 }}>
                  89
                </Text>
                <Text size={12}>Comments</Text>
              </Block>
            </Block>
          </Block>
          <Block flex>
              <Block middle style={styles.nameInfo}>
                <Text bold size={28} color="#32325D">
                  Jessica Jones, 27
                </Text>
                <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                  San Francisco, USA
                </Text>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block middle>
                <Text size={16} color="#525F7F" style={{ textAlign: "center" }}>
                  An artist of considerable range, Jessica name taken by
                  Melbourne …
                </Text>
                <Button
                  color="transparent"
                  textStyle={{
                    color: "#233DD2",
                    fontWeight: "500",
                    fontSize: 16
                  }}
                >
                  Show more
                </Button>
              </Block>
              <Block
                row
                style={{ paddingVertical: 14, alignItems: "baseline" }}
              >
                <Text bold size={16} color="#525F7F">
                  Album
                </Text>
              </Block>
              <Block
                row
                style={{ paddingBottom: 20, justifyContent: "flex-end" }}
              >
                <Button
                  small
                  color="transparent"
                  textStyle={{ color: "#5E72E4", fontSize: 12 }}
                >
                  View all
                </Button>
              </Block>
              <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                <Block row space="between" style={{ flexWrap: "wrap" }}>
                  {Images.Viewed.map((img, imgIndex) => (
                    <Image
                      source={{ uri: img }}
                      key={`viewed-${img}`}
                      resizeMode="cover"
                      style={styles.thumb}
                    />
                  ))}
                </Block>
              </Block>
          </Block>
        </Block>
                  </ScrollView>*/}
    </Block>
  );
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: -1,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: 44,
    color: argonTheme.COLORS.HEADER,
  },
  group: {
    paddingTop: theme.SIZES.BASE * 2,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 5.2,
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
  },
  inputDefault: {
    borderBottomColor: argonTheme.COLORS.PLACEHOLDER,
  },
  inputTheme: {
    borderBottomColor: argonTheme.COLORS.PRIMARY,
  },
  inputInfo: {
    borderBottomColor: argonTheme.COLORS.INFO,
  },
  inputSuccess: {
    borderBottomColor: argonTheme.COLORS.SUCCESS,
  },
  inputWarning: {
    borderBottomColor: argonTheme.COLORS.WARNING,
  },
  inputDanger: {
    borderBottomColor: argonTheme.COLORS.ERROR,
  },
});

export default Profile;
