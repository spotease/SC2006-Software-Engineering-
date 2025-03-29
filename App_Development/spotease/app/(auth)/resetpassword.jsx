import React, { useState, useEffect } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import EntryBox from "../../components/EntryBox";
import CustomButton from "../../components/CustomButton";
import logo from '../../assets/images/SpotEaseLogo.png';

const API_URL = `https://sc2006-backend-spotease.onrender.com/password/resetpassword`;

export default function ResetPassword() {
    const router = useRouter();
    const [OTP, setOTP] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(60); 
    const [isExpired, setIsExpired] = useState(false);

    // Countdown Timer Logic
    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer); // Cleanup on unmount
        } else {
            setIsExpired(true); // Mark OTP as expired
        }
    }, [countdown]);

    const handleResetPassword = async () => {
        if (!OTP.trim() || !password.trim() || !password1.trim()) {
            Alert.alert("Error", "All fields are required. Try again.");
            return;
        }

        //password must be at least 8 characters long and contain at least one number and one special character
        if (!password.match("^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$")) {
            setError("Password must be at least 8 characters long and contain at least one number and one special character.");
            return;
        }

        //checks if password and password1 are the same
        if (password !== password1) {
            setError("Passwords do not match! Please try again.");
            return;
        }
        
        if (password !== password1) {
            setError("Passwords do not match! Please try again.");
            Alert.alert("Error", "Passwords do not match! Please try again.");
            setPassword1("");
            return;
        }

        try {
            const resetResponse = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ OTP, password }),
            });

            if (!resetResponse.ok) {
                const errorData = await resetResponse.json();
                Alert.alert("Error", errorData.error || "An error occurred while resetting the password.");
                return;
            }

            const data = await resetResponse.json();
            Alert.alert("Success", data.message || "Password reset successfully!");
            router.push("/login");
        } catch (error) {
            console.error("Error resetting password:", error);
            Alert.alert("Error", "Internal Server Error");
        }
    };

    // Format countdown time (mm:ss)
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const expiryMessage = () =>{
        if (isExpired){
            return message = "OTP has expired. Please request a new one.";
        }
        else {
            return message = `OTP expires in: ${formatTime(countdown)}`;
        }
    }

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Reset Your Password</Text>

            <Text style={styles.timer}>{expiryMessage()}</Text>

            <EntryBox
                placeholder="OTP"
                value={OTP}
                keyboardType="numeric"
                onChangeText={setOTP}
            />

            <EntryBox
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <EntryBox
                placeholder="Confirm Password"
                value={password1}
                onChangeText={setPassword1}
                secureTextEntry
            />

            <CustomButton title="Reset Password" onPress={handleResetPassword} disabled={isExpired} />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: "#2E2E2E", flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", color: "#00E6E6", marginBottom: 20 },
    logo: { width: 400, height: 200, marginBottom: 15 },
    timer: { color: "#FFD700", fontSize: 16, marginVertical: 10 },
    expiredText: { color: "red", fontSize: 14, marginBottom: 10 },
    errorText: { color: "red", marginTop: 10 },
});
