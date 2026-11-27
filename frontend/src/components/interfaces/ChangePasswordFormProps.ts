import type { ChangePassword } from "../../services/profileService";

export interface ChangePasswordFormProps {
  onSubmit: (password: ChangePassword) => Promise<void>;
  onSuccess?: () => void;
}
