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