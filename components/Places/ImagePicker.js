import { View, Image, Text, StyleSheet, Alert } from "react-native";
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from "expo-image-picker";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

function ImagePicker({ onImageTaken, imageUri }) {
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert("Insufficient Permissions!", "You need to grant camera permissions to use this app.");
      return false;
    }
    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    onImageTaken(image.assets[0].uri);
  }

  let imagePreview = (
    <View style={styles.imagePreview}>
      <Text style={styles.placeholderText}>Capture a sweet memory!</Text>
    </View>
  );
  if (imageUri) {
    imagePreview = <Image style={styles.imagePreview} source={{ uri: imageUri }} />;
  }
  return (
    <View>
      <View style={styles.previewContainer}>{imagePreview}</View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Photo
      </OutlinedButton>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  previewContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 2,
    borderColor: Colors.primary200,
    borderStyle: "dashed",
    borderRadius: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.gray500,
    fontWeight: "600",
  },
});
