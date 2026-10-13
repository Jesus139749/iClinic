# iClinic

Aplicativo mobile desenvolvido em React Native com Expo para conectar pacientes e clínicas em um fluxo completo de agendamento e gestão de consultas médicas.

## Visão geral

O iClinic foi pensado para atender duas frentes principais:

### Paciente
- Buscar clínicas próximas
- Visualizar informações e detalhes da clínica
- Agendar consultas médicas
- Editar perfil do paciente
- Acompanhar o processo de consulta

### Clínica
- Gerenciar médicos cadastrados
- Controlar horários disponíveis
- Visualizar agendamentos recebidos de pacientes
- Editar perfil da clínica
- Organizar a agenda e disponibilidade do espaço

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- React Navigation
- NativeWind
- Expo Vector Icons

## Link do Figma

[iClinic – Figma](https://www.figma.com/design/BV24ItNLn5pegvgoUrf5uH/iClinic?node-id=0-1&p=f&t=uNYyKXjPqOmybFpL-0)

## Diagrama de casos de uso

[Visualizar diagrama de casos de uso](src/docs/iClinic_Casos_De_Uso.pdf)

## Desenvolvedores

- José Alysson Matheus Lima de Oliveira
- Jesús Miguel Almenares

## Requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- Node.js LTS
- npm ou yarn
- Expo CLI
- Android Studio + emulador Android, ou iOS Simulator (apenas macOS)
- Dispositivo físico com Expo Go, se preferir testar no celular

## Como rodar o projeto

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd iclinic
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o projeto com Expo:

```bash
npm start
```

4. Escolha uma opção de execução:

- Android:

```bash
npm run android
```

- iOS:

```bash
npm run ios
```

- Web:

```bash
npm run web
```

5. Caso esteja usando um emulador ou celular conectado, o Expo abrirá a aplicação automaticamente.

## Estrutura principal do projeto

```text
.
├── src/
│   ├── components/
│   ├── routes/
│   ├── screens/
│   └── utils/
├── App.tsx
├── app.json
├── babel.config.js
├── index.ts
├── package.json
├── tsconfig.json
├── metro.config.js
├── tailwind.config.js
├── global.css
└── README.md
```

## Observações

Este projeto está em fase de desenvolvimento e tem foco em demonstrar o fluxo principal de uso para pacientes e clínicas, com navegação entre telas, cadastro, perfil e agenda.

## Licença

Este projeto está sob a licença do repositório e pode ser utilizado para fins acadêmicos e de desenvolvimento.
