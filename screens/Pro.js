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
	LogBox,
} from "react-native";
// import Header from "../components/Header";
import TodoItem from "../components/todoItem";
import * as firebase from "firebase";
import { Select, Button } from "../components";
import { Block, theme } from "galio-framework";
const { width, height } = Dimensions.get("screen");
export default function App({ navigation }) {
	const [todo, setTodo] = useState([]);
	const [refreshing, setRefreshing] = React.useState(false);
	const wait = (timeout) => {
		return new Promise((resolve) => setTimeout(resolve, timeout));
	};
	const getData = () => {
		setTodo([]);
		let arr = [];
		const db = firebase.firestore();
		const req = db
			.collection("sosRequest")
			.where("isAssigned", "==", false)
			.get()
			.then(async (query) => {
				await query.forEach((doc) => {
					let obj = doc.data();
					obj["_id"] = doc.id;
					arr.push(obj);
				});
				setTodo(arr);
			});
	};
	useEffect(() => {
		LogBox.ignoreAllLogs();
		getData();
	}, []);
	const pressHandler = (key) => {
		navigation.navigate("RouteSos", { _id: key });
	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getData();
		wait(2000).then(() => setRefreshing(false));
	}, []);

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<ScrollView
				style={styles.container}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>
				<View style={styles.content}>
					<Block style={styles.list}>
						<FlatList
							data={todo}
							renderItem={({ item }) => (
								<TodoItem
									item={item}
									pressHandler={() => {
										pressHandler(item._id);
									}}
								/>
							)}
						/>
					</Block>
				</View>
			</ScrollView>
		</TouchableWithoutFeedback>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	content: {
		padding: 40,
	},
	list: {
		marginTop: 20,
	},
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 5.2,
	},
});
// export default class Pro extends React.Component {
//   render() {
//     const { navigation } = this.props;

//     return (
//       <Block flex style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <Block flex>
//           <ImageBackground
//             source={Images.Pro}
//             style={{ flex: 1, height: height, width, zIndex: 1 }}
//           />
//           <Block space="between" style={styles.padded}>
//             <Block>
//               <Block>
//                 <Image source={Images.ArgonLogo}
//                   style={{ marginBottom: theme.SIZES.BASE * 1.5 }}/>
//               </Block>
//               <Block >
//                 <Block>
//                   <Text color="white" size={60}>Argon</Text>
//                 </Block>
//                 <Block>
//                   <Text color="white" size={60}>Design</Text>
//                 </Block>
//                 <Block row>
//                   <Text color="white" size={60}>System</Text>
//                   <Block middle style={styles.pro}>
//                     <Text size={16} color="white">PRO</Text>
//                   </Block>
//                 </Block>
//               </Block>
//               <Text size={16} color='rgba(255,255,255,0.6)' style={{ marginTop: 35 }}>
//                 Take advantage of all the features and screens made upon Galio Design System, coded on React Native for both.
//               </Text>
//               <Block row style={{ marginTop: theme.SIZES.BASE * 1.5, marginBottom: theme.SIZES.BASE * 4 }}>
//                 <Image
//                   source={Images.iOSLogo}
//                   style={{ height: 38, width: 82, marginRight: theme.SIZES.BASE * 1.5 }} />
//                 <Image
//                   source={Images.androidLogo}
//                   style={{ height: 38, width: 140 }} />
//               </Block>
//               <Button
//                 shadowless
//                 style={styles.button}
//                 color={argonTheme.COLORS.INFO}
//                 onPress={() => Linking.openURL('https://www.creative-tim.com/product/argon-pro-react-native').catch((err) => console.error('An error occurred', err))}>
//                 <Text bold color={theme.COLORS.WHITE}>BUY NOW</Text>
//               </Button>
//             </Block>
//           </Block>
//         </Block>
//       </Block>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: theme.COLORS.BLACK,
//     marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
//   },
//   padded: {
//     paddingHorizontal: theme.SIZES.BASE * 2,
//     zIndex: 3,
//     position: 'absolute',
//     bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
//   },
//   button: {
//     width: width - theme.SIZES.BASE * 4,
//     height: theme.SIZES.BASE * 3,
//     shadowRadius: 0,
//     shadowOpacity: 0,
//   },
//   pro: {
//     backgroundColor: argonTheme.COLORS.INFO,
//     paddingHorizontal: 8,
//     marginLeft: 3,
//     borderRadius: 4,
//     height: 22,
//     marginTop: 15
//   },
//   gradient: {
//     zIndex: 1,
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 66,
//   },
// });
