import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/constant/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterRole() {
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top row: Back and Home text button aligned horizontally */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeTextButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Select Your Role</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "admin" && styles.selectedRoleButton,
          ]}
          onPress={() => setRole("admin")}
        >
          <Text
            style={[
              styles.roleText,
              role === "admin" && styles.selectedRoleText,
            ]}
          >
            Admin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "user" && styles.selectedRoleButton,
          ]}
          onPress={() => setRole("user")}
        >
          <Text
            style={[
              styles.roleText,
              role === "user" && styles.selectedRoleText,
            ]}
          >
            User
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionContainer}>
        {/* Only show Sign Up if role is user */}
        {role === "user" && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: Colors.PRIMARY, marginBottom: 10 },
              !role && { opacity: 0.5 },
            ]}
            disabled={!role}
            onPress={() => router.push("/auth/signUp")}
          >
            <Text style={styles.actionText}>Sign Up</Text>
          </TouchableOpacity>
        )}
        {/* Always show Sign In if a role is selected */}
        {role && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.PRIMARY },
              !role && { opacity: 0.5 },
            ]}
            disabled={!role}
            onPress={() => router.push("/auth/signIn")}
          >
            <Text style={[styles.actionText, { color: Colors.PRIMARY }]}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  topRow: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  homeTextButton: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    paddingHorizontal: 18,
    paddingVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  homeText: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    marginBottom: 40,
    color: Colors.PRIMARY,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
    gap: 20,
  },
  roleButton: {
    paddingVertical: 20,
    paddingHorizontal: 35,
    borderRadius: 12,
    backgroundColor: Colors.LIGHT_GRAY || "#f0f0f0",
    marginHorizontal: 10,
  },
  selectedRoleButton: {
    backgroundColor: Colors.PRIMARY,
  },
  roleText: {
    fontSize: 20,
    color: Colors.PRIMARY,
    fontFamily: "outfit",
  },
  selectedRoleText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
  },
  actionContainer: {
    width: "100%",
    marginTop: 10,
  },
  actionButton: {
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: {
    fontSize: 18,
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
  },
});
