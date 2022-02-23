import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import ImagePicker from 'expo-image-picker';

const downloadDocument = () => {
  const uri = "";
  let fileUri = FileSystem.documentDirectory + ".docx";
  FileSystem.downloadAsync(uri, fileUri)
    .then(({ uri }) => {
      this.saveFile(uri);
    })
    .catch((error) => {
      console.error(error);
    });

  saveFile = async (fileUri) => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
    }
  };
};

export default downloadDocument;
