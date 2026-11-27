import type { NavigatorScreenParams } from "@react-navigation/native";

export type AppointmentStackParamList = {
  DetalhesClinica: { clinicId: number };
};

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  CadastroPaciente: undefined;
  CadastroClinica: undefined;
  DashboardPaciente: undefined;
  DashboardClinica: undefined;
  CadastroMedico: undefined;
  EditarMedico: { doctorId: number };
  Agendamento: NavigatorScreenParams<AppointmentStackParamList>;
};

export type PatientTabParamList = {
  Inicio: undefined;
  Consultas: undefined;
  Buscar: undefined;
  Perfil: undefined;
};
