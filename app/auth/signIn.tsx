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
        await getUserDetails();
        setLoading(false);
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
      if (!email) return;
      try {
        const result = await getDoc(doc(db, 'users', email));
        console.log(result.data());
        if (result.exists()) {
          setUserDetail(result.data());
        }
      } catch (error) {
        console.log('Error getting user details:', error);
      }
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
            <Text style={styles.homeButtonText}>Home</Text>
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
  )
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
  homeButtonText: {
    color: Colors.PRIMARY,
    fontFamily: 'outfit',
    fontSize: 16,
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