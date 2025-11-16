/**
 * PONTO DE ENTRADA DA APLICAÇÃO
 * 
 * Este é o primeiro arquivo executado quando a aplicação inicia.
 * Aqui configuramos o React e montamos o componente App na página.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Pega o elemento com id "root" do index.html
 * e cria uma raiz React nele
 */
const root = document.getElementById('root');

if (!root) {
  throw new Error('Elemento root não encontrado! Verifique o index.html');
}

/**
 * Renderiza a aplicação dentro do modo estrito do React
 * 
 * React.StrictMode ativa verificações e avisos adicionais
 * para ajudar a identificar problemas potenciais no código
 */
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
