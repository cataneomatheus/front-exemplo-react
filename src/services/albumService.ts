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