/**
 * COMPONENTE PRINCIPAL: App
 * 
 * Este é o componente raiz da aplicação.
 * Aqui integramos todos os componentes e gerenciamos o estado global.
 * 
 * Conceitos demonstrados:
 * - Composição de componentes
 * - Gerenciamento de estado
 * - Comunicação entre componentes (props e callbacks)
 * - Filtragem e busca de dados
 */

import { useState } from 'react';
import { Search, Plus, Music2, AlertCircle, Loader2 } from 'lucide-react';
import { useMusicas } from './hooks/useMusicas';
import { MusicaCard } from './components/MusicaCard';
import { MusicaForm } from './components/MusicaForm';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Musica, FormularioMusica } from './types/musica';

/**
 * Componente principal da aplicação
 */
function App() {
  // ==================== HOOKS ====================
  
  /**
   * Hook customizado que gerencia as músicas
   * Retorna músicas, estado de carregamento, erros e funções CRUD
   */
  const { musicas, carregando, erro, adicionar, atualizar, deletar } = useMusicas();
  
  // ==================== ESTADOS LOCAIS ====================
  
  /**
   * Estado para controlar a busca/filtro
   */
  const [termoBusca, setTermoBusca] = useState('');
  
  /**
   * Estado para controlar se o modal está aberto
   */
  const [modalAberto, setModalAberto] = useState(false);
  
  /**
   * Estado para armazenar a música sendo editada
   * null = adicionar nova música
   * Musica = editar música existente
   */
  const [musicaEditando, setMusicaEditando] = useState<Musica | null>(null);
  
  // ==================== FUNÇÕES ====================
  
  /**
   * Filtra as músicas baseado no termo de busca
   * Busca em título, artista, álbum e gênero
   */
  const musicasFiltradas = musicas.filter((musica) => {
    const termo = termoBusca.toLowerCase();
    return (
      musica.titulo.toLowerCase().includes(termo) ||
      musica.artista.toLowerCase().includes(termo) ||
      musica.album.toLowerCase().includes(termo) ||
      musica.genero.toLowerCase().includes(termo)
    );
  });
  
  /**
   * Abre o modal para adicionar uma nova música
   */
  const handleAdicionar = () => {
    setMusicaEditando(null);  // null = nova música
    setModalAberto(true);
  };
  
  /**
   * Abre o modal para editar uma música existente
   */
  const handleEditar = (musica: Musica) => {
    setMusicaEditando(musica);  // Passa a música para edição
    setModalAberto(true);
  };
  
  /**
   * Salva a música (adiciona ou atualiza)
   * Esta função é chamada quando o formulário é submetido
   */
  const handleSalvar = async (musicaData: FormularioMusica) => {
    if (musicaEditando) {
      // Se está editando, chama atualizar
      await atualizar(musicaEditando.id!, musicaData);
    } else {
      // Se não está editando, chama adicionar
      await adicionar(musicaData);
    }
  };
  
  // ==================== RENDERIZAÇÃO ====================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Container principal com padding e largura máxima */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========== CABEÇALHO ========== */}
        <header className="mb-8 animate-fade-in">
          {/* Título com gradiente */}
          <div className="flex items-center justify-center mb-2">
            <Music2 className="mr-3 text-primary-500" size={40} />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Minha Coleção Musical
            </h1>
          </div>
          
          <p className="text-center text-dark-300 text-lg">
            Gerencie suas músicas favoritas com estilo 🎵
          </p>
        </header>
        
        {/* ========== BARRA DE AÇÕES ========== */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 animate-slide-up">
          {/* Campo de busca */}
          <div className="flex-1">
            <Input
              placeholder="Buscar por título, artista, álbum ou gênero..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              icone={<Search size={18} />}
            />
          </div>
          
          {/* Botão de adicionar */}
          <Button
            onClick={handleAdicionar}
            size="lg"
            className="sm:w-auto"
          >
            <Plus size={20} className="mr-2" />
            Adicionar Música
          </Button>
        </div>
        
        {/* ========== CONTEÚDO PRINCIPAL ========== */}
        <main>
          {/* Estado de Carregamento */}
          {carregando && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
              <p className="text-dark-300 text-lg">Carregando músicas...</p>
            </div>
          )}
          
          {/* Estado de Erro */}
          {erro && !carregando && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 flex items-start gap-4 animate-scale-in">
              <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-red-400 font-bold mb-1">Erro ao carregar músicas</h3>
                <p className="text-red-300">{erro}</p>
              </div>
            </div>
          )}
          
          {/* Lista de Músicas */}
          {!carregando && !erro && (
            <>
              {/* Contador de músicas */}
              <div className="mb-4 text-dark-300">
                {termoBusca ? (
                  <p>
                    Encontradas <span className="text-primary-400 font-bold">{musicasFiltradas.length}</span> música(s) 
                    {musicasFiltradas.length !== musicas.length && (
                      <span> de <span className="text-white font-bold">{musicas.length}</span> total</span>
                    )}
                  </p>
                ) : (
                  <p>
                    Total de <span className="text-primary-400 font-bold">{musicas.length}</span> música(s) na coleção
                  </p>
                )}
              </div>
              
              {/* Grid de Cards */}
              {musicasFiltradas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {musicasFiltradas.map((musica) => (
                    <MusicaCard
                      key={musica.id}
                      musica={musica}
                      aoEditar={handleEditar}
                      aoDeletar={deletar}
                    />
                  ))}
                </div>
              ) : (
                /* Estado vazio - Nenhuma música encontrada */
                <div className="text-center py-20 animate-fade-in">
                  <Music2 className="mx-auto text-dark-600 mb-4" size={64} />
                  <h3 className="text-xl font-bold text-dark-300 mb-2">
                    {termoBusca ? 'Nenhuma música encontrada' : 'Sua coleção está vazia'}
                  </h3>
                  <p className="text-dark-400 mb-6">
                    {termoBusca 
                      ? 'Tente buscar por outros termos' 
                      : 'Comece adicionando sua primeira música'}
                  </p>
                  {!termoBusca && (
                    <Button onClick={handleAdicionar}>
                      <Plus size={20} className="mr-2" />
                      Adicionar Primeira Música
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </main>
        
        {/* ========== MODAL DE FORMULÁRIO ========== */}
        <MusicaForm
          aberto={modalAberto}
          aoFechar={() => setModalAberto(false)}
          aoSalvar={handleSalvar}
          musicaEditando={musicaEditando}
        />
      </div>
      
      {/* ========== RODAPÉ ========== */}
      <footer className="mt-16 pb-8 text-center text-dark-400 text-sm">
        <p>
          Feito com ❤️ para ensinar React, TypeScript e APIs REST
        </p>
        <p className="mt-2">
          Demonstra: GET, POST, PUT, DELETE | Docker | TailwindCSS
        </p>
      </footer>
    </div>
  );
}

export default App;
