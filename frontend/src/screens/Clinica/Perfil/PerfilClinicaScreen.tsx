import { Ionicons } from "@expo/vector-icons";
import { useNavigation, type NavigationProp, type ParamListBase } from "@react-navigation/native";
import { useEffect, useState } from "react";
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
import { clearAuthToken } from "../../../services/authTokenStorage";
import {
  changeMyClinicPassword,
  getMyClinicProfile,
  updateMyClinicImage,
  updateMyClinicProfile,
  type ClinicProfile,
} from "../../../services/clinicProfileService";
import { formatAddress, formatCnpj } from "../../../utils/format";
import { pickPhoto } from "../../../utils/pickImage";
import { lookupPostalCode } from "../../../utils/viaCep";
import type { ClinicProfileForm } from "./interfaces/ClinicProfileForm";

function toForm(profile: ClinicProfile): ClinicProfileForm {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? "",
    postalCode: profile.postalCode,
    street: profile.street,
    number: profile.number,
    complement: profile.complement ?? "",
    neighborhood: profile.neighborhood,
    city: profile.city,
    state: profile.state,
  };
}

function isFormValid(f: ClinicProfileForm): boolean {
  return Boolean(
    f.name.trim() &&
      f.email.trim() &&
      f.phone.length === 11 &&
      f.postalCode.length === 8 &&
      f.street.trim() &&
      f.number.trim() &&
      f.neighborhood.trim() &&
      f.city.trim() &&
      f.state.length === 2,
  );
}

export default function PerfilClinicaScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { data: profile, setData: setProfile, loading, error, reload } = useLoad(getMyClinicProfile);

  const [form, setForm] = useState<ClinicProfileForm | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lookingUpPostalCode, setLookingUpPostalCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Sempre que o perfil chega (ou é salvo), o formulário volta a refletir o servidor.
  useEffect(() => {
    if (!profile) return;
    setForm(toForm(profile));
    setPhoto(profile.image);
  }, [profile]);

  // Ao editar, um CEP novo preenche estado, cidade e bairro pelo ViaCEP.
  const postalCode = form?.postalCode ?? "";
  useEffect(() => {
    if (!editing || postalCode.length !== 8 || postalCode === profile?.postalCode) return;

    setLookingUpPostalCode(true);
    lookupPostalCode(postalCode)
      .then((address) => address && setForm((current) => current && { ...current, ...address }))
      .catch(() => undefined) // sem ViaCEP o usuário preenche manualmente
      .finally(() => setLookingUpPostalCode(false));
  }, [editing, postalCode, profile?.postalCode]);

  const set = (field: keyof ClinicProfileForm) => (value: string) =>
    setForm((current) => current && { ...current, [field]: value });

  async function save() {
    if (!form) return;
    if (!isFormValid(form)) {
      Alert.alert(
        "Dados incompletos",
        "Preencha nome, e-mail, telefone com DDD, CEP e todos os campos do endereço.",
      );
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyClinicProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone,
        postalCode: form.postalCode,
        street: form.street.trim(),
        number: form.number.trim(),
        complement: form.complement.trim() || null,
        neighborhood: form.neighborhood.trim(),
        city: form.city.trim(),
        state: form.state.toUpperCase(),
      });
      setProfile(updated);
      setEditing(false);
      Alert.alert("Perfil atualizado", "Os dados da clínica foram salvos.");
    } catch (e) {
      Alert.alert("Não foi possível salvar o perfil", getRequestErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    if (profile) setForm(toForm(profile));
    setEditing(false);
  }

  async function changePhoto() {
    const newPhoto = await pickPhoto("Foto da clínica");
    if (!newPhoto) return;

    const previousPhoto = photo;
    setPhoto(newPhoto.uri); // mostra a nova foto enquanto envia
    setUploadingPhoto(true);
    try {
      setPhoto((await updateMyClinicImage(newPhoto)).image);
    } catch (e) {
      setPhoto(previousPhoto);
      Alert.alert("Não foi possível enviar a foto", getRequestErrorMessage(e));
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function logout() {
    try {
      await clearAuthToken();
    } finally {
      // O navegador pai é o stack raiz; o atual é o das abas.
      (navigation.getParent() ?? navigation).reset({ index: 0, routes: [{ name: "Login" }] });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? <Loading label="Carregando perfil..." /> : null}
        {error ? <ErrorBox message={error} onRetry={reload} /> : null}

        <View className="mb-4 mt-4 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4">
          <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#2F80ED]">
            {photo ? (
              <Image source={{ uri: photo }} className="h-16 w-16" resizeMode="cover" />
            ) : (
              <Ionicons name="medkit" size={30} color="#FFFFFF" />
            )}
            {uploadingPhoto ? (
              <View className="absolute h-16 w-16 items-center justify-center bg-black/40">
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : null}
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-slate-800">{profile?.name || "Clínica"}</Text>
            {profile?.cnpj ? (
              <Text className="mt-1 text-xs text-slate-500">CNPJ: {formatCnpj(profile.cnpj)}</Text>
            ) : null}
          </View>
          <Pressable
            accessibilityLabel="Trocar foto da clínica"
            disabled={uploadingPhoto || !profile}
            onPress={changePhoto}
            className="h-9 w-9 items-center justify-center rounded-full bg-blue-50"
          >
            <Ionicons name="camera-outline" size={18} color="#2F80ED" />
          </Pressable>
        </View>

        {form ? (
          <Section title="Informações Gerais">
            {editing ? (
              <ProfileField
                icon="business-outline"
                label="Nome da clínica"
                value={form.name}
                onChangeText={set("name")}
                editing
                autoCapitalize="words"
              />
            ) : null}
            <ProfileField
              icon="call-outline"
              label="Telefone"
              value={form.phone}
              onChangeText={set("phone")}
              editing={editing}
              mask={Masks.BRL_PHONE}
              placeholder="(DD) XXXXX-XXXX"
              keyboardType="phone-pad"
            />
            <ProfileField
              icon="mail-outline"
              label="E-mail"
              value={form.email}
              onChangeText={set("email")}
              editing={editing}
              placeholder="contato@clinica.com.br"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {editing ? (
              <>
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <ProfileField
                      icon="location-outline"
                      label="CEP"
                      value={form.postalCode}
                      onChangeText={set("postalCode")}
                      editing
                      mask={Masks.ZIP_CODE}
                      placeholder="00000-000"
                      keyboardType="numeric"
                    />
                  </View>
                  {lookingUpPostalCode ? <ActivityIndicator color="#2F80ED" className="ml-2" /> : null}
                </View>
                <ProfileField label="Logradouro" value={form.street} onChangeText={set("street")} editing autoCapitalize="words" />
                <ProfileField label="Número" value={form.number} onChangeText={set("number")} editing />
                <ProfileField label="Complemento" value={form.complement} onChangeText={set("complement")} editing />
                <ProfileField label="Bairro" value={form.neighborhood} onChangeText={set("neighborhood")} editing autoCapitalize="words" />
                <ProfileField label="Cidade" value={form.city} onChangeText={set("city")} editing autoCapitalize="words" />
                <ProfileField
                  label="UF"
                  value={form.state}
                  onChangeText={(state) => set("state")(state.toUpperCase())}
                  editing
                  autoCapitalize="characters"
                  maxLength={2}
                  last
                />
              </>
            ) : (
              <ProfileField icon="navigate-outline" label="Endereço" value={formatAddress(form)} last />
            )}
          </Section>
        ) : null}

        <Button
          label={editing ? "Salvar alterações" : "Editar perfil"}
          onPress={editing ? save : () => setEditing(true)}
          loading={saving}
          loadingLabel="Salvando..."
          disabled={!form}
          className="mb-3"
        />
        {editing ? (
          <Button
            variant="outline"
            label="Cancelar"
            onPress={cancelEditing}
            disabled={saving}
            className="mb-4"
          />
        ) : null}

        <Section title="Segurança e Conta">
          <Pressable
            onPress={() => setShowPassword((visible) => !visible)}
            className="flex-row items-center py-3"
          >
            <Ionicons name="lock-closed" size={20} color="#2F80ED" />
            <Text className="ml-3 flex-1 text-sm font-medium text-slate-800">Alterar senha</Text>
            <Ionicons
              name={showPassword ? "chevron-down" : "chevron-forward"}
              size={18}
              color="#94A3B8"
            />
          </Pressable>
          {showPassword ? (
            <ChangePasswordForm
              onSubmit={changeMyClinicPassword}
              onSuccess={() => setShowPassword(false)}
            />
          ) : null}
        </Section>

        <Button variant="danger" label="Sair da conta" onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
}
