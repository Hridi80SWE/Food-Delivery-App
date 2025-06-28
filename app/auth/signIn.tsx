// import { auth, db } from '@/config/firebaseConfig';
// import Colors from '@/constant/Colors';
// import { UserDetailContext } from '@/context/UserDetailContext';
// import { router, useRouter } from 'expo-router';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import React, { useContext, useState } from 'react'
// import { View, Text, Pressable, TouchableOpacity, TextInput, Image, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native'

// export default function SignIn() {
//     const router = useRouter();
//     const [email, setEmail] = useState<string>("");
//     const [password, setPassword] = useState<string>("");
//     const [userDetail, setUserDetail] = useContext(UserDetailContext);
//     const [loading, setLoading] = useState(false);
//     const onSignInClick = () => {
//       setLoading(true);
//       signInWithEmailAndPassword(auth, email, password) 
//       .then(async (resp) => {
//         const user = resp.user;
//         console.log(user);
//         await getUserDetails();
//         router.replace('/(tabs)/home');
       
//       }).catch(e => {
//         console.log(e);
//         setLoading(false)
//         ToastAndroid.show('Incorrect Email or Password', ToastAndroid.BOTTOM);
        
//       })
//     }

//     const getUserDetails = async() => {
//       if (!email) return;
//       const result= await getDoc(doc(db, 'users', email));
//       console.log(result.data());
//       setUserDetail(result.data());
//     }
      
//   return (
//       <View
//         style={{
//           display: "flex",
//           alignItems: "center",
//           paddingTop: 100,
//           flex: 1,
//           backgroundColor: Colors.WHITE,
//           padding: 25,
//         }}
//       >
//         <Image
//           source={require("./../../assets/images/app_logo.png")}
//           style={{
//             width: 180,
//             height: 180,
//             borderRadius: 50,
//           }}
//         />
//         <Text
//           style={{
//             fontSize: 30,
//             fontFamily: "outfit-bold",
//           }}
//         >
//           Welcome Back!
//         </Text>
//         <TextInput placeholder=" Email"
//         onChangeText={(value)=>setEmail(value)}
//         style={styles.textInput}/>
//         <TextInput placeholder=" Password"
//           onChangeText={(value) => setPassword(value)}
//           secureTextEntry={true}
//           style={styles.textInput}/>
        
  
//         <TouchableOpacity
//         onPress={onSignInClick}
//         disabled={loading}
//           style={{
//             padding: 15,
//             backgroundColor: Colors.PRIMARY,
//             width: "100%",
//             marginTop: 25,
//             borderRadius: 10,
//           }}
//         >
//         {!loading ? (
//           <Text
//             style={{
//               fontFamily: "outfit",
//               fontSize: 20,
//               color: Colors.WHITE,
//               textAlign: "center",
//             }}
//           >
//             Sign In
//           </Text>
//         ) : 
//           <ActivityIndicator size={'large'} color={Colors.WHITE}/>
//         }
//         </TouchableOpacity>
//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             // gap: 5,
//             marginTop: 20,
//           }}
//         >
//           <Text
//             style={{
//               fontFamily: "outfit",
//             }}
//           >
//             Don't have an Account?
//           </Text>
  
//           <Pressable onPress={() => router.push("/auth/signUp")}>
//             <Text
//               style={{
//                 color: Colors.PRIMARY,
//                 fontFamily: "outfit-bold",
//                 marginLeft: 5, // 👈 replace `gap` with margin
//               }}
//             >
//               Create New Here
//             </Text>
//           </Pressable>
//         </View>
//       </View>
//   )
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


import { auth, db } from '@/config/firebaseConfig';
import Colors from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { router, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { View, Text, Pressable, TouchableOpacity, TextInput, Image, StyleSheet, ToastAndroid, ActivityIndicator, Alert, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);

    const onSignInClick = () => {
      if (!email.trim() || !password.trim()) {
        const message = 'Please fill in all fields';
        if (Platform.OS === 'android') {
          ToastAndroid.show(message, ToastAndroid.BOTTOM);
        } else {
          Alert.alert("Error", message);
        }
        return;
      }

      setLoading(true);
      signInWithEmailAndPassword(auth, email, password) 
      .then(async (resp) => {
        const user = resp.user;
        console.log(user);
        const userData = await getUserDetails();
        setLoading(false);
        // Always go to home page after sign in
        router.replace('/(tabs)/home');
      }).catch(e => {
        console.log(e);
        setLoading(false);
        const message = 'Incorrect Email or Password';
        if (Platform.OS === 'android') {
          ToastAndroid.show(message, ToastAndroid.BOTTOM);
        } else {
          Alert.alert("Error", message);
        }
      })
    }

    const getUserDetails = async() => {
      if (!email) return null;
      try {
        const result = await getDoc(doc(db, 'users', email));
        console.log(result.data());
        if (result.exists()) {
          setUserDetail(result.data());
          return result.data();
        }
        return null;
      } catch (error) {
        console.log('Error getting user details:', error);
        return null;
      }
    }
      
  return (
      <View style={styles.container}>
        {/* Top row: Back and Home text button aligned horizontally, a little lower */}
        <View style={styles.topRow}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/')}
            style={styles.homeTextButton}
          >
            <Text style={styles.homeText}>Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentWrapper}>
          <Image
            source={require("./../../assets/images/app_logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>
            Welcome Back!
          </Text>
          
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
            onPress={onSignInClick}
            disabled={loading}
            style={{
              padding: 15,
              backgroundColor: loading ? Colors.GRAY : Colors.PRIMARY,
              width: "100%",
              marginTop: 25,
              borderRadius: 10,
            }}
          >
          {!loading ? (
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 20,
                color: Colors.WHITE,
                textAlign: "center",
              }}
            >
              Sign In
            </Text>
          ) : 
            <ActivityIndicator size={'large'} color={Colors.WHITE}/>
          }
          </TouchableOpacity>
          
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit",
              }}
            >
              Don't have an Account?
            </Text>
            <Pressable onPress={() => router.push("/auth/signUp")}>
              <Text
                style={{
                  color: Colors.PRIMARY,
                  fontFamily: "outfit-bold",
                  marginLeft: 5,
                }}
              >
                Create New Here
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    )
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
    top: 70,
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
  contentWrapper: {
    marginTop: -30,
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-bold",
    marginTop: 20,
    marginBottom: 10,
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