import type { NavigatorScreenParams } from "@react-navigation/native";

export type AgendamentoStackParamList = {
  DetalhesClinica: { clinicaId: number };
};

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  CadastroPaciente: undefined;
  CadastroClinica: undefined;
  DashboardPaciente: undefined;
  DashboardClinica: undefined;
  CadastroMedico: undefined;
  EditarMedico: undefined;
  Agendamento: NavigatorScreenParams<AgendamentoStackParamList>;
};

export type PacienteTabParamList = {
  Inicio: undefined;
  Consultas: undefined;
  Buscar: undefined;
  Perfil: undefined;
};
