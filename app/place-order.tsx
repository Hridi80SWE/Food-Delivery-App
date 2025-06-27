import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import Colors from "@/constant/Colors";
import { CartContext } from "./_layout";
import { useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function PlaceOrder() {
  const { cart, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (!address || !number) {
      Alert.alert("Please fill all required fields.");
      return;
    }
    setLoading(true);

    // Prepare order details for PDF
    const orderHtml = `
      <h2>Order Confirmation</h2>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Contact Number:</strong> ${number}</p>
      <p><strong>Note:</strong> ${note}</p>
      <h3>Items:</h3>
      <ul>
        ${cart.map(item => `<li>${item.name} (${item.variety || ""} ${item.flavour || ""}) x${item.quantity} - $${item.price}</li>`).join("")}
      </ul>
      <p><strong>Total:</strong> $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: orderHtml });
      if (Platform.OS !== "web" && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, { mimeType: "application/pdf" });
      }
    } catch (e) {
      Alert.alert("PDF Error", "Could not generate PDF.");
    }

    setTimeout(() => {
      setLoading(false);
      clearCart();
      Alert.alert("Order Placed!", "Your order has been placed successfully.", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/home"),
        },
      ]);
    }, 800);
  };

  return (
    <View style={styles.container}>
      {/* Spacer to move form down */}
      <View style={{ height: 60 }} />
      <Text style={styles.title}>Order Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Delivery Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={number}
        onChangeText={setNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Additional Note (optional)"
        value={note}
        onChangeText={setNote}
        multiline
      />
      <TouchableOpacity
        style={styles.orderBtn}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        <Text style={styles.orderBtnText}>{loading ? "Placing Order..." : "Place Order"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE, padding: 24, justifyContent: "flex-start" },
  title: { fontSize: 24, fontFamily: "outfit-bold", color: Colors.PRIMARY, marginBottom: 24, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    fontFamily: "outfit",
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  orderBtn: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  orderBtnText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 18,
  },
});
