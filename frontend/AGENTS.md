# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Convenções do frontend

Regras para qualquer IA ou pessoa que crie ou edite telas e componentes em `frontend/src`. O objetivo é código simples, legível e centrado na regra de negócio: cada tela mostra **o que** faz (validar, chamar a API, navegar); o **como** fica em services, hooks, utils e componentes compartilhados.

## Idioma e nomes

- Identificadores em **inglês**: funções, variáveis, parâmetros, props, types/interfaces e parâmetros de rota (`clinicId`, `doctorId`, `message`).
- Em **português**: textos exibidos ao usuário, comentários e mensagens de commit.
- Nomes de rota são strings em português e não mudam: `"Médicos"`, `"DashboardClinica"`, `"DetalhesClinica"`, `"EscolherEspecialidade"`.
- Telas ficam em `src/screens/<Papel>/<Tela>/<Tela>Screen.tsx` e o componente tem o mesmo nome do arquivo (ex.: `MedicosScreen`, `EscolherEspecialidadeScreen`).
- Componentes reutilizáveis têm nome em inglês (`DoctorCard`, `SpecialtiesCard`). Em arquivos novos, nome do arquivo = nome do componente. Não renomeie arquivos existentes sem pedido.

## Types e interfaces

- Nenhum `type` ou `interface` é declarado dentro de um `.tsx`, nem inline na assinatura das props (`({ a }: { a: string })` é proibido).
- Cada tipo vai em `interfaces/<NomeDoTipo>.ts`, no mesmo diretório do componente que o usa, **um tipo por arquivo**. Exemplos:
  - `src/components/interfaces/ButtonProps.ts`
  - `src/screens/Clinica/Medicos/interfaces/DoctorFilters.ts`
  - `src/screens/Clinica/Medicos/components/interfaces/DoctorCardProps.ts`
- Exceções: tipos do contrato da API ficam no próprio service (`src/services/*.ts`); tipos de rotas ficam em `src/routes/navigationTypes.ts`.

## Reutilize antes de criar

**API (`src/services/`)**
- Toda chamada HTTP passa por `request()` de `services/apiClient.ts`, dentro de uma função de service. Telas nunca chamam `fetch`.
- Rotas públicas (login, cadastros) usam `request(..., { auth: false })`.
- Mensagem de erro para o usuário: `getRequestErrorMessage(e)`. Upload de imagem: `imageFormData(image, nomePadrao)`.
- Services existentes: `authService` (login/cadastros), `profileService`, `clinicProfileService`, `doctorService`, `clinicSearchService`, `authTokenStorage`.

**Carregamento de dados**
- Use `useLoad(fn, deps, { onFocus })` de `hooks/useLoad.ts`, que devolve `{ data, setData, loading, error, reload }`. `onFocus: true` recarrega quando a aba volta a ficar visível.
- Não escreva à mão `useEffect` com flags `isCurrent`/`cancelado` nem estados `loadAttempt`.

**Componentes (`src/components/`)**
- `Button`: variantes `primary | secondary | outline | danger`, com `loading` e `loadingLabel`.
- `Loading`, `ErrorBox` (com `onRetry`) e `SuccessBanner`, em `components/Feedback.tsx`.
- `Section` (card com título) e `ProfileField` (linha de perfil que exibe o valor ou vira campo editável).
- `Chip` (seleção em filtros/especialidades) e `ChangePasswordForm` (troca de senha completa).
- `TextInputStyled`: recebe `error` (uma string), e o `onChangeText` recebe o valor **sem máscara**.

**Utils (`src/utils/`)**
- `pickPhoto(titulo)`: câmera ou galeria, com permissão. `lookupPostalCode(cep)`: consulta o ViaCEP.
- `formatCnpj`, `formatAddress`, `normalize` (busca sem acento) e `EMAIL_REGEX`, em `utils/format.ts`.
- `brazilianStates` (lista de UFs) e `lightenColor`.

**Navegação**
- Abas usam `tabIcon("home")` (`routes/tabIcon.tsx`); telas do stack com cabeçalho usam `withHeader` (`routes/app.routes.tsx`).

## Estrutura de uma tela

1. Estado.
2. Funções de regra de negócio com nome de ação: `validate`, `save`, `handleSignUp`, `changePhoto`, `reactivate`.
3. JSX montado com os componentes compartilhados.

Regras:
- Formulário é um objeto de estado com um setter `set(field)`:
  `const set = (field: keyof Form) => (value: string) => setForm((current) => ({ ...current, [field]: value }));`
- Validação é uma função pura `validate(form)` fora do componente, que devolve **uma mensagem por campo** (`{ email: "E-mail deve ser válido" }`).
- Não use `useRef` para impedir cliques duplos: o `disabled`/`loading` do `Button` resolve.
- Funções puras (filtros, formatações, validações) ficam fora do componente.
- Estilo só com NativeWind (`className`), mantendo as cores do app (`#2F80ED`, `slate-*`).
- Comentários só para regra de negócio que não é óbvia, e curtos (ex.: `// Regra: só pode remover especialidade sem médicos vinculados.`).

## Antes de concluir

- Rode `cd frontend && npx tsc --noEmit` e só termine sem erros (não há lint nem testes no frontend).
- Commits: mensagem em português no padrão `tipo(): descrição` (ex.: `feat(): ...`, `fix(): ...`). Não adicione linhas `Co-Authored-By` de IA.
