/**
 * HOOK CUSTOMIZADO - useMusicas
 * 
 * Hooks customizados são funções reutilizáveis que encapsulam lógica complexa.
 * Este hook gerencia todo o estado e operações relacionadas a músicas.
 * 
 * Conceitos React ensinados aqui:
 * - useState: Para gerenciar estado local
 * - useEffect: Para executar código quando o componente é montado
 * - Custom Hooks: Para reutilizar lógica entre componentes
 */

import { useState, useEffect, useCallback } from 'react';
import { musicaService } from '../services/musicaService';
import { Musica, FormularioMusica } from '../types/musica';

/**
 * Interface que define o retorno do hook
 * Facilita o uso do hook e fornece autocomplete no TypeScript
 */
interface UseMusicasRetorno {
  musicas: Musica[];              // Lista de músicas
  carregando: boolean;            // Estado de carregamento
  erro: string | null;            // Mensagem de erro (se houver)
  recarregar: () => Promise<void>;  // Função para recarregar a lista
  adicionar: (musica: FormularioMusica) => Promise<void>;  // Adicionar música
  atualizar: (id: number, musica: FormularioMusica) => Promise<void>;  // Atualizar música
  deletar: (id: number) => Promise<void>;  // Deletar música
}

/**
 * Hook customizado para gerenciar músicas
 * 
 * Este hook encapsula toda a lógica de CRUD de músicas,
 * facilitando o uso em qualquer componente.
 * 
 * @returns Objeto com músicas, estados e funções de manipulação
 */
export function useMusicas(): UseMusicasRetorno {
  // ==================== ESTADOS ====================
  
  /**
   * Estado para armazenar a lista de músicas
   * Inicia como array vazio []
   */
  const [musicas, setMusicas] = useState<Musica[]>([]);
  
  /**
   * Estado para controlar se está carregando
   * Usado para mostrar spinners/skeletons na UI
   */
  const [carregando, setCarregando] = useState(true);
  
  /**
   * Estado para armazenar mensagens de erro
   * null = sem erro, string = mensagem de erro
   */
  const [erro, setErro] = useState<string | null>(null);

  // ==================== FUNÇÕES ====================

  /**
   * Função para carregar todas as músicas
   * 
   * useCallback memoriza a função para evitar recriações desnecessárias.
   * Isso otimiza a performance do React.
   */
  const recarregar = useCallback(async () => {
    try {
      setCarregando(true);  // Inicia o carregamento
      setErro(null);         // Limpa erros anteriores
      
      // Busca as músicas na API
      const dados = await musicaService.buscarTodas();
      
      // Atualiza o estado com as músicas recebidas
      setMusicas(dados);
    } catch (err) {
      // Se houver erro, atualiza o estado de erro
      const mensagem = err instanceof Error ? err.message : 'Erro desconhecido';
      setErro(mensagem);
    } finally {
      // finally sempre executa, mesmo se houver erro
      setCarregando(false);  // Finaliza o carregamento
    }
  }, []); // Array vazio = função nunca muda

  /**
   * Função para adicionar uma nova música
   * 
   * @param musica - Dados da música a ser adicionada
   */
  const adicionar = useCallback(async (musica: FormularioMusica) => {
    try {
      setCarregando(true);
      setErro(null);
      
      // Envia a nova música para a API
      await musicaService.criar(musica);
      
      // Recarrega a lista para mostrar a nova música
      await recarregar();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao adicionar música';
      setErro(mensagem);
      throw err; // Re-lança o erro para o componente tratar
    } finally {
      setCarregando(false);
    }
  }, [recarregar]); // Depende de recarregar

  /**
   * Função para atualizar uma música existente
   * 
   * @param id - ID da música a ser atualizada
   * @param musica - Novos dados da música
   */
  const atualizar = useCallback(async (id: number, musica: FormularioMusica) => {
    try {
      setCarregando(true);
      setErro(null);
      
      // Envia os dados atualizados para a API
      await musicaService.atualizar(id, musica);
      
      // Recarrega a lista para mostrar as alterações
      await recarregar();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao atualizar música';
      setErro(mensagem);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, [recarregar]);

  /**
   * Função para deletar uma música
   * 
   * @param id - ID da música a ser deletada
   */
  const deletar = useCallback(async (id: number) => {
    try {
      setCarregando(true);
      setErro(null);
      
      // Deleta a música na API
      await musicaService.deletar(id);
      
      // Recarrega a lista para remover a música da tela
      await recarregar();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao deletar música';
      setErro(mensagem);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, [recarregar]);

  // ==================== EFEITOS ====================

  /**
   * useEffect executa código após a renderização
   * 
   * Aqui carregamos as músicas quando o componente é montado.
   * Array vazio [] = executa apenas uma vez
   */
  useEffect(() => {
    recarregar();
  }, [recarregar]);

  // ==================== RETORNO ====================

  /**
   * Retorna tudo que o componente precisa para trabalhar com músicas
   */
  return {
    musicas,
    carregando,
    erro,
    recarregar,
    adicionar,
    atualizar,
    deletar,
  };
}
