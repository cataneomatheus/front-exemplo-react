/**
 * TIPOS DO PROJETO
 * 
 * Este arquivo define as interfaces TypeScript usadas no projeto.
 * Interfaces são como "contratos" que definem a estrutura dos nossos dados.
 */

/**
 * Interface que representa uma Música
 * 
 * @property id - Identificador único da música (gerado automaticamente pela API)
 * @property titulo - Nome da música
 * @property artista - Nome do artista ou banda
 * @property album - Nome do álbum
 * @property ano - Ano de lançamento
 * @property genero - Gênero musical (Rock, Pop, etc.)
 * @property capaUrl - URL da imagem da capa do álbum
 */
export interface Musica {
  id?: number;        // O "?" significa que é opcional (não precisa ao criar)
  titulo: string;     // string = texto
  artista: string;
  album: string;
  ano: number;        // number = número
  genero: string;
  capaUrl: string;
}

/**
 * Interface para o formulário de Música
 * Usamos Omit para remover o campo "id" da interface Musica,
 * pois o ID é gerado automaticamente pelo backend
 */
export type FormularioMusica = Omit<Musica, 'id'>;
