import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Colors from "@/constant/Colors";
import { useContext } from "react";
import { CartContext } from "../_layout";
import { useRouter } from "expo-router";

export default function Cart() {
  const { cart, clearCart } = useContext(CartContext);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Add spacer to move items down */}
      <View style={{ height: 40 }} />
      <Text style={styles.title}>Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.text}>Your cart is empty!</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, idx) => item.id + idx}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.detail}>
                    {item.variety ? `Variety: ${item.variety}` : ""}
                    {item.flavour ? ` | Flavour: ${item.flavour}` : ""}
                  </Text>
                  <Text style={styles.detail}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.foodPrice}>${item.price * item.quantity}</Text>
              </View>
            )}
          />
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>${total}</Text>
          </View>
          <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
            <Text style={styles.clearBtnText}>Clear Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.placeOrderBtn}
            onPress={() => router.push("/place-order")}
            disabled={cart.length === 0}
          >
            <Text style={styles.placeOrderBtnText}>Place Order</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE, padding: 20 },
  title: { fontSize: 24, fontFamily: 'outfit-bold', color: Colors.PRIMARY, marginBottom: 20, textAlign: "center" },
  text: { fontFamily: 'outfit', fontSize: 16, textAlign: "center" },
  cartItem: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: Colors.BORDER, paddingVertical: 12 },
  foodName: { fontFamily: 'outfit-bold', fontSize: 16 },
  detail: { fontFamily: 'outfit', fontSize: 14, color: Colors.PRIMARY },
  foodPrice: { fontFamily: 'outfit-bold', color: Colors.PRIMARY, fontSize: 16 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  totalText: { fontFamily: "outfit-bold", fontSize: 18, color: Colors.PRIMARY },
  clearBtn: { marginTop: 20, backgroundColor: Colors.PRIMARY, padding: 12, borderRadius: 8 },
  clearBtnText: { color: Colors.WHITE, fontFamily: "outfit-bold", textAlign: "center" },
  placeOrderBtn: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    opacity: 1,
  },
  placeOrderBtnText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 18,
  },
});
