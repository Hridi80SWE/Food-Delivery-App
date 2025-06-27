import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/constant/Colors";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";

type UserDetail = {
  name: string;
  email: string;
};

export default function Profile() {
  const { userDetail } = useContext(UserDetailContext) as { userDetail: UserDetail | null };
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/auth/signIn");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {userDetail ? (
        <>
          <Text style={styles.label}>Name: <Text style={styles.value}>{userDetail.name}</Text></Text>
          <Text style={styles.label}>Email: <Text style={styles.value}>{userDetail.email}</Text></Text>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>Not signed in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontFamily: 'outfit-bold', color: Colors.PRIMARY, marginBottom: 20 },
  label: { fontFamily: 'outfit', fontSize: 18, marginBottom: 10 },
  value: { fontFamily: 'outfit-bold', color: Colors.PRIMARY },
  text: { fontFamily: 'outfit', fontSize: 16 },
  signOutBtn: {
    marginTop: 30,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  signOutText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 16,
    textAlign: "center",
  },
});
