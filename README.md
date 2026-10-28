# iClinic

Aplicativo mobile desenvolvido em React Native com Expo, acompanhado de uma API em NestJS, para conectar pacientes e clínicas em um fluxo completo de agendamento e gestão de consultas médicas.

## Visão geral

O iClinic foi pensado para atender duas frentes principais:

### Paciente
- Buscar clínicas próximas
- Visualizar informações e detalhes da clínica
- Agendar consultas médicas
- Editar perfil do paciente (dados, foto via câmera/galeria e senha)
- Acompanhar o processo de consulta

### Clínica
- Gerenciar médicos cadastrados
- Controlar horários disponíveis
- Visualizar agendamentos recebidos de pacientes
- Editar perfil da clínica
- Organizar a agenda e disponibilidade do espaço

## Estrutura do repositório

```text
.
├── backend/    # API REST em NestJS + Prisma + PostgreSQL
├── frontend/   # Aplicativo React Native (Expo)
└── docs/       # Casos de uso e diagrama de classes
```

## Tecnologias utilizadas

### Frontend
- React Native + Expo
- TypeScript
- React Navigation (native stack e bottom tabs)
- NativeWind (Tailwind CSS)
- Expo Image Picker, Expo Secure Store e Expo File System
- React Native Mask Input
- Expo Vector Icons

### Backend
- NestJS 11 + TypeScript
- Prisma 7 (PostgreSQL)
- Autenticação JWT (`@nestjs/jwt`) com controle de papéis (`PACIENTE` / `CLINICA`)
- bcrypt (`bcryptjs`) para hash de senhas
- class-validator / class-transformer para validação
- Swagger para documentação da API
- Jest + Supertest para testes

## Requisitos

- Node.js LTS e npm
- PostgreSQL em execução
- Android Studio + emulador Android, ou iOS Simulator (apenas macOS)
- Dispositivo físico com Expo Go, se preferir testar no celular

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd iClinic
```

### 2. Backend

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/iclinic"
JWT_SECRET="<segredo-seguro>"   # gere com: openssl rand -base64 32
# Opcionais
PORT=3000
FRONTEND_ORIGIN="http://localhost:8081"
```

Gere o client do Prisma, aplique as migrations e inicie a API:

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts

npm run start:dev
```

A API fica disponível em `http://localhost:3000` e a documentação Swagger em [http://localhost:3000/swagger](http://localhost:3000/swagger) (definição JSON em `/swagger-json`).

### 3. Frontend

```bash
cd frontend
npm install
```

Crie o arquivo `frontend/.env` apontando para a API:

```env
EXPO_PUBLIC_API_URL="http://localhost:3000"
```

- No emulador Android, use `http://10.0.2.2:3000`.
- Em dispositivo físico, use o IP do computador na rede local (ex.: `http://192.168.1.20:3000`).
- Reinicie o Expo após alterar a variável.

Inicie o app:

```bash
npm start          # menu do Expo
npm run android    # emulador/dispositivo Android
npm run ios        # simulador iOS
npm run web        # navegador
```

## API (backend)

| Método | Rota                | Acesso            | Descrição                               |
| ------ | ------------------- | ----------------- | --------------------------------------- |
| POST   | `/login`            | Público           | Autentica e retorna `token` e `role`    |
| POST   | `/clinica`          | Público           | Cadastra uma clínica e seu endereço     |
| POST   | `/paciente`         | Público           | Cadastra um paciente                    |
| GET    | `/paciente/me`      | JWT (`PACIENTE`)  | Retorna o perfil do paciente logado     |
| PATCH  | `/paciente/me`      | JWT (`PACIENTE`)  | Atualiza dados do perfil                |
| PUT    | `/paciente/me/image`| JWT (`PACIENTE`)  | Envia/atualiza a foto de perfil         |
| PUT    | `/paciente/me/password` | JWT (`PACIENTE`) | Altera a senha                       |
| GET    | `/clinica/me`       | JWT (`CLINICA`)   | Retorna o perfil da clínica logada      |
| PATCH  | `/clinica/me`       | JWT (`CLINICA`)   | Atualiza dados e endereço da clínica    |
| PUT    | `/clinica/me/image` | JWT (`CLINICA`)   | Envia/atualiza a foto da clínica        |
| PUT    | `/clinica/me/password` | JWT (`CLINICA`) | Altera a senha                        |
| GET    | `/clinica/medicos`  | JWT (`CLINICA`)   | Lista os médicos da clínica             |
| GET    | `/clinica/medicos/:id` | JWT (`CLINICA`) | Retorna um médico da clínica           |
| POST   | `/clinica/medicos`  | JWT (`CLINICA`)   | Cadastra um médico                      |
| PATCH  | `/clinica/medicos/:id` | JWT (`CLINICA`) | Atualiza, desativa ou reativa um médico |
| PUT    | `/clinica/medicos/:id/image` | JWT (`CLINICA`) | Envia/atualiza a foto do médico |
| GET    | `/clinica/especialidades` | JWT (`CLINICA`) | Lista as especialidades com a contagem de médicos |
| POST   | `/clinica/especialidades` | JWT (`CLINICA`) | Cadastra uma especialidade        |
| DELETE | `/clinica/especialidades/:id` | JWT (`CLINICA`) | Remove uma especialidade sem médicos |

### Autenticação

`POST /login` retorna um JWT assinado em `token` e o `role` do usuário (`PACIENTE` ou `CLINICA`). O token contém o ID do usuário em `sub` e expira em uma hora. Nas rotas protegidas, envie-o no cabeçalho `Authorization: Bearer <token>`. No app, o token é guardado com `expo-secure-store`.

### Cadastro de clínica

`POST /clinica` cria o usuário da clínica e seu endereço. CNPJ, telefone e CEP devem ser enviados apenas com dígitos:

```json
{
  "name": "Clínica São Lucas",
  "cnpj": "12345678000195",
  "email": "contato@clinica.com.br",
  "phone": "11987654321",
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Sala 4",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "postalCode": "01001000",
  "password": "SenhaSegura123",
  "confirmPassword": "SenhaSegura123"
}
```

Responde `201 Created`, `400 Bad Request` para dados inválidos e `409 Conflict` se o e-mail ou CNPJ já estiver cadastrado. As senhas são armazenadas como hash bcrypt e nunca retornam na resposta; hashes scrypt antigos são migrados para bcrypt após um login bem-sucedido.

### Cadastro de paciente

`POST /paciente` cria uma conta de paciente. O telefone deve ter 11 dígitos e a senha entre 8 caracteres e 72 bytes UTF-8:

```json
{
  "name": "João da Silva",
  "email": "joao@example.com",
  "phone": "11987654321",
  "password": "SenhaSegura123",
  "confirmPassword": "SenhaSegura123"
}
```

Responde `201 Created` com `id`, `name`, `email`, `phone`, `type` e `createdAt`. Dados inválidos ou senhas divergentes retornam `400 Bad Request`, e e-mail já cadastrado retorna `409 Conflict`.

Para testar pelo Swagger: abra `/swagger`, expanda **Paciente → POST /paciente**, clique em **Try it out**, informe o JSON acima e **Execute**.

### Gerenciamento de médicos

Todas as rotas exigem JWT com `role` `CLINICA` e só enxergam dados da própria clínica (um médico de outra clínica retorna `404`). Primeiro cadastre as especialidades da clínica com `POST /clinica/especialidades` (`{ "name": "Dermatologia" }`); depois cadastre o médico com `POST /clinica/medicos`:

```json
{
  "name": "Dra. Camila Ferreira",
  "crm": "123456SP",
  "phone": "11987654321",
  "specialtyIds": [1, 2]
}
```

`phone` é opcional (11 dígitos) e `specialtyIds` exige ao menos uma especialidade da própria clínica. A resposta traz `id`, `name`, `crm`, `phone`, `image` (data URI ou `null`), `active` e `specialties`. `PATCH /clinica/medicos/:id` aceita os mesmos campos (todos opcionais) mais `active`: `false` desativa o médico e `true` o reativa. A foto é enviada em `PUT /clinica/medicos/:id/image` (multipart, campo `image`, JPEG/PNG/WebP, máx. 5 MB).

Respostas: `400` para dados inválidos ou especialidade de outra clínica, `404` para clínica/médico/especialidade inexistente e `409` para CRM ou especialidade duplicados. `DELETE /clinica/especialidades/:id` responde `204`, ou `409` se algum médico ainda usa a especialidade.

## Modelo de dados

Definido em `backend/prisma/schema.prisma`:

- **User**: `name`, `email` (único), `passwordHash`, `phone`, `image` (bytes), `type` (`PACIENTE` | `CLINICA`)
- **Clinic**: vinculada a um `User`; `cnpj` (único) e endereço completo
- **Doctor**: vinculado a uma `Clinic`; `name`, `crm` (único), `phone`, `image` (bytes), `active`, e N:N com `Specialty`
- **Specialty**: catálogo de especialidades de uma `Clinic`; `name` (único por clínica)

## Estrutura dos projetos

```text
backend/
├── prisma/            # schema, migrations e PrismaService
├── src/
│   ├── auth/          # login, JWT, guards e decorator de roles
│   ├── clinica/       # cadastro de clínicas
│   ├── medico/        # médicos e especialidades da clínica
│   ├── paciente/      # cadastro e perfil de pacientes
│   └── main.ts
└── test/              # testes e2e

frontend/
├── src/
│   ├── components/    # componentes compartilhados
│   ├── routes/        # navegação
│   ├── screens/       # Home, Login, Paciente/*, Clinica/*
│   ├── services/      # chamadas à API e armazenamento do token
│   └── utils/
├── App.tsx
├── app.json
└── tailwind.config.js
```

## Testes (backend)

```bash
cd backend
npm run test       # unitários
npm run test:e2e   # e2e
npm run test:cov   # cobertura
```

## Documentação e design

- [iClinic – Figma](https://www.figma.com/design/BV24ItNLn5pegvgoUrf5uH/iClinic?node-id=0-1&p=f&t=uNYyKXjPqOmybFpL-0)
- [Diagrama de casos de uso (v1)](docs/iClinic_Casos_De_Uso.pdf) · [(v2)](docs/iClinic_Casos_De_Uso_v2.pdf)
- [Diagrama de classes](docs/iClinic_Diagrama_Classes.png)

## Desenvolvedores

- José Alysson Matheus Lima de Oliveira
- Jesús Miguel Almenares

## Observações

Este projeto está em fase de desenvolvimento e tem foco em demonstrar o fluxo principal de uso para pacientes e clínicas, com navegação entre telas, cadastro, perfil e agenda.

## Licença

Este projeto está sob a licença do repositório e pode ser utilizado para fins acadêmicos e de desenvolvimento.
