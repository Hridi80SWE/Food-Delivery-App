
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import Colors from "@/constant/Colors";
import { useContext, useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { CartContext } from "../_layout";
import { Picker } from "@react-native-picker/picker";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";

type Food = {
  id: string;
  name: string;
  price: number;
  varieties?: string[];
  flavours?: string[];
  image?: any;
};

const STATIC_FOODS: Food[] = [
  {
    id: "1",
    name: "Chicken Biryani",
    price: 250,
    varieties: ["Regular", "Spicy"],
    flavours: ["Hyderabadi", "Kolkata"],
    image: require('../../assets/images/chicken_biryani.jpg'), // <-- Use .jpg or .png, not .jfif
  },
  {
    id: "2",
    name: "Bakarkhani",
    price: 60,
    varieties: ["Plain", "Butter"],
    flavours: [],
    image: require('../../assets/images/bakarkhani.jpg'), // <-- Use .jpg or .png, not .webp
  },
  {
    id: "3",
    name: "Paneer Butter Masala",
    price: 180,
    varieties: ["Regular"],
    flavours: [],
    image: require('../../assets/images/paneer_butter_masala.jpg')
  },
  {
    id: "4",
    name: "Mutton Korma",
    price: 350,
    varieties: ["Regular", "Special"],
    flavours: ["Lucknowi", "Awadhi"],
    image: require('../../assets/images/mutton_korma.jpg')
  },
];

export default function Menu() {
  const { addToCart } = useContext(CartContext);
  const { userDetail } = useContext(UserDetailContext);
  const isFocused = useIsFocused();
  const router = useRouter();
  const [foods, setFoods] = useState<Food[]>([]);
  const [selected, setSelected] = useState<{ [id: string]: { variety: string; flavour: string; quantity: number } }>({});

  // Fetch foods and handle static fallback
  useEffect(() => {
    const fetchFoods = async () => {
      const querySnapshot = await getDocs(collection(db, "foods"));
      const fetched = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          varieties: data.varieties || [],
          flavours: data.flavours || [],
          imageUrl: data.imageUrl,
        } as Food;
      });

      // Merge static and Firestore items, avoiding duplicates by name
      const allFoods = [
        ...STATIC_FOODS.filter(staticItem =>
          !fetched.some(f => f.name === staticItem.name)
        ),
        ...fetched
      ];
      setFoods(allFoods);
    };
    fetchFoods();
  }, [isFocused]);

  const handleAddToCart = (item: any) => {
    const sel = selected[item.id] || {
      variety: item.varieties[0] || "",
      flavour: item.flavours[0] || "",
      quantity: 1,
    };
    addToCart({
      ...item,
      variety: sel.variety,
      flavour: sel.flavour,
      quantity: sel.quantity,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <View style={{ height: 50 }} />
      <FlatList
        data={foods}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          // Fallback: if Firebase item has no imageUrl, try to find static image by name
          let fallbackImage = null;
          if (!item.imageUrl) {
            const staticMatch = STATIC_FOODS.find(f => f.name === item.name);
            if (staticMatch) fallbackImage = staticMatch.image;
          }
          const sel = selected[item.id] || {
            variety: item.varieties[0] || "",
            flavour: item.flavours[0] || "",
            quantity: 1,
          };
          return (
            <View style={styles.foodItem}>
              {/* Show image if available (uploaded or static or fallback) */}
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
              ) : item.image ? (
                <Image
                  source={item.image}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
              ) : fallbackImage ? (
                <Image
                  source={fallbackImage}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
              ) : null}
              <View style={{
                flex: 1,
                marginLeft: 0, // Remove left margin
                marginRight: 0 // No right margin
              }}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPrice}>${item.price}</Text>
                {item.varieties && item.varieties.length > 0 && (
                  <View style={styles.pickerRow}>
                    <Text style={styles.labelNoGap}>Variety:</Text>
                    <Picker
                      selectedValue={sel.variety}
                      style={styles.inlinePicker}
                      onValueChange={(value) =>
                        setSelected((prev) => ({
                          ...prev,
                          [item.id]: { ...sel, variety: value },
                        }))
                      }
                    >
                      {item.varieties.map((v) => (
                        <Picker.Item key={v} label={v} value={v} />
                      ))}
                    </Picker>
                  </View>
                )}
                {item.flavours && item.flavours.length > 0 && (
                  <View style={styles.pickerRow}>
                    <Text style={styles.labelNoGap}>Flavour:</Text>
                    <Picker
                      selectedValue={sel.flavour}
                      style={styles.inlinePicker}
                      onValueChange={(value) =>
                        setSelected((prev) => ({
                          ...prev,
                          [item.id]: { ...sel, flavour: value },
                        }))
                      }
                    >
                      {item.flavours.map((f) => (
                        <Picker.Item key={f} label={f} value={f} />
                      ))}
                    </Picker>
                  </View>
                )}
                <View style={styles.row}>
                  <Text style={styles.label}>Qty:</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      setSelected((prev) => ({
                        ...prev,
                        [item.id]: {
                          ...sel,
                          quantity: Math.max(1, sel.quantity - 1),
                        },
                      }))
                    }
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{sel.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      setSelected((prev) => ({
                        ...prev,
                        [item.id]: {
                          ...sel,
                          quantity: sel.quantity + 1,
                        },
                      }))
                    }
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Admin: Show Edit button for all items */}
              {userDetail?.role === "admin" && (
                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: Colors.SECONDARY || "#888", marginLeft: 10, alignSelf: 'flex-start' }]}
                  onPress={() => router.push(`/edit-menu-item/${item.id}`)}
                >
                  <Text style={[styles.addBtnText, { color: Colors.WHITE }]}>Edit</Text>
                </TouchableOpacity>
              )}
              {/* Hide Add to Cart for admins */}
              {(!userDetail || userDetail.role !== "admin") && (
                <TouchableOpacity
                  style={[styles.addBtn, { marginLeft: 30, alignSelf: 'flex-start' }]}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text style={styles.addBtnText}>Add to Cart</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE, padding: 20 },
  title: { fontSize: 24, fontFamily: 'outfit-bold', color: Colors.PRIMARY, marginBottom: 0, textAlign: 'left' },
  foodItem: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderColor: Colors.BORDER, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginRight: 16, // Add right margin to push image left
  },
  foodName: { fontFamily: 'outfit', fontSize: 18 },
  foodPrice: { fontFamily: 'outfit-bold', color: Colors.PRIMARY },
  addBtn: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 10,
  },
  addBtnText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
    fontSize: 14,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  label: { fontFamily: 'outfit', fontSize: 14, marginRight: 6 },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
  },
  labelNoGap: {
    fontFamily: 'outfit',
    fontSize: 14,
    marginRight: 2, // Minimal gap between label and picker
  },
  inlinePicker: {
    height: 30,
    width: 120,
    marginLeft: 0, // No extra gap
    marginTop: 0,
    marginBottom: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignSelf: 'center',
  },
  qtyBtn: {
    backgroundColor: Colors.LIGHT_GRAY || "#eee",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 4,
  },
  qtyBtnText: { fontSize: 18, fontFamily: "outfit-bold" },
  qtyText: { fontFamily: "outfit", fontSize: 16, minWidth: 20, textAlign: "center" },
});