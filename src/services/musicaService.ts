/**
 * SERVIÇO DE MÚSICAS
 * 
 * Este arquivo contém todas as funções para interagir com a API de músicas.
 * Aqui implementamos as operações CRUD (Create, Read, Update, Delete).
 */

import { api } from './api';
import { Musica, FormularioMusica } from '../types/musica';

/**
 * Endpoint da API para músicas
 * JSON Server automaticamente cria rotas REST para este endpoint
 */
const ENDPOINT = '/musicas';

/**
 * SERVIÇO DE MÚSICAS
 * 
 * Objeto que agrupa todas as operações relacionadas a músicas.
 * Este padrão é chamado de "Service Layer" e ajuda a organizar o código.
 */
export const musicaService = {
  /**
   * GET - Buscar todas as músicas
   * 
   * Faz uma requisição GET para buscar todas as músicas cadastradas.
   * 
   * @returns Promise com array de músicas
   * @throws Erro se a requisição falhar
   */
  buscarTodas: async (): Promise<Musica[]> => {
    try {
      // axios.get() retorna um objeto com várias propriedades
      // A propriedade "data" contém os dados que vieram do servidor
      const resposta = await api.get<Musica[]>(ENDPOINT);
      return resposta.data;
    } catch (erro) {
      console.error('Erro ao buscar músicas:', erro);
      throw new Error('Não foi possível carregar as músicas. Tente novamente.');
    }
  },

  /**
   * GET - Buscar uma música por ID
   * 
   * Faz uma requisição GET para buscar uma música específica pelo ID.
   * 
   * @param id - ID da música a ser buscada
   * @returns Promise com a música encontrada
   * @throws Erro se a música não existir ou a requisição falhar
   */
  buscarPorId: async (id: number): Promise<Musica> => {
    try {
      const resposta = await api.get<Musica>(`${ENDPOINT}/${id}`);
      return resposta.data;
    } catch (erro) {
      console.error(`Erro ao buscar música ${id}:`, erro);
      throw new Error('Música não encontrada.');
    }
  },

  /**
   * POST - Criar uma nova música
   * 
   * Faz uma requisição POST para adicionar uma nova música ao banco.
   * O JSON Server gera automaticamente um ID único.
   * 
   * @param musica - Dados da música a ser criada (sem ID)
   * @returns Promise com a música criada (incluindo o ID gerado)
   * @throws Erro se a criação falhar
   */
  criar: async (musica: FormularioMusica): Promise<Musica> => {
    try {
      // Enviamos os dados no corpo da requisição
      const resposta = await api.post<Musica>(ENDPOINT, musica);
      console.log('✅ Música criada com sucesso:', resposta.data);
      return resposta.data;
    } catch (erro) {
      console.error('Erro ao criar música:', erro);
      throw new Error('Não foi possível adicionar a música. Tente novamente.');
    }
  },

  /**
   * PUT - Atualizar uma música existente
   * 
   * Faz uma requisição PUT para atualizar todos os dados de uma música.
   * PUT substitui completamente o recurso existente.
   * 
   * @param id - ID da música a ser atualizada
   * @param musica - Novos dados da música
   * @returns Promise com a música atualizada
   * @throws Erro se a atualização falhar
   */
  atualizar: async (id: number, musica: FormularioMusica): Promise<Musica> => {
    try {
      // PUT substitui o recurso completo
      const resposta = await api.put<Musica>(`${ENDPOINT}/${id}`, musica);
      console.log('✅ Música atualizada com sucesso:', resposta.data);
      return resposta.data;
    } catch (erro) {
      console.error(`Erro ao atualizar música ${id}:`, erro);
      throw new Error('Não foi possível atualizar a música. Tente novamente.');
    }
  },

  /**
   * DELETE - Deletar uma música
   * 
   * Faz uma requisição DELETE para remover uma música do banco.
   * Esta operação é irreversível!
   * 
   * @param id - ID da música a ser deletada
   * @returns Promise vazia (void)
   * @throws Erro se a deleção falhar
   */
  deletar: async (id: number): Promise<void> => {
    try {
      // DELETE não retorna dados, apenas confirma a remoção
      await api.delete(`${ENDPOINT}/${id}`);
      console.log('✅ Música deletada com sucesso:', id);
    } catch (erro) {
      console.error(`Erro ao deletar música ${id}:`, erro);
      throw new Error('Não foi possível deletar a música. Tente novamente.');
    }
  },
};
