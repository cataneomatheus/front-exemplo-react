/**
 * COMPONENTE: Modal (Janela Sobreposta)
 * 
 * Um modal acessível e responsivo para exibir conteúdo sobre a página.
 * Demonstra uso de portals, eventos de teclado e acessibilidade.
 */

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Props do componente Modal
 */
interface ModalProps {
  aberto: boolean;                    // Controla se o modal está visível
  aoFechar: () => void;               // Função chamada ao fechar
  titulo: string;                     // Título do modal
  children: React.ReactNode;          // Conteúdo do modal
  tamanho?: 'sm' | 'md' | 'lg' | 'xl';  // Tamanho do modal
}

/**
 * Componente Modal com backdrop e animações
 */
export function Modal({ aberto, aoFechar, titulo, children, tamanho = 'md' }: ModalProps) {
  /**
   * Efeito para gerenciar eventos de teclado
   * ESC fecha o modal
   */
  useEffect(() => {
    const handleEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape' && aberto) {
        aoFechar();
      }
    };

    // Adiciona o listener quando o modal abre
    if (aberto) {
      document.addEventListener('keydown', handleEscape);
      // Previne scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden';
    }

    // Cleanup: remove o listener e restaura scroll
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [aberto, aoFechar]);

  // Se não está aberto, não renderiza nada
  if (!aberto) return null;

  /**
   * Classes para diferentes tamanhos de modal
   */
  const tamanhoClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    /**
     * Portal para renderizar o modal no topo da hierarquia DOM
     * Aqui simulamos um portal usando position fixed
     */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop (fundo escuro) */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={aoFechar}  // Fecha ao clicar no backdrop
        aria-hidden="true"
      />

      {/* Container do modal */}
      <div
        className={cn(
          'relative w-full bg-dark-800 rounded-xl shadow-2xl animate-scale-in',
          'border border-dark-700',
          tamanhoClasses[tamanho]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
      >
        {/* Cabeçalho do modal */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2
            id="modal-titulo"
            className="text-xl font-bold text-white"
          >
            {titulo}
          </h2>
          
          {/* Botão de fechar */}
          <button
            onClick={aoFechar}
            className="text-dark-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-dark-700"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo do modal */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
