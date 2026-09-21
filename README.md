# Loja Virtual — E-commerce com Azure Blob Storage + Table Storage

Aplicação web de e-commerce desenvolvida em **TypeScript** (backend em
Node.js/Express e frontend em React), utilizando **Azure Blob Storage**
para as fotos dos produtos e **Azure Table Storage** para os dados de
produtos, clientes e pedidos.

## Estrutura do projeto

```
root/
├── backend/     -> API REST em Node.js + TypeScript + Express
└── frontend/    -> Interface web em React + TypeScript (Vite)
```

## Funcionalidades implementadas

- **Gerenciamento de produtos**: cadastro (marca, modelo, valor, foto,
  quantidade), edição, exclusão e busca por marca/modelo/faixa de preço.
- **Gerenciamento de clientes**: cadastro, edição, exclusão e histórico
  de pedidos por cliente.
- **Checkout**: validação de preço/quantidade em estoque, escolha de
  método de pagamento e de entrega, criação do pedido.
- **Interface web**: catálogo responsivo para clientes, painel de
  administração (produtos e clientes) e área do cliente (pedidos e
  edição de dados pessoais).
- **Azure Blob Storage**: as fotos dos produtos são enviadas para um
  container (`product-images`), que é criado automaticamente na
  primeira execução do backend; a URL pública do blob é salva no
  registro do produto.
- **Azure Table Storage**: as tabelas `Products`, `Customers` e
  `Orders` são criadas automaticamente na primeira execução do backend
  e armazenam, respectivamente, os produtos, clientes e pedidos.

## Credenciais do Azure

A connection string da conta de armazenamento (fornecida no enunciado
do trabalho) já está configurada em `backend/.env`. Não é necessário
criar nenhum recurso novo no Azure — o backend cria automaticamente o
container de blobs e as tabelas na conta existente (`stop1nuvem2`) ao
subir.

> ⚠️ Por se tratar de uma `AccountKey` com acesso total à conta, evite
> subir o arquivo `.env` para repositórios públicos.

## Como executar

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

O servidor sobe em `http://localhost:4000`. Na primeira execução, ele
cria automaticamente o container `product-images` e as tabelas
`Products`, `Customers` e `Orders` na conta de armazenamento.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173` e já está configurada
(`frontend/.env`) para consumir a API em `http://localhost:4000/api`.

## Acesso ao painel administrativo

Na tela de login, escolha a aba **Administrador** e use a senha:

```
admin123
```

## Acesso como cliente

Na tela de login, escolha a aba **Sou Cliente**, cadastre-se com nome
e e-mail (dados fictícios servem) e faça o checkout normalmente.

## Publicação (item "Publicação do site/app")

O documento do trabalho libera o uso das connection strings fornecidas
em vez da criação de novos recursos de hospedagem. Caso seja necessário
publicar a aplicação (ex.: Azure App Service / Static Web Apps, Render,
Railway, Vercel), o processo é:

- **Backend**: publicar a pasta `backend` como um serviço Node.js,
  configurando as variáveis de ambiente de `backend/.env` no serviço
  escolhido.
- **Frontend**: publicar a pasta `frontend` (`npm run build` gera a
  pasta `dist`) como um site estático, ajustando `VITE_API_URL` para a
  URL pública do backend publicado.

## Build de produção

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm run preview
```
