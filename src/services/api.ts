/**
 * SERVIÇO DE API
 * 
 * Este arquivo configura o Axios para fazer requisições HTTP.
 * Axios é uma biblioteca que facilita a comunicação com APIs REST.
 */

import axios from 'axios';

/**
 * URL base da nossa API
 * Em desenvolvimento, usamos localhost:3001
 * Em produção (Docker), usamos a variável de ambiente
 */
const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Instância configurada do Axios
 * 
 * Aqui criamos uma instância personalizada do Axios com configurações padrão.
 * Todas as requisições feitas com esta instância terão essas configurações.
 */
export const api = axios.create({
  baseURL: URL_BASE,           // URL base para todas as requisições
  timeout: 10000,               // Tempo máximo de espera (10 segundos)
  headers: {
    'Content-Type': 'application/json',  // Tipo de conteúdo das requisições
  },
});

/**
 * INTERCEPTOR DE REQUISIÇÃO
 * 
 * Interceptors permitem executar código antes de enviar a requisição.
 * Útil para adicionar tokens de autenticação, logs, etc.
 */
api.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar lógica antes de enviar a requisição
    console.log('📤 Requisição enviada:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTOR DE RESPOSTA
 * 
 * Interceptors de resposta permitem tratar respostas e erros globalmente.
 * Útil para tratamento centralizado de erros.
 */
api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida (status 2xx)
    console.log('✅ Resposta recebida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Se houver erro na resposta
    console.error('❌ Erro na resposta:', error.message);
    
    // Tratamento de erros específicos
    if (error.response) {
      // O servidor respondeu com um status de erro
      switch (error.response.status) {
        case 404:
          console.error('Recurso não encontrado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
        default:
          console.error('Erro desconhecido:', error.response.status);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor');
    }
    
    return Promise.reject(error);
  }
);
