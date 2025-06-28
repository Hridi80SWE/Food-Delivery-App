import { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, ActivityIndicator } from "react-native";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import Colors from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Static foods for lookup
const STATIC_FOODS = [
  {
    id: "1",
    name: "Chicken Biryani",
    price: 250,
    varieties: ["Regular", "Spicy"],
    flavours: ["Hyderabadi", "Kolkata"],
    image: require('../../assets/images/chicken_biryani.jpg'),
  },
  {
    id: "2",
    name: "Bakarkhani",
    price: 60,
    varieties: ["Plain", "Butter"],
    flavours: [],
    image: require('../../assets/images/bakarkhani.jpg'),
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

export default function EditMenuItem() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [isStatic, setIsStatic] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [varieties, setVarieties] = useState("");
  const [flavours, setFlavours] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [staticImage, setStaticImage] = useState<any>(null);
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  useEffect(() => {
    if (!userDetail || userDetail.role !== "admin") {
      Alert.alert("Access Denied", "Only admins can edit menu items.");
      router.replace("/(tabs)/home");
      return;
    }
    const fetchItem = async () => {
      try {
        // Try Firestore first
        const docRef = doc(db, "foods", String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setPrice(data.price ? String(data.price) : "");
          setVarieties(data.varieties ? data.varieties.join(", ") : "");
          setFlavours(data.flavours ? data.flavours.join(", ") : "");
          setImageUrl(data.imageUrl || "");
          setIsStatic(false);
        } else {
          // Try static foods
          const staticItem = STATIC_FOODS.find(f => f.id === id);
          if (staticItem) {
            setName(staticItem.name);
            setPrice(String(staticItem.price));
            setVarieties(staticItem.varieties ? staticItem.varieties.join(", ") : "");
            setFlavours(staticItem.flavours ? staticItem.flavours.join(", ") : "");
            setStaticImage(staticItem.image);
            setIsStatic(true);
          } else {
            Alert.alert("Not found", "Menu item not found.");
            router.replace("/(tabs)/menu");
          }
        }
      } catch (e) {
        Alert.alert("Error", "Could not fetch menu item.");
        router.replace("/(tabs)/menu");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, userDetail]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.uri && (asset.uri.endsWith('.jpg') || asset.uri.endsWith('.jpeg') || asset.uri.endsWith('.png'))) {
        setImageUri(asset.uri);
        setStaticImage(null);
        setImageUrl("");
      } else {
        Alert.alert("Only PNG or JPG images are allowed.");
      }
    }
  };

  const uploadImageAsync = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const filename = `menu_images/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert("Name and price are required.");
      return;
    }
    setLoading(true);
    let uploadedImageUrl = imageUrl;

    // Helper to upload a local static image asset
    const uploadStaticImageAsync = async (staticImage: any) => {
      // Import Asset from expo-asset
      const { Asset } = await import("expo-asset");
      const asset = Asset.fromModule(staticImage);
      await asset.downloadAsync();
      const uri = asset.localUri || asset.uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const filename = `menu_images/static_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    };

    try {
      if (isStatic) {
        // If no new image picked, upload static image asset
        if (!imageUri && staticImage) {
          uploadedImageUrl = await uploadStaticImageAsync(staticImage);
        }
        // If new image picked, upload it
        if (imageUri) {
          uploadedImageUrl = await uploadImageAsync(imageUri);
        }
        if (!uploadedImageUrl) {
          Alert.alert("Please select an image for the new menu item.");
          setLoading(false);
          return;
        }
        await addDoc(collection(db, "foods"), {
          name,
          price: Number(price),
          varieties: varieties ? varieties.split(",").map(v => v.trim()) : [],
          flavours: flavours ? flavours.split(",").map(f => f.trim()) : [],
          imageUrl: uploadedImageUrl,
        });
        Alert.alert("Menu item added as new editable item!");
      } else {
        // If new image picked, upload it
        if (imageUri) {
          uploadedImageUrl = await uploadImageAsync(imageUri);
        }
        await updateDoc(doc(db, "foods", String(id)), {
          name,
          price: Number(price),
          varieties: varieties ? varieties.split(",").map(v => v.trim()) : [],
          flavours: flavours ? flavours.split(",").map(f => f.trim()) : [],
          imageUrl: uploadedImageUrl,
        });
        Alert.alert("Menu item updated!");
      }
      router.replace("/(tabs)/menu");
    } catch (e) {
      Alert.alert("Error", "Could not save menu item.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.WHITE }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isStatic ? "Edit (Save as New)" : "Edit Menu Item"}</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Varieties (comma separated)" value={varieties} onChangeText={setVarieties} />
      <TextInput style={styles.input} placeholder="Flavours (comma separated)" value={flavours} onChangeText={setFlavours} />
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Text style={styles.uploadBtnText}>{imageUri ? "Change Image" : (imageUrl || staticImage ? "Change Image" : "Upload Image (PNG/JPG)")}</Text>
      </TouchableOpacity>
      {(imageUri || imageUrl || staticImage) && (
        <Image
          source={imageUri ? { uri: imageUri } : imageUrl ? { uri: imageUrl } : staticImage}
          style={{ width: 120, height: 120, marginVertical: 10, borderRadius: 10 }}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Saving..." : isStatic ? "Save as New" : "Save Changes"}</Text>
      </TouchableOpacity>
      {isStatic && (
        <Text style={{ color: Colors.PRIMARY, marginTop: 10, fontFamily: "outfit" }}>
          Editing a static item will add it as a new editable menu item.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: Colors.WHITE },
  title: { fontSize: 24, fontFamily: "outfit-bold", color: Colors.PRIMARY, marginBottom: 24 },
  input: { borderWidth: 1, borderColor: Colors.BORDER, borderRadius: 8, padding: 12, marginBottom: 18, width: "100%", fontFamily: "outfit", fontSize: 16, backgroundColor: "#fafafa" },
  uploadBtn: { backgroundColor: Colors.SECONDARY || "#888", padding: 12, borderRadius: 8, marginBottom: 10, width: "100%", alignItems: "center" },
  uploadBtnText: { color: Colors.WHITE, fontFamily: "outfit-bold", fontSize: 16 },
  button: { backgroundColor: Colors.PRIMARY, padding: 16, borderRadius: 10, alignItems: "center", marginTop: 10, width: "100%" },
  buttonText: { color: Colors.WHITE, fontFamily: "outfit-bold", fontSize: 18, textAlign: "center" },
});
