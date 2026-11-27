import { useState } from "react";
import { Alert } from "react-native";
import { getRequestErrorMessage } from "../services/apiClient";
import type { ChangePassword } from "../services/profileService";
import { Button } from "./Button";
import type { ChangePasswordFormProps } from "./interfaces/ChangePasswordFormProps";
import { ProfileField } from "./ProfileField";

const EMPTY_PASSWORD: ChangePassword = { currentPassword: "", newPassword: "", confirmPassword: "" };

/** Formulário de troca de senha usado pelos perfis de paciente e clínica. */
export function ChangePasswordForm({ onSubmit, onSuccess }: ChangePasswordFormProps) {
  const [password, setPassword] = useState(EMPTY_PASSWORD);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof ChangePassword) => (value: string) =>
    setPassword((current) => ({ ...current, [field]: value }));

  async function save() {
    if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
      Alert.alert("Campos obrigatórios", "Preencha os três campos de senha.");
      return;
    }
    if (password.newPassword !== password.confirmPassword) {
      Alert.alert("Senhas diferentes", "A nova senha e a confirmação não coincidem.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(password);
      setPassword(EMPTY_PASSWORD);
      onSuccess?.();
      Alert.alert("Senha atualizada", "Sua senha foi alterada com sucesso.");
    } catch (error) {
      Alert.alert("Não foi possível alterar a senha", getRequestErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ProfileField
        icon="lock-closed-outline"
        label="Senha atual"
        value={password.currentPassword}
        onChangeText={set("currentPassword")}
        placeholder="Digite sua senha atual"
        editing
        secureTextEntry
        autoCapitalize="none"
      />
      <ProfileField
        icon="key-outline"
        label="Nova senha"
        value={password.newPassword}
        onChangeText={set("newPassword")}
        placeholder="Digite a nova senha"
        editing
        secureTextEntry
        autoCapitalize="none"
      />
      <ProfileField
        icon="checkmark-circle-outline"
        label="Confirmar nova senha"
        value={password.confirmPassword}
        onChangeText={set("confirmPassword")}
        placeholder="Repita a nova senha"
        editing
        secureTextEntry
        autoCapitalize="none"
        last
      />
      <Button
        variant="secondary"
        label="Salvar nova senha"
        loading={saving}
        loadingLabel="Alterando..."
        onPress={save}
        className="mb-2 mt-3"
      />
    </>
  );
}
