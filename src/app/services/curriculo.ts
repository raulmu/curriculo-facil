import { Experiencia } from "./experiencia";

export interface Curriculo {
  uid: string;
  identifier: string | null;
  name: string | null;
  email: string | null;
  estado_civil: string | null;
  data_nascimento: string | null;
  nacionalidade: string | null;
  telefone: string | null;
  whatsapp: boolean | null;
  compartilhar: boolean | null;
  cep: string | null;
  rua: string | null;
  bairro: string | null;
  estado: string | null;
  cidade: string | null;
  numero: string | null;
  complemento: string | null;
  escolaridade: string | null;
  descricao_escolaridade: string | null;
  cursos: string[] | null;
  objetivo: string | null;
  experiencias: Experiencia[] | null;
  fotoDataUrl: string;
}
