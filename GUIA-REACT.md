# Guia Completo: Como o React Funciona

Este guia explica os conceitos fundamentais do React de forma didática, perfeito para estudantes que estão começando.

---

## 📚 Índice
1. [O que é React?](#o-que-é-react)
2. [O que são Hooks?](#o-que-são-hooks)
3. [Como funciona o useState](#como-funciona-o-usestate)
4. [O que faz a tela renderizar](#o-que-faz-a-tela-renderizar)
5. [Exemplo Prático: Lista de Tarefas](#exemplo-prático-lista-de-tarefas)

---

## O que é React?

React é uma **biblioteca JavaScript** para construir interfaces de usuário (UI). Pense nele como um conjunto de ferramentas que facilita a criação de páginas web interativas.

### Conceitos-chave:

**1. Componentes** 
São blocos de código reutilizáveis que retornam HTML (JSX). Imagine como peças de LEGO que você monta para criar a interface.

```tsx
function MeuComponente() {
  return <h1>Olá, Mundo!</h1>;
}
```

**2. JSX (JavaScript + XML)**
É a sintaxe que parece HTML mas está dentro do JavaScript. O React transforma isso em elementos da DOM.

```tsx
const elemento = <div className="card">Conteúdo</div>;
```

**3. Props (Propriedades)**
São dados que você passa de um componente pai para um componente filho.

```tsx
function Saudacao({ nome }: { nome: string }) {
  return <h1>Olá, {nome}!</h1>;
}

// Usando o componente
<Saudacao nome="Maria" />
```

---

## O que são Hooks?

Hooks são **funções especiais** do React que permitem usar recursos do React (como estado e ciclo de vida) em componentes funcionais.

### Por que Hooks existem?

Antes dos Hooks (React < 16.8), você precisava usar classes para ter estado. Hooks tornaram tudo mais simples:

```tsx
// ❌ Antes (com classes) - complicado
class Contador extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  render() {
    return <div>{this.state.count}</div>;
  }
}

// ✅ Agora (com Hooks) - simples
function Contador() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

### Principais Hooks:

| Hook | Função |
|------|--------|
| `useState` | Gerencia estado (dados que mudam) |
| `useEffect` | Executa efeitos colaterais (chamadas de API, timers) |
| `useCallback` | Memoriza funções para evitar recriações |
| `useMemo` | Memoriza valores calculados |
| `useRef` | Referencia elementos DOM diretamente |

---

## Como funciona o useState

O `useState` é o hook mais usado. Ele permite que um componente "lembre" de informações entre renderizações.

### Sintaxe:

```tsx
const [valor, setValor] = useState(valorInicial);
```

- **`valor`**: a variável que contém o estado atual
- **`setValor`**: função para atualizar o estado
- **`valorInicial`**: o valor que o estado terá na primeira renderização

### Exemplo Prático:

```tsx
import { useState } from 'react';

function Contador() {
  // Declara uma variável de estado chamada "count"
  // Valor inicial é 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Você clicou {count} vezes</p>
      {/* Quando clicar, atualiza o estado */}
      <button onClick={() => setCount(count + 1)}>
        Clique aqui
      </button>
    </div>
  );
}
```

### Como funciona internamente:

1. **Primeira renderização**: `count` = 0
2. **Usuário clica no botão**: chama `setCount(1)`
3. **React detecta mudança**: agenda uma re-renderização
4. **Segunda renderização**: `count` = 1, a tela atualiza automaticamente

### ⚠️ Regras Importantes:

```tsx
// ❌ NUNCA faça isso (estado não atualiza diretamente)
count = count + 1;

// ✅ SEMPRE use a função set
setCount(count + 1);

// ✅ Ou use a forma funcional (recomendado para atualizações baseadas no valor anterior)
setCount(prevCount => prevCount + 1);
```

---

## O que faz a tela renderizar

O React **re-renderiza** um componente quando:

### 1. **Estado muda** (via `useState` ou `useReducer`)

```tsx
function Exemplo() {
  const [texto, setTexto] = useState('Olá');
  
  // Quando clicar, o estado muda → componente re-renderiza
  return (
    <div>
      <p>{texto}</p>
      <button onClick={() => setTexto('Mudou!')}>
        Mudar
      </button>
    </div>
  );
}
```

### 2. **Props mudam**

```tsx
function Filho({ nome }: { nome: string }) {
  return <p>Olá, {nome}</p>; // Re-renderiza quando "nome" muda
}

function Pai() {
  const [nome, setNome] = useState('João');
  return <Filho nome={nome} />; // Passa prop para o filho
}
```

### 3. **Componente pai re-renderiza**

Quando um pai re-renderiza, todos os filhos também re-renderizam (a menos que você otimize com `React.memo`).

### O Fluxo de Renderização:

```
1. Algo muda (estado ou props)
     ↓
2. React marca o componente como "sujo"
     ↓
3. React executa a função do componente novamente
     ↓
4. React compara o novo JSX com o anterior (Virtual DOM)
     ↓
5. React atualiza APENAS o que mudou na DOM real
     ↓
6. Tela atualizada! ✨
```

### Virtual DOM (Explicação Simples):

Imagine que você tem um caderno (DOM real) e um rascunho (Virtual DOM):

1. Você faz mudanças no rascunho primeiro
2. Compara o rascunho com o caderno
3. Copia apenas as diferenças para o caderno

Isso é MUITO mais rápido do que reescrever tudo!

---

## Exemplo Prático: Lista de Tarefas

Vamos criar uma tela nova do zero para praticar juntos! Usaremos uma API de teste diferente: **JSONPlaceholder** (API fake de TODOs).

### API que vamos usar:
- **Endpoint**: `https://jsonplaceholder.typicode.com/todos`
- **Retorna**: Lista de tarefas com `id`, `title`, `completed`

---

### Passo 1: Criar o tipo TypeScript

Crie o arquivo `src/types/todo.ts`:

```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface FormularioTodo {
  title: string;
  completed: boolean;
}
```

---

### Passo 2: Criar o serviço da API

Crie o arquivo `src/services/todoService.ts`:

```typescript
import axios from 'axios';
import { Todo, FormularioTodo } from '../types/todo';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const todoService = {
  // Buscar todas as tarefas
  buscarTodas: async (): Promise<Todo[]> => {
    try {
      const resposta = await axios.get<Todo[]>(`${BASE_URL}/todos`);
      // Retorna apenas as primeiras 10 para não sobrecarregar
      return resposta.data.slice(0, 10);
    } catch (erro) {
      console.error('Erro ao buscar tarefas:', erro);
      throw new Error('Não foi possível carregar as tarefas');
    }
  },

  // Criar nova tarefa
  criar: async (todo: FormularioTodo): Promise<Todo> => {
    try {
      const resposta = await axios.post<Todo>(`${BASE_URL}/todos`, {
        ...todo,
        userId: 1, // ID fixo para o exemplo
      });
      return resposta.data;
    } catch (erro) {
      console.error('Erro ao criar tarefa:', erro);
      throw new Error('Não foi possível criar a tarefa');
    }
  },

  // Atualizar tarefa (marcar como completa/incompleta)
  atualizar: async (id: number, todo: Partial<Todo>): Promise<Todo> => {
    try {
      const resposta = await axios.patch<Todo>(`${BASE_URL}/todos/${id}`, todo);
      return resposta.data;
    } catch (erro) {
      console.error('Erro ao atualizar tarefa:', erro);
      throw new Error('Não foi possível atualizar a tarefa');
    }
  },

  // Deletar tarefa
  deletar: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${BASE_URL}/todos/${id}`);
    } catch (erro) {
      console.error('Erro ao deletar tarefa:', erro);
      throw new Error('Não foi possível deletar a tarefa');
    }
  },
};
```

---

### Passo 3: Criar o Hook customizado

Crie o arquivo `src/hooks/useTodos.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Todo, FormularioTodo } from '../types/todo';
import { todoService } from '../services/todoService';

export function useTodos() {
  // Estados principais
  const [todos, setTodos] = useState<Todo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Função para recarregar todos
  const recarregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await todoService.buscarTodas();
      setTodos(dados);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro desconhecido';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carrega os dados ao montar o componente
  useEffect(() => {
    recarregar();
  }, [recarregar]);

  // Adicionar nova tarefa
  const adicionar = useCallback(async (todo: FormularioTodo) => {
    const novaTarefa = await todoService.criar(todo);
    // Adiciona no início da lista
    setTodos((anterior) => [novaTarefa, ...anterior]);
  }, []);

  // Alternar status de completado
  const alternarCompleto = useCallback(async (id: number) => {
    const todoAtual = todos.find((t) => t.id === id);
    if (!todoAtual) return;

    const todoAtualizado = await todoService.atualizar(id, {
      completed: !todoAtual.completed,
    });

    setTodos((anterior) =>
      anterior.map((t) => (t.id === id ? { ...t, completed: todoAtualizado.completed } : t))
    );
  }, [todos]);

  // Deletar tarefa
  const deletar = useCallback(async (id: number) => {
    await todoService.deletar(id);
    setTodos((anterior) => anterior.filter((t) => t.id !== id));
  }, []);

  return {
    todos,
    carregando,
    erro,
    adicionar,
    alternarCompleto,
    deletar,
    recarregar,
  };
}
```

---

### Passo 4: Criar o componente de Card

Crie o arquivo `src/components/TodoCard.tsx`:

```tsx
import { Check, Trash2 } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoCardProps {
  todo: Todo;
  aoAlternarCompleto: (id: number) => void;
  aoDeletar: (id: number) => void;
}

export function TodoCard({ todo, aoAlternarCompleto, aoDeletar }: TodoCardProps) {
  const handleDeletar = () => {
    if (window.confirm(`Tem certeza que deseja deletar a tarefa?`)) {
      aoDeletar(todo.id);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-500 transition-all">
      {/* Checkbox para marcar como completo */}
      <button
        onClick={() => aoAlternarCompleto(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-primary-500 border-primary-500'
            : 'border-dark-600 hover:border-primary-500'
        }`}
        aria-label={todo.completed ? 'Marcar como incompleta' : 'Marcar como completa'}
      >
        {todo.completed && <Check size={16} className="text-white" />}
      </button>

      {/* Texto da tarefa */}
      <p
        className={`flex-1 ${
          todo.completed
            ? 'line-through text-dark-400'
            : 'text-dark-100'
        }`}
      >
        {todo.title}
      </p>

      {/* Botão de deletar */}
      <button
        onClick={handleDeletar}
        className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all"
        aria-label="Deletar tarefa"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
```

---

### Passo 5: Criar o componente principal

Crie o arquivo `src/pages/TodosPage.tsx`:

```tsx
import { useState } from 'react';
import { Plus, ListTodo, AlertCircle } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { TodoCard } from '../components/TodoCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function TodosPage() {
  const { todos, carregando, erro, adicionar, alternarCompleto, deletar } = useTodos();
  const [novaTarefa, setNovaTarefa] = useState('');
  const [adicionando, setAdicionando] = useState(false);

  // Filtros
  const [filtro, setFiltro] = useState<'todas' | 'pendentes' | 'completas'>('todas');

  // Filtragem
  const todosFiltradas = todos.filter((todo) => {
    if (filtro === 'pendentes') return !todo.completed;
    if (filtro === 'completas') return todo.completed;
    return true;
  });

  // Estatísticas
  const totalTarefas = todos.length;
  const tarefasCompletas = todos.filter((t) => t.completed).length;
  const tarefasPendentes = totalTarefas - tarefasCompletas;

  // Handler para adicionar tarefa
  const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaTarefa.trim()) {
      alert('Digite uma tarefa!');
      return;
    }

    try {
      setAdicionando(true);
      await adicionar({
        title: novaTarefa,
        completed: false,
      });
      setNovaTarefa(''); // Limpa o input
    } catch (err) {
      alert('Erro ao adicionar tarefa');
    } finally {
      setAdicionando(false);
    }
  };

  // Renderização de carregamento
  if (carregando && todos.length === 0) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ListTodo size={32} className="text-primary-500" />
            <h1 className="text-3xl font-bold text-dark-50">
              Minhas Tarefas
            </h1>
          </div>
          
          {/* Estatísticas */}
          <div className="flex gap-4 mt-4">
            <div className="bg-dark-800 px-4 py-2 rounded-lg border border-dark-700">
              <span className="text-dark-400 text-sm">Total: </span>
              <span className="text-dark-50 font-semibold">{totalTarefas}</span>
            </div>
            <div className="bg-dark-800 px-4 py-2 rounded-lg border border-dark-700">
              <span className="text-dark-400 text-sm">Pendentes: </span>
              <span className="text-yellow-400 font-semibold">{tarefasPendentes}</span>
            </div>
            <div className="bg-dark-800 px-4 py-2 rounded-lg border border-dark-700">
              <span className="text-dark-400 text-sm">Completas: </span>
              <span className="text-green-400 font-semibold">{tarefasCompletas}</span>
            </div>
          </div>
        </header>

        {/* Formulário para adicionar */}
        <form onSubmit={handleAdicionar} className="mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Digite uma nova tarefa..."
              value={novaTarefa}
              onChange={(e) => setNovaTarefa(e.target.value)}
              disabled={adicionando}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={adicionando}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              {adicionando ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </div>
        </form>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filtro === 'todas' ? 'primary' : 'secondary'}
            onClick={() => setFiltro('todas')}
            size="sm"
          >
            Todas ({totalTarefas})
          </Button>
          <Button
            variant={filtro === 'pendentes' ? 'primary' : 'secondary'}
            onClick={() => setFiltro('pendentes')}
            size="sm"
          >
            Pendentes ({tarefasPendentes})
          </Button>
          <Button
            variant={filtro === 'completas' ? 'primary' : 'secondary'}
            onClick={() => setFiltro('completas')}
            size="sm"
          >
            Completas ({tarefasCompletas})
          </Button>
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-500 font-semibold">Erro ao carregar</p>
              <p className="text-red-400 text-sm">{erro}</p>
            </div>
          </div>
        )}

        {/* Lista de tarefas */}
        {todosFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <ListTodo size={48} className="text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">
              {filtro === 'todas' && 'Nenhuma tarefa ainda. Adicione uma!'}
              {filtro === 'pendentes' && 'Nenhuma tarefa pendente. Bom trabalho!'}
              {filtro === 'completas' && 'Nenhuma tarefa completa ainda.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todosFiltradas.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                aoAlternarCompleto={alternarCompleto}
                aoDeletar={deletar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### Passo 6: Integrar na aplicação

No arquivo `src/App.tsx`, adicione uma rota ou botão para acessar a nova página:

```tsx
import { TodosPage } from './pages/TodosPage';

// Se não estiver usando rotas, pode simplesmente renderizar:
function App() {
  return <TodosPage />;
}
```

---

## 🎯 O que os alunos vão aprender com este exemplo:

### ✅ **Hooks em ação:**
- `useState` para gerenciar inputs, filtros e estado de loading
- `useEffect` para carregar dados quando o componente monta
- `useCallback` para otimizar funções

### ✅ **Renderização reativa:**
- Quando adiciona uma tarefa → estado muda → lista re-renderiza
- Quando marca como completo → estado muda → card re-renderiza com estilo diferente
- Quando filtra → array filtrado → re-renderiza apenas os cards visíveis

### ✅ **Integração com API:**
- Chamadas HTTP com Axios
- Tratamento de loading e erro
- CRUD completo (Create, Read, Update, Delete)

### ✅ **Componentização:**
- Hook customizado (`useTodos`) encapsula toda lógica de estado
- Componente de card reutilizável
- Separação de responsabilidades (UI vs lógica)

---

## 💡 Exercícios para fazer com os alunos:

### Nível Básico:
1. Adicionar um contador de caracteres no input (mostrar quantos caracteres foram digitados)
2. Mudar a cor do card baseado no status (verde se completo, amarelo se pendente)
3. Adicionar um botão "Limpar Completas" que remove todas as tarefas marcadas

### Nível Intermediário:
4. Implementar edição de tarefa (clicar na tarefa abre um input para editar)
5. Adicionar categorias/tags para as tarefas
6. Implementar busca por texto na lista

### Nível Avançado:
7. Adicionar drag-and-drop para reordenar tarefas
8. Salvar tarefas no localStorage (persistir localmente)
9. Adicionar animações nas transições (Framer Motion)

---

## 📝 Resumo dos Conceitos-Chave:

| Conceito | O que faz | Quando usar |
|----------|-----------|-------------|
| **useState** | Guarda dados que mudam | Sempre que precisa de estado local |
| **useEffect** | Executa código em momentos específicos | Carregar dados, subscrições, timers |
| **useCallback** | Memoriza funções | Passar funções para filhos otimizados |
| **Hook customizado** | Agrupa lógica reutilizável | Quando a mesma lógica é usada em vários lugares |
| **Props** | Passa dados de pai para filho | Compartilhar dados entre componentes |
| **Re-renderização** | Atualiza a UI | Automático quando estado/props mudam |

---

## 🧱 Projeto Guiado: Coleção de Álbuns com JSON Server

Vamos construir juntos uma nova tela que lista álbuns musicais usando a API local (`json-server`). O objetivo é mostrar um fluxo completo: da atualização do `db.json` até a criação da página React com hooks, componentes e integração visual.

### 📦 O que vamos criar
1. **Nova coleção** `albuns` no `db.json`
2. **Tipos TypeScript** para álbuns (`Album`, `FormularioAlbum`)
3. **Service** dedicado (`albumService.ts`)
4. **Hook customizado** (`useAlbuns.ts`)
5. **Componente de UI** (`AlbumCard.tsx`)
6. **Página** (`AlbunsPage.tsx`) com filtros e estatísticas
7. **Integração** via rota ou botão no `App.tsx`

> 💡 **Dica**: Faça cada etapa com os alunos, testando e validando antes de seguir adiante. Copie e cole os trechos abaixo para acelerar.

---

### 1. Atualizar o `db.json`

**Arquivo**: `api/db.json`

Adicione a nova coleção `albuns` (mantenha a coleção `musicas` existente):

```json
{
  "musicas": [
    { "id": 1, "titulo": "Bohemian Rhapsody", "artista": "Queen", "album": "A Night at the Opera", "ano": 1975, "genero": "Rock", "capaUrl": "https://upload.wikimedia.org/wikipedia/pt/4/4d/Queen_A_Night_At_The_Opera.jpg" }
    // ...demais músicas existentes
  ],
  "albuns": [
    {
      "id": 1,
      "titulo": "Random Access Memories",
      "artista": "Daft Punk",
      "ano": 2013,
      "genero": "Eletrônica",
      "capaUrl": "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
      "faixas": 13,
      "duracao": "74:24"
    },
    {
      "id": 2,
      "titulo": "Abbey Road",
      "artista": "The Beatles",
      "ano": 1969,
      "genero": "Rock",
      "capaUrl": "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
      "faixas": 17,
      "duracao": "47:23"
    },
    {
      "id": 3,
      "titulo": "Lemonade",
      "artista": "Beyoncé",
      "ano": 2016,
      "genero": "Pop",
      "capaUrl": "https://upload.wikimedia.org/wikipedia/en/4/41/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png",
      "faixas": 12,
      "duracao": "45:49"
    }
  ]
}
```

> ✅ Reinicie o JSON Server (`npm start` dentro de `api/`) para que a nova coleção seja reconhecida.

---

### 2. Criar os tipos TypeScript

**Arquivo**: `src/types/album.ts`

```ts
export interface Album {
  id?: number;
  titulo: string;
  artista: string;
  ano: number;
  genero: string;
  capaUrl: string;
  faixas: number;
  duracao: string; // formato mm:ss ou hh:mm:ss
}

export type FormularioAlbum = Omit<Album, 'id'>;
```

> 🛠️ Comente com os alunos sobre a diferença entre `Album` e `FormularioAlbum` (evitamos enviar `id` na criação).

---

### 3. Service: `albumService`

**Arquivo**: `src/services/albumService.ts`

```ts
import { api } from './api';
import { Album, FormularioAlbum } from '../types/album';

const ENDPOINT = '/albuns';

export const albumService = {
  buscarTodos: async (): Promise<Album[]> => {
    const resposta = await api.get<Album[]>(ENDPOINT);
    return resposta.data;
  },

  criar: async (album: FormularioAlbum): Promise<Album> => {
    const resposta = await api.post<Album>(ENDPOINT, album);
    return resposta.data;
  },

  atualizar: async (id: number, album: FormularioAlbum): Promise<Album> => {
    const resposta = await api.put<Album>(`${ENDPOINT}/${id}`, album);
    return resposta.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
```

> ⛏️ Reforce que o service fala com a infraestrutura (API) e nada mais. Controller/UI não acessa Axios diretamente.

---

### 4. Hook customizado: `useAlbuns`

**Arquivo**: `src/hooks/useAlbuns.ts`

```ts
import { useCallback, useEffect, useState } from 'react';
import { Album, FormularioAlbum } from '../types/album';
import { albumService } from '../services/albumService';

export function useAlbuns() {
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await albumService.buscarTodos();
      setAlbuns(dados);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar álbuns';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const adicionar = useCallback(async (album: FormularioAlbum) => {
    const novo = await albumService.criar(album);
    setAlbuns((anterior) => [novo, ...anterior]);
  }, []);

  const atualizar = useCallback(async (id: number, album: FormularioAlbum) => {
    const atualizado = await albumService.atualizar(id, album);
    setAlbuns((anterior) => anterior.map((item) => (item.id === id ? atualizado : item)));
  }, []);

  const deletar = useCallback(async (id: number) => {
    await albumService.deletar(id);
    setAlbuns((anterior) => anterior.filter((item) => item.id !== id));
  }, []);

  return {
    albuns,
    carregando,
    erro,
    adicionar,
    atualizar,
    deletar,
    recarregar,
  };
}
```

> 📌 Compare com `useMusicas`: padrão reutilizável com estado + ações de CRUD.

---

### 5. Componente `AlbumCard`

**Arquivo**: `src/components/AlbumCard.tsx`

```tsx
import { Pencil, Trash2 } from 'lucide-react';
import { Album } from '../types/album';
import { Badge } from './ui/Badge';

interface AlbumCardProps {
  album: Album;
  aoEditar: (album: Album) => void;
  aoDeletar: (id: number) => void;
}

const CAPA_PADRAO = 'https://placehold.co/200x200?text=Album';

export function AlbumCard({ album, aoEditar, aoDeletar }: AlbumCardProps) {
  const handleErroImagem = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = CAPA_PADRAO;
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <img
        src={album.capaUrl}
        alt={`Capa do álbum ${album.titulo}`}
        onError={handleErroImagem}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-xl font-semibold text-dark-50">{album.titulo}</h3>
          <p className="text-dark-400">{album.artista}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{album.genero}</Badge>
          <Badge>{album.ano}</Badge>
          <Badge>{album.faixas} faixas</Badge>
          <Badge>{album.duracao}</Badge>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => aoEditar(album)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition"
          >
            <Pencil size={16} /> Editar
          </button>
          <button
            onClick={() => aoDeletar(album.id!)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
          >
            <Trash2 size={16} /> Remover
          </button>
        </div>
      </div>
    </div>
  );
}
```

> 🧩 Mostre como reaproveitar o `Badge` criado no roteiro principal.

---

### 6. Página `AlbunsPage`

**Arquivo**: `src/pages/AlbunsPage.tsx`

```tsx
import { useMemo, useState } from 'react';
import { Plus, Disc3, AlertCircle } from 'lucide-react';
import { useAlbuns } from '../hooks/useAlbuns';
import { Album, FormularioAlbum } from '../types/album';
import { AlbumCard } from '../components/AlbumCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { AlbumForm } from '../components/AlbumForm';

export function AlbunsPage() {
  const { albuns, carregando, erro, adicionar, atualizar, deletar } = useAlbuns();
  const [busca, setBusca] = useState('');
  const [generoSelecionado, setGeneroSelecionado] = useState('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [albumEditando, setAlbumEditando] = useState<Album | null>(null);

  const generos = useMemo(() => {
    const lista = albuns.map((album) => album.genero);
    return ['todos', ...Array.from(new Set(lista))];
  }, [albuns]);

  const albunsFiltrados = albuns.filter((album) => {
    const combinaBusca = album.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      album.artista.toLowerCase().includes(busca.toLowerCase());
    const combinaGenero = generoSelecionado === 'todos' || album.genero === generoSelecionado;
    return combinaBusca && combinaGenero;
  });

  const abrirModalCriacao = () => {
    setAlbumEditando(null);
    setModalAberto(true);
  };

  const abrirModalEdicao = (album: Album) => {
    setAlbumEditando(album);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setAlbumEditando(null);
  };

  const handleSubmit = async (dados: FormularioAlbum) => {
    if (albumEditando) {
      await atualizar(albumEditando.id!, dados);
    } else {
      await adicionar(dados);
    }
    fecharModal();
  };

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3">
            <Disc3 size={32} className="text-primary-500" />
            <div>
              <h1 className="text-3xl font-bold text-dark-50">Coleção de Álbuns</h1>
              <p className="text-dark-400">Gerencie lançamentos favoritos e descubra novos sons.</p>
            </div>
          </div>
          <Button onClick={abrirModalCriacao} className="flex items-center gap-2">
            <Plus size={18} /> Novo álbum
          </Button>
        </header>

        {erro && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Erro ao carregar álbuns</p>
              <p className="text-sm">{erro}</p>
            </div>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-[1fr_auto] mb-8">
          <Input
            placeholder="Buscar por título ou artista"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
          <select
            value={generoSelecionado}
            onChange={(event) => setGeneroSelecionado(event.target.value)}
            className="bg-dark-800 border border-dark-700 rounded-lg px-4 text-dark-100"
          >
            {generos.map((genero) => (
              <option key={genero} value={genero}>
                {genero === 'todos' ? 'Todos os gêneros' : genero}
              </option>
            ))}
          </select>
        </section>

        {carregando ? (
          <p className="text-dark-400">Carregando álbuns...</p>
        ) : albunsFiltrados.length === 0 ? (
          <div className="text-center py-16 text-dark-400">
            Nenhum álbum encontrado. Que tal adicionar o primeiro?
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albunsFiltrados.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                aoEditar={abrirModalEdicao}
                aoDeletar={deletar}
              />
            ))}
          </div>
        )}

        <Modal titulo={albumEditando ? 'Editar álbum' : 'Novo álbum'} aberto={modalAberto} aoFechar={fecharModal}>
          <AlbumForm valorInicial={albumEditando ?? undefined} onSubmit={handleSubmit} onCancel={fecharModal} />
        </Modal>
      </div>
    </div>
  );
}
```

> 🧠 Mostre como combinar filtros (`busca` + `generoSelecionado`) e por que usamos `useMemo` para extrair os gêneros únicos.

---

### 7. Formulário `AlbumForm`

**Arquivo**: `src/components/AlbumForm.tsx`

```tsx
import { useEffect, useState } from 'react';
import { FormularioAlbum, Album } from '../types/album';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Music, Clock, Hash } from 'lucide-react';

interface AlbumFormProps {
  valorInicial?: Album;
  onSubmit: (dados: FormularioAlbum) => Promise<void> | void;
  onCancel: () => void;
}

export function AlbumForm({ valorInicial, onSubmit, onCancel }: AlbumFormProps) {
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [ano, setAno] = useState('');
  const [genero, setGenero] = useState('');
  const [capaUrl, setCapaUrl] = useState('');
  const [faixas, setFaixas] = useState('');
  const [duracao, setDuracao] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (valorInicial) {
      setTitulo(valorInicial.titulo);
      setArtista(valorInicial.artista);
      setAno(String(valorInicial.ano));
      setGenero(valorInicial.genero);
      setCapaUrl(valorInicial.capaUrl);
      setFaixas(String(valorInicial.faixas));
      setDuracao(valorInicial.duracao);
    }
  }, [valorInicial]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!titulo.trim() || !artista.trim()) {
      setErro('Título e artista são obrigatórios');
      return;
    }

    const anoNumber = Number(ano);
    const faixasNumber = Number(faixas);

    const payload: FormularioAlbum = {
      titulo,
      artista,
      ano: anoNumber,
      genero,
      capaUrl,
      faixas: faixasNumber,
      duracao,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && <p className="text-red-400 text-sm">{erro}</p>}

      <Input label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
      <Input label="Artista" value={artista} onChange={(e) => setArtista(e.target.value)} required />
      <Input
        label="Ano de lançamento"
        type="number"
        value={ano}
        onChange={(e) => setAno(e.target.value)}
        min={1900}
        max={new Date().getFullYear()}
        required
      />
      <Input label="Gênero" value={genero} onChange={(e) => setGenero(e.target.value)} required />
      <Input label="URL da capa" value={capaUrl} onChange={(e) => setCapaUrl(e.target.value)} placeholder="https://..." />
      <Input
        label="Qtd. de faixas"
        type="number"
        min={1}
        value={faixas}
        onChange={(e) => setFaixas(e.target.value)}
        icone={<Hash size={18} />}
      />
      <Input
        label="Duração"
        placeholder="45:49"
        value={duracao}
        onChange={(e) => setDuracao(e.target.value)}
        icone={<Clock size={18} />}
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Music size={18} /> Salvar
        </Button>
      </div>
    </form>
  );
}
```

> 💬 Discuta validações simples (campos obrigatórios, números válidos) antes de enviar.

---

### 8. Integrar no `App.tsx`

**Arquivo**: `src/App.tsx`

Se o projeto usa rotas (`react-router-dom`), adicione uma nova rota:

```tsx
import { AlbunsPage } from './pages/AlbunsPage';

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/musicas" element={<MusicasPage />} />
  <Route path="/albuns" element={<AlbunsPage />} />
</Routes>
```

Se não há rotas, use um toggle simples para navegar:

```tsx
const [tela, setTela] = useState<'musicas' | 'albuns'>('musicas');

return (
  <div>
    <nav className="flex gap-2 mb-4">
      <Button onClick={() => setTela('musicas')}>Músicas</Button>
      <Button onClick={() => setTela('albuns')}>Álbuns</Button>
    </nav>

    {tela === 'musicas' ? <MusicasPage /> : <AlbunsPage />}
  </div>
);
```

---

### 9. Checklist de Testes

1. **Carregamento**: álbuns aparecem ao abrir a página?
2. **Filtro por gênero**: alternar entre opções altera os cards?
3. **Busca**: pesquisar por artista/título filtra corretamente?
4. **CRUD**: criar, editar e remover refletem no JSON Server e na UI?
5. **Fallback da imagem**: URL quebrada mostra capa padrão?
6. **Validação**: campos obrigatórios impedem envio incompleto?

---

### 10. Extensões sugeridas

1. **Ordenação** por ano ou quantidade de faixas
2. **Agrupar** por gênero com seções colapsáveis
3. **Player** com preview em vídeo/áudio do álbum
4. **Indicador de destaque** (ex.: marcar favoritos)
5. **Relatórios**: criar uma tabela com estatísticas em `useMemo`

> 🤝 Incentive os alunos a propor atributos extras no `db.json` (ex.: gravadora, nota, prêmios) e expandir o formulário/página.

---

## 🚀 Próximos Passos:

1. **Testar o código** - Execute e veja funcionando
2. **Modificar** - Mude cores, textos, adicione features
3. **Debugar** - Use `console.log` para entender o fluxo
4. **Expandir** - Implemente os exercícios propostos

---

**🎓 Dica Final:** O melhor jeito de aprender React é **fazendo**. Não tenha medo de errar, cada erro é uma oportunidade de entender melhor como funciona!
