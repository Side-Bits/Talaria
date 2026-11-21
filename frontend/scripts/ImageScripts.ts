import * as ImageManipulator from "expo-image-manipulator";

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

    return result.base64 ?? "";
}