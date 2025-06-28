// import Colors from "@/constant/Colors";
// import { useRouter } from "expo-router";
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '../../config/firebaseConfig';
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Pressable,
// } from "react-native";
// import { doc, setDoc } from "firebase/firestore";
// import { UserDetailContext } from "@/context/UserDetailContext";

// export default function SignUp() {
//   const router = useRouter();
//   const [fullName, setFullName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [userDetail, setUserDetail] = React.useContext(UserDetailContext);
//   const CreateNewAccount = () => {
//     console.log(email, password);

//     const credential = createUserWithEmailAndPassword(auth, email, password)
//       .then(async (resp) => {
//         const user = resp.user;
//         console.log(user);
//         await SaveUser(user);
//         // Toast.show({
//         //   type: 'success',
//         //   text1: 'Congratualtions!',
//         //   text2: 'Account created successfully 👋',
//         // });
//         //Save user to database
//       })
//       .catch(e => {
//         console.log(e.message)
//       })

//     console.log(credential);

//   }

//   const SaveUser = async (user: { uid: string; email: string | null }) => {
//     const data = {
//       name: fullName,
//       email: email,
//       member: false,
//       uid: user.uid
//     };
//     await setDoc(doc(db, 'users', email), data);
//     setUserDetail(data);
//   }
//   return (
//     <View
//       style={{
//         display: "flex",
//         alignItems: "center",
//         paddingTop: 100,
//         flex: 1,
//         backgroundColor: Colors.WHITE,
//         padding: 25,
//       }}
//     >
//       <Image
//         source={require("./../../assets/images/app_logo.png")}
//         style={{
//           width: 180,
//           height: 180,
//           borderRadius: 50,
//         }}
//       />
//       <Text
//         style={{
//           fontSize: 30,
//           fontFamily: "outfit-bold",
//         }}
//       >
//         Create New Account
//       </Text>
//       <TextInput placeholder=" Full Name" onChangeText={(value) => setFullName(value)} style={styles.textInput}></TextInput>
//       <TextInput placeholder=" Email" onChangeText={(value) => setEmail(value)} style={styles.textInput}></TextInput>
//       <TextInput
//         placeholder=" Password"
//         onChangeText={(value) => setPassword(value)}
//         secureTextEntry={true}
//         style={styles.textInput}
//       ></TextInput>

//       <TouchableOpacity
//         onPress={CreateNewAccount}
//         style={{
//           padding: 15,
//           backgroundColor: Colors.PRIMARY,
//           width: "100%",
//           marginTop: 25,
//           borderRadius: 10,
//         }}
//       >
//         <Text
//           style={{
//             fontFamily: "outfit",
//             fontSize: 20,
//             color: Colors.WHITE,
//             textAlign: "center",
//           }}
//         >
//           Create Account
//         </Text>
//       </TouchableOpacity>
//       <View
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           gap: 5,
//           marginTop: 20,
//         }}
//       >
//         <Text
//           style={{
//             fontFamily: "outfit",
//           }}
//         >
//           Already have an account
//         </Text>

//         <Pressable onPress={() => router.push("/auth/signIn")}>
//           <Text
//             style={{
//               color: Colors.PRIMARY,
//               fontFamily: "outfit-bold",
//             }}
//           >
//             Sign In Here
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   textInput: {
//     borderWidth: 1,
//     width: "100%",
//     padding: 15,
//     fontSize: 18,
//     marginTop: 20,
//     borderRadius: 8,
//   },
// });

// // No changes needed, just ensure context provider is present higher up in the tree


import Colors from "@/constant/Colors";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert
} from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Ionicons } from '@expo/vector-icons';

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = React.useContext(UserDetailContext);

  const CreateNewAccount = () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    console.log(email, password);
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        console.log(user);
        await SaveUser(user);
        setLoading(false);
        router.replace('/(tabs)/home');
        // router.push('/auth/signIn');
        // Toast.show({
        //   type: 'success',
        //   text1: 'Congratulations!',
        //   text2: 'Account created successfully 👋',
        // });
      })
      .catch(e => {
        console.log(e.message);
        setLoading(false);
        Alert.alert("Error", e.message);
      });
  }

  const SaveUser = async (user: { uid: string; email: string | null }) => {
    const data = {
      name: fullName,
      email: email,
      member: false,
      uid: user.uid
    };
    await setDoc(doc(db, 'users', email), data);
    setUserDetail(data);
  }

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: 60,
        flex: 1,
        backgroundColor: Colors.WHITE,
        padding: 25,
      }}
    >
      {/* Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.push('/')}
          style={styles.homeButton}
        >
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require("./../../assets/images/app_logo.png")}
        style={{
          width: 180,
          height: 180,
          borderRadius: 50,
          marginTop: 20,
        }}
      />
      <Text
        style={{
          fontSize: 30,
          fontFamily: "outfit-bold",
          marginTop: 20,
        }}
      >
        Create New Account
      </Text>
      
      <TextInput 
        placeholder="Full Name" 
        onChangeText={(value) => setFullName(value)}
        value={fullName}
        style={styles.textInput}
      />
      
      <TextInput 
        placeholder="Email" 
        onChangeText={(value) => setEmail(value)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.textInput}
      />
      
      <TextInput
        placeholder="Password"
        onChangeText={(value) => setPassword(value)}
        value={password}
        secureTextEntry={true}
        style={styles.textInput}
      />

      <TouchableOpacity
        onPress={CreateNewAccount}
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: loading ? Colors.GRAY : Colors.PRIMARY,
          width: "100%",
          marginTop: 25,
          borderRadius: 10,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.WHITE} />
        ) : (
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 20,
              color: Colors.WHITE,
              textAlign: "center",
            }}
          >
            Create Account
          </Text>
        )}
      </TouchableOpacity>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
          }}
        >
          Already have an account?
        </Text>

        <Pressable onPress={() => router.push("/auth/register-role")}>
          <Text
            style={{
              color: Colors.PRIMARY,
              fontFamily: "outfit-bold",
            }}
          >
            Sign In Here
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 5,
  },
  backButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: Colors.LIGHT_GRAY || '#f0f0f0',
  },
  homeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  homeText: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY || '#ddd',
    width: "100%",
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
  },
});