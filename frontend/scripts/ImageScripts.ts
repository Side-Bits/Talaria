import * as ImageManipulator from "expo-image-manipulator";
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';

export function getImageBase64(base64: string): string {
  return "data:image/jpeg;base64," + base64;
}

export async function setImageBase64 (uri: string, width: number): Promise<string> {
    const result = await ImageManipulator.manipulateAsync(
        uri,
        [
            {
                resize: {
                    width: width * 2
                }
            }
        ],
        {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
        }
    );

    if (!result.base64) {
        throw new Error('Image processing did not return base64 data.');
    }

    return result.base64;
}

export async function openImage(): Promise<DocumentPicker.DocumentPickerAsset | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['image/jpeg', 'image/png', 'image/webp'],
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0] ?? null;
}

export function isImageAsset(asset: DocumentPicker.DocumentPickerAsset): boolean {
  const mimeType = asset.mimeType?.trim().toLowerCase();
  
  if (mimeType) {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType);
  }

  return /\.(jpe?g|png|webp)$/i.test(asset.name);
}

export function useImagePicker() {
  const [image, setImage] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const selectImage = async (): Promise<DocumentPicker.DocumentPickerAsset | null> => {
    const asset = await openImage();
    if (asset && isImageAsset(asset)) {
      setImage(asset);
    }

    return asset;
  };

  return { image, selectImage };
}