# ENADE Analytics — aplicação de provas

Aplicação operacional para a coordenação aplicar simulados do ENADE. O login identifica o usuário. As notas ficam neste banco MySQL. Este app não grava no data warehouse (`modelo-dimensional/`) e não pede CPF.

O simulado não vale nota e não substitui o ENADE oficial.

## Stack

- Next.js (App Router) e TypeScript
- Tailwind na escala padrão
- Prisma e MySQL com SSL
- Supabase Auth só com login social (Google e GitHub por padrão)

Não há cadastro por senha.

## Configurar

```bash
cd enade-app
cp .env.example .env.local
npm install
npm run db:deploy
npm run dev
```

O Prisma CLI não lê `.env.local` sozinho. Os scripts `db:deploy`, `db:push` e `db:generate` carregam esse arquivo. `npm run dev` lê o arquivo ao subir. Variáveis `NEXT_PUBLIC_*` entram no bundle: depois de preenchê-las, reinicie o `dev` ou rode `npm run build` de novo.

### MySQL

`DATABASE_URL` aponta para o MySQL com TLS. No Prisma o parâmetro é `sslaccept=accept_invalid_certs` (a conexão é criptografada; a CA da Aiven não está no trust store padrão). Não use `ssl-mode=REQUIRED` nesta URL: o Prisma não entende esse parâmetro.

### Supabase

1. Crie um projeto gratuito no [Supabase](https://supabase.com).
2. Em Authentication → URL Configuration, coloque o site em `http://localhost:3000` e acrescente `http://localhost:3000/auth/callback` em Redirect URLs. Em produção, repita com a URL pública.
3. Em Authentication → Providers, habilite **Google** e **GitHub**. No console de cada provedor, a URL de callback é a do Supabase (`https://<projeto>.supabase.co/auth/v1/callback`), não a desta aplicação. Deixe o provedor de e-mail/senha desligado.
4. Em Project Settings → API, copie a URL e a chave anon (ou publishable) para o `.env.local`:

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon/publishable. Também é aceito `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `NEXT_PUBLIC_AUTH_PROVIDERS` | Lista separada por vírgula. Padrão: `google,github`. Também: `discord`, `gitlab`, `azure` |
| `ADMIN_EMAILS` | E-mails que viram administrador |

Sem essas chaves, a tela de login explica o que falta e o middleware impede `/admin` e `/prova`.

### Promover administrador

Coloque em `ADMIN_EMAILS` o e-mail da conta Google ou GitHub, separado por vírgula se houver mais de um:

```env
ADMIN_EMAILS="coordenacao@instituicao.edu.br,outro@instituicao.edu.br"
```

No login, se o e-mail estiver na lista, o papel no MySQL vira `ADMIN`. Vale no primeiro acesso e também num acesso seguinte, se a pessoa já tinha entrado como aluno. Tirar o e-mail da lista não rebaixa quem já é admin. Não existe conta local com senha.

## Uso

- `/admin` — só `ADMIN`: perguntas, provas, acompanhamento e usuários que entraram
- `/prova` — prova do dia, retomada da mesma ordem e resultado
- `/prova/desempenho` — nota, acertos e histórico

Uma pergunta usada em tentativa não é apagada: ela é desativada. Uma prova com tentativa não é apagada; data e perguntas ficam travadas, o título pode mudar. Questão em branco na conclusão conta como erro. A nota já gravada não muda se a pergunta for editada depois.

Os eixos opcionais são os 16 da Portaria Inep nº 171/2026, art. 6º. A dificuldade é Fácil, Médio ou Difícil.

## Banco

A migration inicial está em `prisma/migrations/20260926023000_init`. `npm run db:deploy` aplica as migrations. `npm run db:push` sincroniza o schema sem o histórico de migrations.
