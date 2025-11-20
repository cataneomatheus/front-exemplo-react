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