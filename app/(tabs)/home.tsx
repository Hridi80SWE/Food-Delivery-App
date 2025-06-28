import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/constant/Colors";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function Home() {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Foodie!</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/menu')}>
        <Text style={styles.buttonText}>Browse Menu</Text>
      </TouchableOpacity>
      {/* Show Add Menu Item button for admins */}
      {userDetail?.role === "admin" && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.SECONDARY || "#888", marginTop: 16 }]}
          onPress={() => router.push('/add-menu-item')}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>Add Menu Item</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontFamily: 'outfit-bold', color: Colors.PRIMARY, marginBottom: 30 },
  button: { backgroundColor: Colors.PRIMARY, padding: 16, borderRadius: 10 },
  buttonText: { color: Colors.WHITE, fontFamily: 'outfit', fontSize: 18 }
});
