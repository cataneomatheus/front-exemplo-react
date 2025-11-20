import { Pencil, Trash2 } from 'lucide-react';
import { Album } from '../types/album';
import { Card } from './ui/Card';

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
          <Card>{album.genero}</Card>
          <Card>{album.ano}</Card>
          <Card>{album.faixas} faixas</Card>
          <Card>{album.duracao}</Card>
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