# ENADE Analytics — aplicação de provas

Aplicação operacional para a coordenação aplicar simulados do ENADE. O login identifica o usuário. As notas ficam neste banco MySQL. Este app não grava no data warehouse (`modelo-dimensional/`) e não pede CPF.

O simulado não vale nota e não substitui o ENADE oficial.

## Stack

- Next.js (App Router) e TypeScript
- Tailwind na escala padrão
- Prisma e MySQL com SSL
- Auth0 (login universal no servidor)

O cadastro e a senha, quando existirem, ficam no Auth0. Esta aplicação não guarda senha.

## Configurar

```bash
cd enade-app
cp .env.example .env.local
npm install
npm run db:deploy
npm run dev
```

O Prisma CLI não lê `.env.local` sozinho. Os scripts `db:deploy`, `db:push` e `db:generate` carregam `.env` e, se existir, `.env.local`. O Next.js lê os dois ao subir. As variáveis do Auth0 ficam só no servidor: depois de mudá-las, reinicie o `dev`.

### MySQL

`DATABASE_URL` aponta para o MySQL com TLS. No Prisma o parâmetro é `sslaccept=accept_invalid_certs` (a conexão é criptografada; a CA da Aiven não está no trust store padrão). Não use `ssl-mode=REQUIRED` nesta URL: o Prisma não entende esse parâmetro.

### Auth0

1. Crie uma aplicação **Regular Web** no [Auth0](https://auth0.com). O tenant deste projeto é `enade` (`enade.us.auth0.com`), aplicação **ENADE Analytics**.
2. Em Settings, confira as URLs:
   - Allowed Callback URLs: `http://localhost:3000/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000/` e `http://localhost:3000/login`
3. Em produção, repita com a URL pública e atualize `APP_BASE_URL`.
4. Google e GitHub, se forem usados, entram em Authentication → Social. O callback desses provedores é o do Auth0, não o desta aplicação.
5. Copie domínio, Client ID e Client Secret para o `.env.local`. Gere `AUTH0_SECRET` com `openssl rand -hex 32`.

| Variável | Uso |
| --- | --- |
| `APP_BASE_URL` | URL desta aplicação, sem barra no final. Ex.: `http://localhost:3000` |
| `AUTH0_DOMAIN` | Domínio do tenant, sem `https://` |
| `AUTH0_CLIENT_ID` | Client ID da aplicação |
| `AUTH0_CLIENT_SECRET` | Client Secret. Não use prefixo `NEXT_PUBLIC_` |
| `AUTH0_SECRET` | Chave de 32 bytes em hex para cifrar o cookie de sessão |
| `ADMIN_EMAILS` | E-mails que viram administrador |

Sem essas variáveis, a tela de login explica o que falta e o middleware impede `/admin`. As rotas `/auth/login`, `/auth/logout` e `/auth/callback` são do SDK; não há handler próprio de callback.

Nome, e-mail e papel da sessão vêm do Auth0. O papel de administrador é o e-mail verificado que está em `ADMIN_EMAILS`. Esse banco não guarda usuário do login. E-mail não verificado não entra.

### Promover administrador

Coloque em `ADMIN_EMAILS` o e-mail da conta no Auth0, separado por vírgula se houver mais de um:

```env
ADMIN_EMAILS="coordenacao@instituicao.edu.br,outro@instituicao.edu.br"
```

No login, se o e-mail estiver verificado e na lista, a sessão entra como `ADMIN`. Tirar o e-mail da lista tira o acesso de administrador na próxima requisição.

## Uso

O MySQL desta aplicação é o modelo estrela já carregado: `Dim_Questao`, `Dim_Aluno_Anonimo`, `Dim_Tempo`, `Dim_Simulado` e `Fato_Respostas`.

- `/admin` — acompanhamento: taxa por eixo, turma, simulado e questão
- `/admin/questoes`, `/admin/simulados`, `/admin/alunos`, `/admin/tempo`, `/admin/respostas` — cadastro dessas tabelas

O aluno no banco é só `CodigoAlunoAnonimo` e turma. Nome e e-mail ficam na sessão do Auth0 e não são gravados aqui. A taxa de acerto é calculada na leitura. O dashboard da disciplina segue no Power BI Desktop.

Os eixos são os 16 da Portaria Inep nº 171/2026, art. 6º. A dificuldade gravada é Fácil, Médio ou Difícil.

## Banco

O schema Prisma espelha as cinco tabelas que já existem no MySQL. Não rode uma migration que recrie essas tabelas por cima dos dados. `npx prisma generate` atualiza o client.
