import React,{useCallback} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import { useRouter,useFocusEffect} from "expo-router";
import FeatureSlide1 from "../components/onboarding/FeatureSlide1";
import FeatureSlide2 from "../components/onboarding/FeatureSlide2";
import FeatureSlide3 from "../components/onboarding/FeatureSlide3";
import CustomButton from '../components/CustomButton';
import GuestLoginButton from '../components/JustTextButton';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Onboarding() {
const router = useRouter();

const removeAsyncStorage = async() => {
    try{
      const token = await AsyncStorage.getItem('authToken');
      if (token){
        console.log("success remove Async")
        await AsyncStorage.removeItem('authToken');
      }
    }catch (error){
        console.error('error remove Async');
    }

  };
  useFocusEffect(
    useCallback(()=> {removeAsyncStorage();})
  )


  return (
        <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Swiper loop={false} showsPagination={true} dotStyle={styles.dot} activeDotStyle={styles.activeDot}>
                <FeatureSlide1 />
                <FeatureSlide2 />
                <FeatureSlide3 />
            </Swiper>
        </View>
        <CustomButton title="Login/Register" onPress={() => router.push('/(auth)/login')}/>
        <GuestLoginButton title="Continue as Guest" onPress={async () =>  {await removeAsyncStorage(); router.push('/home')}}/>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2E2E2E",
        paddingHorizontal: 10,
    },
    imageContainer: {
        height: "70%",
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        backgroundColor: "#FFFFFF",
        width: 10,
        height: 10,
        borderRadius: 10,
        marginHorizontal: 5,

    },
    activeDot: {
        backgroundColor: "#00E6E6",
        width: 10,
        height: 10,
        borderRadius: 10,
        marginHorizontal: 5,
    },
});
