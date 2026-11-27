import type { ClinicSignUp } from "../../../../services/authService";

export type ClinicSignUpErrors = Partial<Record<keyof ClinicSignUp, string>>;
