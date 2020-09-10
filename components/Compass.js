import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

export default class Compass extends Component {
  constructor() {
    super();
    this.spinValue = new Animated.Value(0);
    this.state = {
      location: null,
      errorMessage: null,
      heading: null,
      truenoth: null,
    };
  }

  UNSAFE_componentWillMount() {
    this._getLocationAsync();
  }

  UNSAFE_componentWillUpdate() {
    this.spin();
  }

  _getLocationAsync = async () => {
    // Checking device location permissions
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    } else {
      Location.watchHeadingAsync((obj) => {
        let heading = obj.magHeading;
        this.setState({ heading: heading });
      });
    }
  };

  spin() {
    let start = JSON.stringify(this.spinValue);
    let heading = Math.round(this.state.heading);

    let rot = +start;
    let rotM = rot % 360;

    if (rotM < 180 && heading > rotM + 180) rot -= 360;
    if (rotM >= 180 && heading <= rotM - 180) rot += 360;

    rot += heading - rotM;

    Animated.timing(this.spinValue, {
      toValue: rot,
      duration: 300,
      easing: Easing.easeInOut,
      useNativeDriver: true,
    }).start();
  }

  render() {
    let LoadingText = "Loading...";
    let display = LoadingText;

    if (this.state.errorMessage) display = this.state.errorMessage;

    const spin = this.spinValue.interpolate({
      inputRange: [0, 360],
      outputRange: ["-0deg", "-360deg"],
    });

    display = Math.round(JSON.stringify(this.spinValue));

    if (display < 0) display += 360;
    if (display > 360) display -= 360;

    return (
      <LinearGradient colors={["#E4EEF7", "#D0E0EF"]} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.text}>{display + "°"}</Text>

          <View>
            <View style={styles.container2}>
              <View style={styles.arrowContainer}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/arrow2.png")}
                  style={styles.arrow}
                />
              </View>
              <Image
                resizeMode="contain"
                source={require("../assets/compass_base.png")}
                style={{
                  width: deviceWidth - 10,
                  height: deviceHeight / 2 - 10,
                }}
              />
            </View>
            <View style={styles.imageContainer}>
              <Animated.Image
                resizeMode="contain"
                source={require("../assets/coor.png")}
                style={{
                  width: deviceWidth - 10,
                  height: deviceHeight / 2 - 10,
                  transform: [{ rotate: spin }],
                  position: "absolute",
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{ bottom: 30, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 52, color: "#31456A", padding: 10 }}>
            compass
          </Text>
          <View>
            <Image
              resizeMode="contain"
              source={require("../assets/logo.png")}
              style={{ width: 138, height: 19 }}
            />
          </View>
        </View>
      </LinearGradient>
    );
  }
}

// Device dimensions so we can properly center the images set to 'position: absolute'
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#263544",
    fontSize: 40,
    position: "absolute",
    zIndex: 999,
  },
  imageContainer: {
    position: "absolute",
  },

  arrow: {
    width: 13,
    height: 71,
    position: "absolute",
    left: -5,
    zIndex: 999,
  },
  container2: {
    alignItems: "center",
    justifyContent: "center",
  },
});
