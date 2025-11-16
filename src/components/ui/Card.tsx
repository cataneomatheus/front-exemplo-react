/**
 * COMPONENTE: Card (Cartão)
 * 
 * Um componente de cartão versátil para exibir conteúdo agrupado.
 * Demonstra composição de componentes e padrão de compound components.
 */

import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/**
 * Props do Card principal
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;      // Adiciona efeito hover
  children?: React.ReactNode;  // Conteúdo do card
}

/**
 * Componente Card principal
 * Serve como container para CardHeader, CardContent, etc.
 */
export function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        // Classes base
        'rounded-xl border border-dark-700 bg-dark-800/50 backdrop-blur-sm',
        'transition-all duration-300',
        // Efeito hover opcional
        hover && 'hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-500/50 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Componente CardHeader
 * Área superior do card, geralmente contém título
 */
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-6 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Componente CardTitle
 * Título do card com estilo padronizado
 */
export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-xl font-bold text-white', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * Componente CardContent
 * Área principal de conteúdo do card
 */
export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Componente CardFooter
 * Área inferior do card, geralmente contém ações
 */
export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-6 pt-4 border-t border-dark-700', className)}
      {...props}
    >
      {children}
    </div>
  );
}
