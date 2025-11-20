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