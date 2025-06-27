import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from './../constant/Colors';
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { UserDetailContext, UserDetailProvider } from "@/context/UserDetailContext";


function IndexContent() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('user is signed in', user);
        const result = await getDoc(doc(db, 'users', user?.email || ''));
        setUserDetail(result.data());
        // Do NOT redirect to home here
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <View
      style={{
        flex: 1, 
        backgroundColor: Colors.WHITE  
      }}
    >
    <Image source={require('./../assets/images/landing.jpg')}
    style={{
      width: '100%',
      height: '300',
      marginTop: 70
    }}
    />

    <View style={{
        padding: 25,
        backgroundColor: Colors.PRIMARY,
        height: '100%',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35
    }}>
        <Text style={{
            fontSize: 30,
            // fontWeight: 'bold',
            textAlign: 'center',
            color: Colors.WHITE,
            fontFamily: 'outfit-bold'
        }}>Hungry? We got you</Text>
        <Text style={{
            fontSize: 20,
            color: Colors.WHITE,
            marginTop: 20,
            textAlign: 'center',
            fontFamily: 'outfit'
        }}>From Biryani to Bakarkhani, we deliver it all!!</Text>
   

    <TouchableOpacity style={styles.button}
    onPress={()=> router.push('/auth/signUp')}>
        <Text style={[styles.buttonText, {color: Colors.PRIMARY}]}>Get Started!</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.button, {
        backgroundColor: Colors.PRIMARY,
        borderWidth: 1,
        borderColor: Colors.WHITE
    }]}
    onPress={()=> router.push('/auth/signIn')}>
        <Text style={styles.buttonText}>Already have an Account?</Text>
    </TouchableOpacity>
    </View>

    </View>
  );
}

export default function Index() {
  return (
    <UserDetailProvider>
      <IndexContent />
    </UserDetailProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
  }
})





