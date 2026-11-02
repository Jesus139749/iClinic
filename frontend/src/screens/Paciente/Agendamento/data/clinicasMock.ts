export type ClinicaStatus = "Aberta" | "Lotada" | "Fechada";

export interface ClinicaMedico {
  id: number;
  nome: string;
  especialidade: string;
}

export interface ClinicaPaciente {
  id: number;
  nome: string;
  imagemUrl: string;
  distanciaKm: number;
  especialidades: string[];
  endereco: string;
  nota: number;
  avaliacoes: number;
  status: ClinicaStatus;
  horariosDisponiveis: string[];
  horariosAdicionais: number;
  telefone: string;
  horarioFuncionamento: string[];
  medicos: ClinicaMedico[];
  diferenciais: string[];
}

export const clinicasMock: ClinicaPaciente[] = [
  {
    id: 1,
    nome: "Clínica CardioVida",
    imagemUrl:
      "https://placehold.co/900x440/e2e8f0/475569?text=Cl%C3%ADnica+CardioVida",
    distanciaKm: 2.3,
    especialidades: ["Cardiologia", "Clínica Geral"],
    endereco: "R. Augusta, 1200",
    nota: 4.8,
    avaliacoes: 127,
    status: "Aberta",
    horariosDisponiveis: ["Hoje 14:00", "Hoje 15:30"],
    horariosAdicionais: 3,
    telefone: "(11) 3456-7890",
    horarioFuncionamento: [
      "Segunda a sexta, das 08:00 às 20:00",
      "Sábado, das 08:00 às 14:00",
    ],
    medicos: [
      { id: 1, nome: "Dra. Ana Oliveira", especialidade: "Cardiologia" },
      { id: 2, nome: "Dr. Rafael Costa", especialidade: "Clínica Geral" },
    ],
    diferenciais: [
      "Atendimento humanizado",
      "Acessibilidade para cadeirantes",
      "Estacionamento no local",
    ],
  },
  {
    id: 2,
    nome: "Centro Médico São Lucas",
    imagemUrl:
      "https://placehold.co/900x440/dbeafe/1e40af?text=Centro+M%C3%A9dico+S%C3%A3o+Lucas",
    distanciaKm: 4.1,
    especialidades: ["Cardiologia", "Endocrinologia"],
    endereco: "Av. Paulista, 900",
    nota: 4.6,
    avaliacoes: 89,
    status: "Aberta",
    horariosDisponiveis: ["Amanhã 09:00", "Amanhã 10:30"],
    horariosAdicionais: 5,
    telefone: "(11) 3123-4567",
    horarioFuncionamento: [
      "Segunda a sexta, das 07:00 às 19:00",
      "Sábado, das 08:00 às 12:00",
    ],
    medicos: [
      { id: 3, nome: "Dra. Camila Nunes", especialidade: "Cardiologia" },
      { id: 4, nome: "Dr. Pedro Almeida", especialidade: "Endocrinologia" },
    ],
    diferenciais: [
      "Próximo ao metrô",
      "Exames no mesmo local",
      "Atendimento acessível",
    ],
  },
  {
    id: 3,
    nome: "Hospital do Coração",
    imagemUrl:
      "https://placehold.co/900x440/f1f5f9/475569?text=Hospital+do+Cora%C3%A7%C3%A3o",
    distanciaKm: 5.7,
    especialidades: ["Cardiologia", "Cirurgia Cardíaca"],
    endereco: "R. Consolação, 340",
    nota: 4.9,
    avaliacoes: 214,
    status: "Lotada",
    horariosDisponiveis: ["Qua 08:00", "Qua 11:00"],
    horariosAdicionais: 0,
    telefone: "(11) 3344-5566",
    horarioFuncionamento: [
      "Segunda a sexta, das 08:00 às 18:00",
      "Sábado e domingo, atendimento de urgência",
    ],
    medicos: [
      { id: 5, nome: "Dr. Bruno Martins", especialidade: "Cardiologia" },
      {
        id: 6,
        nome: "Dra. Laura Ferreira",
        especialidade: "Cirurgia Cardíaca",
      },
    ],
    diferenciais: [
      "Equipe multidisciplinar",
      "Centro de diagnóstico",
      "Atendimento de urgência",
    ],
  },
  {
    id: 4,
    nome: "Clínica Bem Estar",
    imagemUrl:
      "https://placehold.co/900x440/ecfdf5/047857?text=Cl%C3%ADnica+Bem+Estar",
    distanciaKm: 8.2,
    especialidades: ["Cardiologia", "Pneumologia"],
    endereco: "R. Bela Cintra, 780",
    nota: 4.5,
    avaliacoes: 56,
    status: "Fechada",
    horariosDisponiveis: ["Qui 09:00", "Qui 14:00"],
    horariosAdicionais: 2,
    telefone: "(11) 3789-0123",
    horarioFuncionamento: [
      "Segunda a sexta, das 08:00 às 18:00",
      "Sábado, das 08:00 às 12:00",
    ],
    medicos: [
      { id: 7, nome: "Dra. Beatriz Lima", especialidade: "Cardiologia" },
      { id: 8, nome: "Dr. Felipe Rocha", especialidade: "Pneumologia" },
    ],
    diferenciais: [
      "Ambiente acolhedor",
      "Atendimento com hora marcada",
      "Acessibilidade para cadeirantes",
    ],
  },
];
