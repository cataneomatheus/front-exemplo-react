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
import { Search, Plus, Music2, AlertCircle, Loader2, Disc3 } from 'lucide-react';
import { useMusicas } from './hooks/useMusicas';
import { MusicaCard } from './components/MusicaCard';
import { MusicaForm } from './components/MusicaForm';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Musica, FormularioMusica } from './types/musica';
import { AlbunsPage } from './components/AlbunsPage';

/**
 * Componente principal da aplicação
 */
function App() {
  // ==================== HOOKS ====================
  
  /**
   * Hook customizado que gerencia as músicas
   * Retorna músicas, estado de carregamento, erros e funções CRUD
   */
  const { musicas, carregando, erro, adicionar, atualizar, deletar, recarregar } = useMusicas();
  const [tela, setTela] = useState<'musicas' | 'albuns'>('musicas');
  
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
  
  /**
   * Fecha o modal e limpa estado de edição
   */
  const handleFecharModal = () => {
    setModalAberto(false);
    setMusicaEditando(null);
  };

  // ==================== RENDERIZAÇÃO ====================
  
  const renderMusicas = () => (
    <div className="max-w-6xl mx-auto px-4 pb-12 space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Music2 size={32} className="text-primary-500" />
          <div>
            <h1 className="text-3xl font-bold text-dark-50">Coleção de Músicas</h1>
            <p className="text-dark-400">Gerencie faixas favoritas, crie playlists e mantenha tudo organizado.</p>
          </div>
        </div>
        <Button onClick={handleAdicionar} className="flex items-center gap-2">
          <Plus size={18} />
          Nova música
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <Input
          placeholder="Buscar por título, artista, álbum ou gênero"
          value={termoBusca}
          onChange={(event) => setTermoBusca(event.target.value)}
          icone={<Search size={18} />}
        />
        <Button
          variant="secondary"
          onClick={handleAdicionar}
          className="flex items-center gap-2 justify-center"
        >
          <Plus size={16} />
          Adicionar música
        </Button>
      </div>

      {erro && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-4 flex flex-wrap items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-semibold">Erro ao carregar músicas</p>
            <p className="text-sm">{erro}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={recarregar}>
            Tentar novamente
          </Button>
        </div>
      )}

      {carregando ? (
        <div className="flex items-center justify-center gap-3 text-dark-300 py-16">
          <Loader2 className="h-6 w-6 animate-spin" />
          Carregando músicas...
        </div>
      ) : musicasFiltradas.length === 0 ? (
        <div className="text-center py-16 text-dark-300 space-y-4 bg-dark-900/40 rounded-xl border border-dark-800">
          <p>Nenhuma música encontrada. Que tal adicionar a primeira?</p>
          <Button onClick={handleAdicionar} className="flex items-center gap-2 mx-auto">
            <Plus size={16} />
            Criar música
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {musicasFiltradas.map((musica) => (
            <MusicaCard
              key={musica.id ?? musica.titulo}
              musica={musica}
              aoEditar={handleEditar}
              aoDeletar={(id) => deletar(id)}
            />
          ))}
        </div>
      )}

      <MusicaForm
        aberto={modalAberto}
        aoFechar={handleFecharModal}
        aoSalvar={handleSalvar}
        musicaEditando={musicaEditando}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="flex gap-3">
          <Button
            onClick={() => setTela('musicas')}
            variant={tela === 'musicas' ? 'primary' : 'ghost'}
            className="flex items-center gap-2"
          >
            <Music2 size={18} />
            Músicas
          </Button>
          <Button
            onClick={() => setTela('albuns')}
            variant={tela === 'albuns' ? 'primary' : 'ghost'}
            className="flex items-center gap-2"
          >
            <Disc3 size={18} />
            Álbuns
          </Button>
        </nav>
      </div>

      {tela === 'musicas' ? renderMusicas() : <AlbunsPage />}
    </div>
  );
}

export default App;
