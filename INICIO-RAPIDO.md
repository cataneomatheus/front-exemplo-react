# 🚀 Início Rápido

## Opção 1: Executar Localmente (Desenvolvimento)

### 1️⃣ Instalar Dependências do Frontend

```powershell
npm install
```

### 2️⃣ Instalar Dependências da API

```powershell
cd api
npm install
cd ..
```

### 3️⃣ Executar o Projeto

**Abra 2 terminais:**

**Terminal 1 - API:**
```powershell
cd api
npm start
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

### 4️⃣ Acessar

- 🎵 Frontend: http://localhost:5173
- 🔌 API: http://localhost:3001
- 📊 Dados: http://localhost:3001/musicas

---

## Opção 2: Docker (Recomendado)

### 1️⃣ Instalar Dependências da API (necessário para o volume)

```powershell
cd api
npm install
cd ..
```

### 2️⃣ Executar com Docker Compose

```powershell
docker-compose up --build
```

### 3️⃣ Acessar

- 🎵 Frontend: http://localhost:3000
- 🔌 API: http://localhost:3001

### 4️⃣ Parar

```powershell
docker-compose down
```

---

## 🎯 O Que Fazer Agora?

1. ✅ Abra o frontend no navegador
2. ➕ Clique em "Adicionar Música"
3. 📝 Preencha o formulário
4. ✏️ Teste editar uma música
5. 🗑️ Teste deletar uma música
6. 🔍 Use a busca para filtrar

---

## 🐛 Problemas Comuns

### Porta 3001 em uso
```powershell
# Encontrar o processo
netstat -ano | findstr :3001

# Matar o processo (substitua <PID>)
taskkill /PID <PID> /F
```

### Porta 5173 em uso
```powershell
# Encontrar o processo
netstat -ano | findstr :5173

# Matar o processo
taskkill /PID <PID> /F
```

### Erro ao instalar dependências
```powershell
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Próximos Passos

1. Leia o [README.md](README.md) completo
2. Explore o código em `src/`
3. Leia os comentários explicativos
4. Faça modificações e experimente!

---

## 🎓 Conceitos Para Estudar

Enquanto explora o projeto, preste atenção em:

- **React Hooks**: `useState`, `useEffect`, `useCallback`
- **TypeScript**: Interfaces, tipos, generics
- **HTTP/REST**: GET, POST, PUT, DELETE
- **Componentes**: Composição, props, children
- **Estilização**: TailwindCSS classes
- **Docker**: Build, compose, volumes

---

Boa sorte e bom aprendizado! 🚀
