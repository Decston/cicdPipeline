# 🤝 Contributing Guide

Obrigado por considerar contribuir com este projeto! 🚀
Este guia descreve o fluxo e as boas práticas para garantir qualidade, organização e consistência no desenvolvimento.

---

# 🎯 Objetivo

Garantir que todas as contribuições:

- Sigam um padrão consistente
- Passem por validação automática (CI)
- Sejam revisadas antes do merge
- Não quebrem a aplicação em produção

---

# 🧭 Fluxo de Contribuição

```text
Fork/Clone
↓
Criar branch
↓
Desenvolver
↓
Testar localmente
↓
Push
↓
Pull Request
↓
CI valida
↓
Code Review
↓
Merge
↓
Deploy automático
```

---

# 🧱 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

---

# 🌿 2. Criar uma branch

```bash
git checkout -b feature/nome-da-feature
```

📌 Padrões de branch:

- `feature/` → nova funcionalidade
- `fix/` → correção de bug
- `hotfix/` → correção urgente
- `chore/` → ajustes internos

---

# 🐳 3. Subir ambiente local

```bash
docker-compose up --build
```

Acessos:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

---

# 💻 4. Desenvolvimento

- Mantenha código limpo e organizado
- Siga boas práticas da linguagem
- Evite código duplicado
- Escreva código legível

---

# 🧪 5. Testes locais

Antes de subir qualquer alteração:

## Frontend

```bash
cd frontend
npm install
npm run test
```

## Backend

```bash
cd backend
./mvnw test
```

📌 Regra:

```text
Se os testes falharem → NÃO faça commit
```

---

# 🏗️ 6. Testar build

```bash
cd frontend
npm run build
```

📌 Isso evita erros no CI/CD

---

# 💾 7. Commit

Utilize mensagens padronizadas (Conventional Commits):

```bash
git commit -m "feat: adiciona nova funcionalidade"
```

Exemplos:

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `chore:` ajustes internos
- `docs:` documentação
- `test:` testes

---

# 🚀 8. Push

```bash
git push origin feature/nome-da-feature
```

---

# 🔄 9. Criar Pull Request

- Base: `main`
- Descreva claramente a alteração
- Adicione contexto e prints (se necessário)

---

# 🤖 10. CI (Integração Contínua)

Após abrir o PR:

O pipeline executa automaticamente:

- Testes do backend
- Testes do frontend
- Build da aplicação

## ❌ Se falhar:

- Corrija o erro
- Faça novo commit
- O CI será reexecutado automaticamente

## ✅ Se passar:

- Pronto para revisão

---

# 👀 11. Code Review

- Outro desenvolvedor deve revisar
- Ajustes podem ser solicitados
- Aprovação é obrigatória para merge

---

# 🔒 12. Regras de Merge

- Merge direto na `main` é proibido
- PR precisa:
  - Passar no CI
  - Ser aprovado

---

# 🚀 13. Deploy

Após o merge:

- Pipeline de CD executa automaticamente
- Aplicação é atualizada em produção

---

# ⚠️ Boas práticas

- Nunca commitar diretamente na `main`
- Sempre rodar testes antes do push
- Manter commits pequenos e claros
- Evitar código quebrado
- Atualizar documentação quando necessário

---

# 🧠 Dicas importantes

- Se estiver em dúvida, abra uma issue
- Prefira clareza ao invés de complexidade
- Teste tudo localmente antes de subir

---

# 🙌 Obrigado por contribuir!

Sua contribuição é muito importante para melhorar o projeto 🚀
