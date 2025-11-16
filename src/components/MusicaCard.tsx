/**
 * COMPONENTE: MusicaCard
 * 
 * Card que exibe as informações de uma música com ações de editar e deletar.
 * Demonstra composição de componentes, passagem de props e tratamento de eventos.
 */

import { Edit2, Trash2 } from 'lucide-react';
import { Musica } from '../types/musica';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { CAPA_PADRAO } from '../lib/constants';

/**
 * Props do componente MusicaCard
 */
interface MusicaCardProps {
  musica: Musica;                    // Dados da música
  aoEditar: (musica: Musica) => void;  // Callback ao clicar em editar
  aoDeletar: (id: number) => void;     // Callback ao clicar em deletar
}

/**
 * Componente que renderiza um card de música
 * 
 * @param musica - Dados da música a ser exibida
 * @param aoEditar - Função chamada ao editar
 * @param aoDeletar - Função chamada ao deletar
 */
export function MusicaCard({ musica, aoEditar, aoDeletar }: MusicaCardProps) {
  /**
   * Handler para clique no botão de deletar
   * Adiciona uma confirmação antes de deletar
   */
  const handleDeletar = () => {
    // window.confirm retorna true se usuário confirmar
    if (window.confirm(`Tem certeza que deseja deletar "${musica.titulo}"?`)) {
      aoDeletar(musica.id!);  // ! significa que garantimos que id existe
    }
  };

  return (
    /**
     * Card com efeito hover
     * animate-fade-in: animação de entrada suave
     */
    <Card hover className="group animate-fade-in">
      <CardContent className="p-0">
        {/* Container principal com layout flexível */}
        <div className="flex flex-col h-full">
          {/* Seção da Capa do Álbum */}
          <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gradient-to-br from-dark-700 to-dark-800">
            {/* Imagem da capa (usa imagem padrão se não houver URL) */}
            <img
              src={musica.capaUrl || CAPA_PADRAO}
              alt={`Capa do álbum ${musica.album}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                // Se a imagem falhar ao carregar, usa a imagem padrão
                e.currentTarget.src = CAPA_PADRAO;
              }}
            />
            
            {/* Overlay que aparece ao hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Botões de ação que aparecem ao hover */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => aoEditar(musica)}
                  className="flex-1"
                  aria-label={`Editar ${musica.titulo}`}
                >
                  <Edit2 size={16} className="mr-2" />
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeletar}
                  className="flex-1"
                  aria-label={`Deletar ${musica.titulo}`}
                >
                  <Trash2 size={16} className="mr-2" />
                  Deletar
                </Button>
              </div>
            </div>
          </div>

          {/* Seção de Informações */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            {/* Título e Artista */}
            <div className="mb-3">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                {musica.titulo}
              </h3>
              <p className="text-dark-300 text-sm line-clamp-1">
                {musica.artista}
              </p>
            </div>

            {/* Detalhes (Álbum, Ano, Gênero) */}
            <div className="space-y-1 text-sm">
              <div className="flex items-center text-dark-400">
                <span className="font-medium text-dark-300 mr-2">Álbum:</span>
                <span className="line-clamp-1">{musica.album}</span>
              </div>
              
              <div className="flex items-center justify-between text-dark-400">
                <div>
                  <span className="font-medium text-dark-300 mr-2">Ano:</span>
                  <span>{musica.ano}</span>
                </div>
                
                <div className="px-2 py-1 bg-primary-500/10 text-primary-400 rounded-md text-xs font-medium">
                  {musica.genero}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
