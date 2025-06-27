// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import { UserDetailContext } from "./../context/UserDetailContext";
// import { useState } from "react";

// export default function RootLayout() {
//   useFonts({
//     'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
//     'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf')
//   })

//   const userState = useState(null);
//   return (
//     <UserDetailContext.Provider value={userState}>
//       <Stack
//         screenOptions={{
//           headerShown: false
//         }}
//       />
//       {/* <Toast position='top' visibilityTime={3000} topOffset={50} /> */}
//     </UserDetailContext.Provider>
//   )
// }
  

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { UserDetailContext } from "./../context/UserDetailContext";
import { useState, createContext, useContext, useEffect } from "react";
import { ActivityIndicator, View, TouchableOpacity, Text } from "react-native";
import Colors from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export const CartContext = createContext({
  cart: [],
  addToCart: (item: any) => {},
  removeFromCart: (id: string) => {},
  clearCart: () => {},
});

// Cart button to show on every page
function CartButton() {
  const router = useRouter();
  const { cart } = useContext(CartContext);
  const pathname = usePathname();
  const isMenuPage = pathname === "/(tabs)/menu";
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        top: isMenuPage ? 80 : 60, // Place slightly below the title on menu page
        right: 20,
        zIndex: 100,
        backgroundColor: Colors.WHITE,
        borderRadius: 25,
        padding: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
      onPress={() => router.push("/(tabs)/cart")}
    >
      <Ionicons name="cart" size={28} color={Colors.PRIMARY} />
      {cart.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 8,
            paddingHorizontal: 5,
            minWidth: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12, fontFamily: "outfit-bold" }}>{cart.length}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function MenuButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isMenuPage = pathname === "/(tabs)/menu";
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        top: isMenuPage ? 80 : 60,
        left: 20,
        zIndex: 100,
        backgroundColor: Colors.WHITE,
        borderRadius: 25,
        padding: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
      onPress={() => router.push("/(tabs)/menu")}
    >
      <Ionicons name="restaurant" size={28} color={Colors.PRIMARY} />
    </TouchableOpacity>
  );
}

function ProfileButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isMenuPage = pathname === "/(tabs)/menu";
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        top: isMenuPage ? 80 : 60,
        right: 70,
        zIndex: 100,
        backgroundColor: Colors.WHITE,
        borderRadius: 25,
        padding: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
      onPress={() => router.push("/(tabs)/profile")}
    >
      <Ionicons name="person-circle" size={28} color={Colors.PRIMARY} />
    </TouchableOpacity>
  );
}

function HomeButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isMenuPage = pathname === "/(tabs)/menu";
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        top: isMenuPage ? 80 : 60,
        left: 70,
        zIndex: 100,
        backgroundColor: Colors.WHITE,
        borderRadius: 25,
        padding: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
      onPress={() => router.push("/(tabs)/home")}
    >
      <Ionicons name="home" size={28} color={Colors.PRIMARY} />
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf')
  });

  const [userDetail, setUserDetail] = useState(null);

  // Cart state
  const [cart, setCart] = useState<any[]>([]);
  const addToCart = (item: any) => {
    setCart((prev) => {
      // If already in cart, increase quantity
      const idx = prev.findIndex((i) => i.id === item.id && i.variety === item.variety && i.flavour === item.flavour);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);


  const router = useRouter();
  const pathname = usePathname();

  // Protect routes: only allow index, signUp, signIn if not signed in
  useEffect(() => {
    const publicRoutes = ["/", "/auth/signUp", "/auth/signIn"];
    if (!userDetail && !publicRoutes.includes(pathname)) {
      router.replace("/");
    }
  }, [userDetail, pathname]);

  // Only show navigation buttons on protected routes
  const publicRoutes = ["/", "/auth/signUp", "/auth/signIn"];
  const showNavButtons = !publicRoutes.includes(pathname);

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.WHITE }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
        <Stack
          screenOptions={{
            headerShown: false,
            // Enable gesture navigation
            gestureEnabled: true,
            // Customize transitions
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen 
            name="auth/signUp" 
            options={{
              presentation: 'card',
              gestureEnabled: true,
            }}
          />
          <Stack.Screen 
            name="auth/signIn" 
            options={{
              presentation: 'card',
              gestureEnabled: true,
            }}
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{
              gestureEnabled: false, // Disable back gesture for main app
            }}
          />
        </Stack>
        {showNavButtons && (
          <>
            <MenuButton />
            <HomeButton />
            <ProfileButton />
            <CartButton />
          </>
        )}
        {/* <Toast position='top' visibilityTime={3000} topOffset={50} /> */}
      </CartContext.Provider>
    </UserDetailContext.Provider>
  )
}