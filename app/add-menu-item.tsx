import { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { db } from "@/config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Colors from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddMenuItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [varieties, setVarieties] = useState("");
  const [flavours, setFlavours] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  useEffect(() => {
    if (!userDetail || userDetail.role !== "admin") {
      Alert.alert("Access Denied", "Only admins can add menu items.");
      router.replace("/(tabs)/home");
    }
  }, [userDetail]);

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

  const handleAdd = async () => {
    if (!name || !price) {
      Alert.alert("Name and price are required.");
      return;
    }
    if (!imageUri) {
      Alert.alert("Please select an image.");
      return;
    }
    let uploadedImageUrl = "";
    if (imageUri) {
      try {
        uploadedImageUrl = await uploadImageAsync(imageUri);
      } catch (e) {
        Alert.alert("Image upload failed.");
        return;
      }
    }
    try {
      await addDoc(collection(db, "foods"), {
        name,
        price: Number(price),
        varieties: varieties ? varieties.split(",").map(v => v.trim()) : [],
        flavours: flavours ? flavours.split(",").map(f => f.trim()) : [],
        imageUrl: uploadedImageUrl,
      });
      Alert.alert("Menu item added!");
      setName(""); setPrice(""); setVarieties(""); setFlavours(""); setImageUri(null);
      // Navigate to menu page after adding
      router.replace("/(tabs)/menu");
    } catch (e) {
      Alert.alert("Error", "Could not add menu item.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Menu Item</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Varieties (comma separated)" value={varieties} onChangeText={setVarieties} />
      <TextInput style={styles.input} placeholder="Flavours (comma separated)" value={flavours} onChangeText={setFlavours} />
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Text style={styles.uploadBtnText}>{imageUri ? "Change Image" : "Upload Image (PNG/JPG)"}</Text>
      </TouchableOpacity>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 120, height: 120, marginVertical: 10, borderRadius: 10 }} />
      )}
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
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
