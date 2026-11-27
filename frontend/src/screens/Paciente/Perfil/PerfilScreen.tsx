import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Masks } from "react-native-mask-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/Button";
import { ChangePasswordForm } from "../../../components/ChangePasswordForm";
import { ErrorBox, Loading } from "../../../components/Feedback";
import { ProfileField } from "../../../components/ProfileField";
import { Section } from "../../../components/Section";
import { useLoad } from "../../../hooks/useLoad";
import { getRequestErrorMessage } from "../../../services/apiClient";
import {
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
  updateMyProfileImage,
  type PatientProfile,
} from "../../../services/profileService";
import { pickPhoto } from "../../../utils/pickImage";
import type { PatientProfileForm } from "./interfaces/PatientProfileForm";

export default function PerfilScreen() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PatientProfileForm>({ name: "", email: "", phone: "" });
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  function applyProfile(profile: PatientProfile) {
    setForm({ name: profile.name, email: profile.email, phone: profile.phone ?? "" });
    setPhoto(profile.image);
  }

  const { loading, error, reload } = useLoad(async () => applyProfile(await getMyProfile()));

  const set = (field: keyof PatientProfileForm) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  async function save() {
    setSaving(true);
    try {
      applyProfile(
        await updateMyProfile({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
        }),
      );
      setEditing(false);
      Alert.alert("Perfil atualizado", "Seus dados foram salvos com sucesso.");
    } catch (e) {
      Alert.alert("Não foi possível salvar o perfil", getRequestErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function changePhoto() {
    const newPhoto = await pickPhoto("Foto de perfil");
    if (!newPhoto) return;

    const previousPhoto = photo;
    setPhoto(newPhoto.uri); // mostra a nova foto enquanto envia
    setUploadingPhoto(true);
    try {
      setPhoto((await updateMyProfileImage(newPhoto)).image);
    } catch (e) {
      setPhoto(previousPhoto);
      Alert.alert("Não foi possível enviar a foto", getRequestErrorMessage(e));
    } finally {
      setUploadingPhoto(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? <Loading label="Carregando perfil..." /> : null}
        {error ? <ErrorBox message={error} onRetry={reload} /> : null}

        <View className="mb-5 mt-4 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4">
          <View>
            <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              {photo ? (
                <Image source={{ uri: photo }} className="h-20 w-20 rounded-full" resizeMode="cover" />
              ) : (
                <Ionicons name="person" size={38} color="#2F80ED" />
              )}
              {uploadingPhoto ? (
                <View className="absolute h-20 w-20 items-center justify-center rounded-full bg-black/40">
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              ) : null}
            </View>
            <Pressable
              accessibilityLabel="Adicionar ou trocar foto de perfil"
              disabled={uploadingPhoto}
              onPress={changePhoto}
              className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#2F80ED]"
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </Pressable>
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-slate-800">
              {form.name || "Perfil do paciente"}
            </Text>
            <Text className="mt-1 text-sm text-slate-500">{form.email}</Text>
            <Pressable
              disabled={uploadingPhoto}
              onPress={changePhoto}
              className="mt-2 flex-row items-center self-start"
            >
              <Ionicons name="camera-outline" size={16} color="#2563EB" />
              <Text className="ml-1 text-sm font-semibold text-blue-600">
                {uploadingPhoto ? "Enviando..." : photo ? "Trocar foto" : "Adicionar foto"}
              </Text>
            </Pressable>
          </View>
        </View>

        <Section title="Dados do cadastro">
          <ProfileField
            icon="person-outline"
            label="Nome completo"
            value={form.name}
            onChangeText={set("name")}
            editing={editing}
            placeholder="Ex: João da Silva"
            autoCapitalize="words"
          />
          <ProfileField
            icon="mail-outline"
            label="E-mail"
            value={form.email}
            onChangeText={set("email")}
            editing={editing}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <ProfileField
            icon="call-outline"
            label="Telefone"
            value={form.phone}
            onChangeText={set("phone")}
            editing={editing}
            mask={Masks.BRL_PHONE}
            placeholder="(DD) XXXX-XXXX"
            keyboardType="phone-pad"
            last
          />
        </Section>

        <Button
          label={editing ? "Salvar alterações" : "Editar perfil"}
          onPress={editing ? save : () => setEditing(true)}
          loading={saving}
          loadingLabel="Salvando..."
          disabled={loading || Boolean(error)}
          className="mb-4"
        />

        <Section title="Alterar senha">
          <Text className="mb-2 text-xs text-slate-500">
            Sua senha atual será verificada antes de salvar.
          </Text>
          <ChangePasswordForm onSubmit={changeMyPassword} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
