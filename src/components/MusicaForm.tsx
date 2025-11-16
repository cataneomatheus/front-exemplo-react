/**
 * COMPONENTE: MusicaForm
 * 
 * Formulário para adicionar ou editar músicas.
 * Demonstra formulários controlados, validação e manipulação de estado.
 */

import { useState, FormEvent, useEffect } from 'react';
import { Musica, FormularioMusica } from '../types/musica';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Music, User, Disc, Calendar, Tag, Image } from 'lucide-react';
import { CAPA_PADRAO } from '../lib/constants';

/**
 * Props do componente MusicaForm
 */
interface MusicaFormProps {
  aberto: boolean;                           // Controla se o modal está aberto
  aoFechar: () => void;                      // Função para fechar o modal
  aoSalvar: (musica: FormularioMusica) => Promise<void>;  // Função para salvar
  musicaEditando?: Musica | null;            // Música sendo editada (opcional)
}

/**
 * Componente de formulário dentro de um modal
 */
export function MusicaForm({ aberto, aoFechar, aoSalvar, musicaEditando }: MusicaFormProps) {
  // ==================== ESTADOS DO FORMULÁRIO ====================
  
  /**
   * Estados para cada campo do formulário
   * Começam vazios ou com valores da música sendo editada
   */
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [album, setAlbum] = useState('');
  const [ano, setAno] = useState('');
  const [genero, setGenero] = useState('');
  const [capaUrl, setCapaUrl] = useState('');
  
  /**
   * Estados de controle
   */
  const [salvando, setSalvando] = useState(false);  // Indica se está salvando
  const [erros, setErros] = useState<Record<string, string>>({});  // Erros de validação

  // ==================== EFEITOS ====================

  /**
   * Efeito que preenche o formulário quando estamos editando
   * Executa sempre que musicaEditando ou aberto mudarem
   */
  useEffect(() => {
    if (musicaEditando && aberto) {
      // Preenche os campos com dados da música
      setTitulo(musicaEditando.titulo);
      setArtista(musicaEditando.artista);
      setAlbum(musicaEditando.album);
      setAno(musicaEditando.ano.toString());
      setGenero(musicaEditando.genero);
      setCapaUrl(musicaEditando.capaUrl);
    } else if (aberto) {
      // Limpa o formulário para nova música
      limparFormulario();
    }
  }, [musicaEditando, aberto]);

  // ==================== FUNÇÕES ====================

  /**
   * Limpa todos os campos do formulário
   */
  const limparFormulario = () => {
    setTitulo('');
    setArtista('');
    setAlbum('');
    setAno('');
    setGenero('');
    setCapaUrl('');
    setErros({});
  };

  /**
   * Valida os campos do formulário
   * Retorna true se todos os campos são válidos
   */
  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    // Validação: Título obrigatório
    if (!titulo.trim()) {
      novosErros.titulo = 'Título é obrigatório';
    }

    // Validação: Artista obrigatório
    if (!artista.trim()) {
      novosErros.artista = 'Artista é obrigatório';
    }

    // Validação: Álbum obrigatório
    if (!album.trim()) {
      novosErros.album = 'Álbum é obrigatório';
    }

    // Validação: Ano deve ser um número válido
    const anoNumero = parseInt(ano);
    if (!ano || isNaN(anoNumero) || anoNumero < 1900 || anoNumero > new Date().getFullYear() + 1) {
      novosErros.ano = 'Ano inválido';
    }

    // Validação: Gênero obrigatório
    if (!genero.trim()) {
      novosErros.genero = 'Gênero é obrigatório';
    }

    // Validação: URL da capa (opcional, mas se fornecida deve ser válida)
    if (capaUrl && !capaUrl.startsWith('http')) {
      novosErros.capaUrl = 'URL deve começar com http:// ou https://';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;  // Retorna true se não houver erros
  };

  /**
   * Handler do submit do formulário
   * 
   * @param e - Evento do formulário
   */
  const handleSubmit = async (e: FormEvent) => {
    // Previne o comportamento padrão do form (que recarregaria a página)
    e.preventDefault();

    // Valida antes de enviar
    if (!validarFormulario()) {
      return;
    }

    try {
      setSalvando(true);

      // Monta o objeto da música
      const musicaData: FormularioMusica = {
        titulo: titulo.trim(),
        artista: artista.trim(),
        album: album.trim(),
        ano: parseInt(ano),
        genero: genero.trim(),
        capaUrl: capaUrl.trim() || CAPA_PADRAO,
      };

      // Chama a função de salvar passada via props
      await aoSalvar(musicaData);

      // Se salvou com sucesso, limpa e fecha
      limparFormulario();
      aoFechar();
    } catch (erro) {
      console.error('Erro ao salvar música:', erro);
      // Aqui você poderia mostrar uma mensagem de erro ao usuário
    } finally {
      setSalvando(false);
    }
  };

  /**
   * Handler para fechar o modal
   */
  const handleFechar = () => {
    limparFormulario();
    aoFechar();
  };

  return (
    <Modal
      aberto={aberto}
      aoFechar={handleFechar}
      titulo={musicaEditando ? '✏️ Editar Música' : '➕ Adicionar Nova Música'}
      tamanho="lg"
    >
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Grid responsivo: 1 coluna no mobile, 2 no desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo: Título */}
          <Input
            label="Título da Música"
            placeholder="Ex: Bohemian Rhapsody"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            erro={erros.titulo}
            icone={<Music size={18} />}
            required
          />

          {/* Campo: Artista */}
          <Input
            label="Artista"
            placeholder="Ex: Queen"
            value={artista}
            onChange={(e) => setArtista(e.target.value)}
            erro={erros.artista}
            icone={<User size={18} />}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo: Álbum */}
          <Input
            label="Álbum"
            placeholder="Ex: A Night at the Opera"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            erro={erros.album}
            icone={<Disc size={18} />}
            required
          />

          {/* Campo: Ano */}
          <Input
            label="Ano"
            type="number"
            placeholder="Ex: 1975"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            erro={erros.ano}
            icone={<Calendar size={18} />}
            min={1900}
            max={new Date().getFullYear() + 1}
            required
          />
        </div>

        {/* Campo: Gênero */}
        <Input
          label="Gênero"
          placeholder="Ex: Rock, Pop, Jazz, etc."
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          erro={erros.genero}
          icone={<Tag size={18} />}
          required
        />

        {/* Campo: URL da Capa */}
        <Input
          label="URL da Capa (opcional)"
          placeholder="https://exemplo.com/capa.jpg"
          value={capaUrl}
          onChange={(e) => setCapaUrl(e.target.value)}
          erro={erros.capaUrl}
          icone={<Image size={18} />}
        />

        {/* Preview da capa */}
        {capaUrl && !erros.capaUrl && (
          <div className="mt-2">
            <p className="text-sm text-dark-300 mb-2">Preview:</p>
            <img
              src={capaUrl}
              alt="Preview da capa"
              className="w-32 h-32 object-cover rounded-lg border border-dark-700"
              onError={(e) => {
                // Se a imagem falhar ao carregar, usa a imagem padrão
                e.currentTarget.src = CAPA_PADRAO;
              }}
            />
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleFechar}
            className="flex-1"
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={salvando}
            className="flex-1"
          >
            {salvando ? 'Salvando...' : musicaEditando ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
