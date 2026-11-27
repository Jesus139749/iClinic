import type { PatientSignUp } from "../../../../services/authService";

export type PatientSignUpErrors = Partial<Record<keyof PatientSignUp, string>>;
