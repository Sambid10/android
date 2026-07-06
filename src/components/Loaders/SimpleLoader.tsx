import LottieView from "lottie-react-native";
import { StyleSheet ,View} from "react-native";
export const SimpleLoader = () => (
  <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      <LottieView
            source={require("../../assets/loading.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
  </View>
);
const styles = StyleSheet.create({

  lottie: {
    height:250,
    width:250,
    marginTop:"-50%"
  },
});