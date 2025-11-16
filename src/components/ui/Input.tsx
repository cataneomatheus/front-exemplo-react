/**
 * COMPONENTE: Input (Campo de Texto)
 * 
 * Um campo de entrada de texto reutilizável e estilizado.
 * Demonstra como criar inputs controlados e acessíveis.
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Props do componente Input
 * Extende as props nativas do input HTML
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;      // Label opcional
  erro?: string;       // Mensagem de erro
  icone?: React.ReactNode;  // Ícone opcional no início
}

/**
 * Componente Input com suporte a label e mensagens de erro
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, erro, icone, ...props }, ref) => {
    return (
      <div className="w-full">
        {/* Label opcional */}
        {label && (
          <label className="block text-sm font-medium text-dark-200 mb-2">
            {label}
          </label>
        )}
        
        {/* Container do input com ícone opcional */}
        <div className="relative">
          {/* Ícone à esquerda */}
          {icone && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
              {icone}
            </div>
          )}
          
          {/* Campo de input */}
          <input
            ref={ref}
            className={cn(
              // Classes base
              'w-full rounded-lg border bg-dark-800 px-4 py-2.5 text-white placeholder:text-dark-400',
              'transition-all duration-200',
              // Estados de foco
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              // Estados de erro
              erro ? 'border-red-500 focus:ring-red-500' : 'border-dark-700',
              // Padding extra se houver ícone
              icone && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        
        {/* Mensagem de erro */}
        {erro && (
          <p className="mt-1 text-sm text-red-400 animate-slide-up">
            {erro}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
