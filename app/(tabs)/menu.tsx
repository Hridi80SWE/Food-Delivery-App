import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import Colors from "@/constant/Colors";
import { useContext, useEffect, useState, useCallback } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { CartContext } from "../_layout";
import { Picker } from "@react-native-picker/picker";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useIsFocused } from "@react-navigation/native";

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

const ITEMS_PER_PAGE = 5;

export default function Menu() {
  const { addToCart } = useContext(CartContext);
  const { userDetail } = useContext(UserDetailContext);
  const isFocused = useIsFocused();
  const [foods, setFoods] = useState<Food[]>([]);
  const [selected, setSelected] = useState<{ [id: string]: { variety: string; flavour: string; quantity: number } }>({});
  const [page, setPage] = useState(1);

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
      setPage(1); // Reset to first page on data change
    };
    fetchFoods();
  }, [isFocused]);

  // Pagination logic
  const totalPages = Math.ceil(foods.length / ITEMS_PER_PAGE);
  const paginatedFoods = foods.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const goToNextPage = useCallback(() => {
    if (page < totalPages) setPage(page + 1);
  }, [page, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

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
        data={paginatedFoods}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const sel = selected[item.id] || {
            variety: item.varieties[0] || "",
            flavour: item.flavours[0] || "",
            quantity: 1,
          };
          return (
            <View style={styles.foodItem}>
              {/* Show image if available (uploaded or static) */}
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
              ) : null}
              <View style={{ flex: 1, marginLeft: (item.imageUrl || item.image) ? 16 : 0 }}>
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
      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageBtn, page === 1 && { opacity: 0.5 }]}
          onPress={goToPrevPage}
          disabled={page === 1}
        >
          <Text style={styles.pageBtnText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>{`Page ${page} of ${totalPages}`}</Text>
        <TouchableOpacity
          style={[styles.pageBtn, page === totalPages && { opacity: 0.5 }]}
          onPress={goToNextPage}
          disabled={page === totalPages}
        >
          <Text style={styles.pageBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  pageBtn: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  pageBtnText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
  pageInfo: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.PRIMARY,
  },
});
