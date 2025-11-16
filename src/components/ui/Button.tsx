/**
 * COMPONENTE: Button (Botão)
 * 
 * Um botão reutilizável com várias variantes e tamanhos.
 * Este componente demonstra como criar componentes flexíveis e reutilizáveis.
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Props do componente Button
 * Extende as props nativas do botão HTML
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';  // Variantes visuais
  size?: 'sm' | 'md' | 'lg';  // Tamanhos
  isLoading?: boolean;         // Estado de carregamento
}

/**
 * Componente Button com forwardRef
 * 
 * forwardRef permite que componentes pais acessem o elemento DOM interno.
 * Útil para focar o botão programaticamente, por exemplo.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    /**
     * Classes base aplicadas a todos os botões
     * Incluem transições suaves e estados de hover/focus
     */
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    /**
     * Classes específicas para cada variante
     * Cada variante tem cores e estilos diferentes
     */
    const variantClasses = {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 focus:ring-primary-500 shadow-lg shadow-primary-500/30',
      secondary: 'bg-dark-700 text-white hover:bg-dark-600 focus:ring-dark-500 border border-dark-600',
      danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500 shadow-lg shadow-red-500/30',
      ghost: 'text-dark-300 hover:bg-dark-800 hover:text-white focus:ring-dark-500',
    };
    
    /**
     * Classes específicas para cada tamanho
     */
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Spinner de carregamento */}
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
