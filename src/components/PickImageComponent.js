import { launchImageLibrary } from "react-native-image-picker";

const PickImageComponent = async () => {
  const options = {
    mediaType: "photo",
    quality: 4,
    maxWidth: 500,
    maxHeight: 500,
    selectionLimit: 1,
    includeBase64: true,
  };

  try {
    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log("User cancelled image picker");
      return null;
    } else if (result.errorCode) {
      console.log("ImagePicker Error: ", result.errorMessage);
      return null;
    } else if (result.assets && result.assets.length > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const selectedImage = result.assets.find(
        (img) => allowedTypes.includes(img.type)
      );
      return selectedImage || null;
    }
  } catch (error) {
    console.log("Error picking image:", error);
    return null;
  }
}

export default PickImageComponent