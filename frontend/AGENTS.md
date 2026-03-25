# 🤖 AGENTS.md

## 🎯 Objetivo do Projeto

Aplicação fullstack utilizando:

- Frontend: Next.js
- Backend: Spring Boot
- Integração via API REST
- CI/CD com GitHub Actions

---

## 🧱 Arquitetura

- O frontend consome a API do backend via HTTP
- Backend expõe endpoints REST em `/api/*`
- Comunicação via JSON/text

---

## 📁 Estrutura

- `/frontend` → aplicação Next.js
- `/backend` → API Spring Boot
- `/.github/workflows` → pipelines CI/CD

---

## ⚙️ Regras para desenvolvimento

### Backend (Spring Boot)

- Criar endpoints seguindo padrão REST:
  - `/api/<recurso>`

- Retornar dados simples (JSON ou String)
- Evitar lógica complexa nos controllers

---

### Frontend (Next.js)

- Utilizar App Router
- Fazer requisições via `fetch`
- Usar variáveis de ambiente (`.env.local`)
- Não hardcode URLs

---

## 🔄 Integração

- URL da API definida via:

  ```
  NEXT_PUBLIC_API_URL
  ```

---

## 🐳 Docker

- Utilizar build multi-stage
- Backend e frontend podem ser containerizados separadamente

---

## 🚀 CI/CD

Pipeline automatiza:

1. Build da aplicação
2. (Opcional) Testes
3. Build da imagem Docker
4. Deploy

---

## 📌 Boas práticas

- Código simples e legível
- Separação de responsabilidades
- Uso de variáveis de ambiente
- Evitar hardcode

---

## 🔥 Evoluções futuras

- Autenticação JWT
- Banco de dados (PostgreSQL)
- Testes automatizados
- Monitoramento

---

## 🧠 Observação

Este projeto foi desenvolvido com foco em:

- Demonstração de CI/CD
- Integração fullstack
- Boas práticas de mercado
