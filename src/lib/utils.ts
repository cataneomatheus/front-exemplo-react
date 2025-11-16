/**
 * UTILITÁRIOS
 * 
 * Funções auxiliares usadas em todo o projeto
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Função para combinar classes CSS do Tailwind
 * 
 * Esta função permite combinar classes CSS de forma inteligente,
 * evitando conflitos e duplicações.
 * 
 * @param inputs - Classes CSS a serem combinadas
 * @returns String com as classes combinadas
 * 
 * Exemplo:
 * cn('px-4 py-2', 'bg-blue-500', condition && 'text-white')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Função para formatar ano
 * 
 * Garante que o ano seja um número válido de 4 dígitos
 * 
 * @param ano - Ano a ser formatado
 * @returns Ano formatado ou string vazia se inválido
 */
export function formatarAno(ano: number): string {
  if (!ano || ano < 1000 || ano > 9999) {
    return '';
  }
  return ano.toString();
}

/**
 * Função para validar URL de imagem
 * 
 * Verifica se a URL é válida e aponta para uma imagem
 * 
 * @param url - URL a ser validada
 * @returns true se válida, false caso contrário
 */
export function validarUrlImagem(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const extensoesValidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return extensoesValidas.some(ext => urlObj.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Função para truncar texto longo
 * 
 * Útil para limitar o tamanho de títulos e descrições
 * 
 * @param texto - Texto a ser truncado
 * @param tamanhoMaximo - Tamanho máximo do texto
 * @returns Texto truncado com "..." se necessário
 */
export function truncarTexto(texto: string, tamanhoMaximo: number = 50): string {
  if (texto.length <= tamanhoMaximo) {
    return texto;
  }
  return texto.substring(0, tamanhoMaximo) + '...';
}
