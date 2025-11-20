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