import { View, Image, Text, StyleSheet, Alert, ScrollView, Pressable } from "react-native";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";
import { MAX_PLACE_PHOTOS, parseImageUris } from "../../util/images";

function ImagePicker({ onImagesChange, imageUris }) {
  const images = parseImageUris(imageUris);
  const [cameraPermissionInformation, requestCameraPermission] = useCameraPermissions();
  const [mediaPermissionInformation, requestMediaPermission] = useMediaLibraryPermissions();

  async function verifyCameraPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestCameraPermission();
      return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert("Insufficient Permissions!", "You need to grant camera permissions to use this app.");
      return false;
    }
    return true;
  }

  async function verifyMediaPermissions() {
    if (mediaPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestMediaPermission();
      return permissionResponse.granted;
    }
    if (mediaPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert("Insufficient Permissions!", "You need to grant photo library permissions to use this app.");
      return false;
    }
    return true;
  }

  function remainingSlots() {
    return Math.max(0, MAX_PLACE_PHOTOS - images.length);
  }

  function appendImages(uris) {
    const next = parseImageUris([...images, ...uris]).slice(0, MAX_PLACE_PHOTOS);
    onImagesChange(next);
  }

  async function takeImageHandler() {
    if (remainingSlots() === 0) {
      Alert.alert("Photo limit reached", `You can add up to ${MAX_PLACE_PHOTOS} photos per place.`);
      return;
    }

    const hasPermission = await verifyCameraPermissions();
    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (image.canceled || !image.assets?.length) {
      return;
    }

    appendImages([image.assets[0].uri]);
  }

  async function pickImagesHandler() {
    const slots = remainingSlots();
    if (slots === 0) {
      Alert.alert("Photo limit reached", `You can add up to ${MAX_PLACE_PHOTOS} photos per place.`);
      return;
    }

    const hasPermission = await verifyMediaPermissions();
    if (!hasPermission) {
      return;
    }

    const result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: slots,
      quality: 0.5,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    appendImages(result.assets.map((asset) => asset.uri));
  }

  function removeImageHandler(uriToRemove) {
    onImagesChange(images.filter((uri) => uri !== uriToRemove));
  }

  return (
    <View>
      {images.length === 0 ? (
        <View style={[styles.imagePreview, styles.placeholderPreview]}>
          <Text style={styles.placeholderText}>Capture or upload sweet memories!</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
          {images.map((uri) => (
            <View key={uri} style={styles.thumbnailWrap}>
              <Image source={{ uri }} style={styles.thumbnail} />
              <Pressable
                style={styles.removeButton}
                onPress={() => removeImageHandler(uri)}
                hitSlop={8}
                accessibilityLabel="Remove photo"
              >
                <Ionicons name="close" size={14} color={Colors.textLight} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
      <Text style={styles.countText}>
        {images.length}/{MAX_PLACE_PHOTOS} photos
      </Text>
      <View style={styles.actions}>
        <OutlinedButton icon="camera" onPress={takeImageHandler} style={styles.actionButton}>
          Take Photo
        </OutlinedButton>
        <OutlinedButton icon="images" onPress={pickImagesHandler} style={styles.actionButton}>
          Upload
        </OutlinedButton>
      </View>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 2,
    borderColor: Colors.primary200,
    borderStyle: "dashed",
    borderRadius: 20,
    marginBottom: 10,
  },
  placeholderPreview: {
    height: 90,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.gray500,
    fontWeight: "600",
  },
  gallery: {
    gap: 10,
    paddingVertical: 2,
    marginBottom: 8,
  },
  thumbnailWrap: {
    width: 120,
    height: 120,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.primary200,
    backgroundColor: Colors.surfaceSoft,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary500,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.gray500,
    marginBottom: 6,
    marginLeft: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flex: 1,
  },
});
