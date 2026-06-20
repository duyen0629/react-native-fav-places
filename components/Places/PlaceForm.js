import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { Colors } from "../../constants/colors";

function PlaceForm() {
  const [enteredTitle, setEnteredTitle] = useState("");
  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }
  return (
    <ScrollView style={styles.form}>
      <View>
        <Text>Title</Text>
        <TextInput value={enteredTitle} onChangeText={changeTitleHandler} style={styles.input} />
      </View>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary700,
  },
  input: {
    narginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
