import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import type { DoctorAvatarProps } from "./interfaces/DoctorAvatarProps";

/** Iniciais do primeiro e do último nome, ignorando "Dr."/"Dra.". */
function getInitials(name: string): string {
  const parts = name.replace(/^(dr|dra)\.?\s+/i, "").split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function DoctorAvatar({ uri, name, size = 56 }: DoctorAvatarProps) {
  const initials = getInitials(name);

  return (
    <View
      className="items-center justify-center overflow-hidden rounded-full bg-blue-50"
      style={{ width: size, height: size }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} />
      ) : initials ? (
        <Text className="font-bold text-[#2F80ED]" style={{ fontSize: size / 3 }}>
          {initials}
        </Text>
      ) : (
        <Ionicons name="person" size={size / 2} color="#2F80ED" />
      )}
    </View>
  );
}
