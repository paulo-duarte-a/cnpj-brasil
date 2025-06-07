export enum PorteEmpresa {
  NAO_INFORMADO = '00',
  MICRO_EMPRESA = '01',
  PEQUENO_PORTE = '03',
  DEMAIS = '05',
}

export const PorteEmpresaDescricao: Record<PorteEmpresa, string> = {
  [PorteEmpresa.NAO_INFORMADO]: 'NÃO INFORMADO',
  [PorteEmpresa.MICRO_EMPRESA]: 'MICRO EMPRESA',
  [PorteEmpresa.PEQUENO_PORTE]: 'EMPRESA DE PEQUENO PORTE',
  [PorteEmpresa.DEMAIS]: 'DEMAIS',
}

export interface NaturezaJuridica {
  codigo: string
  descricao: string
}

export interface Empresa {
  idEmpresa: number
  cnpjBasico: string
  razaoSocial: string
  naturezaJuridicaCodigo: number
  naturezaJuridica: NaturezaJuridica
  qualificacaoResponsavelCodigo: number
  capitalSocial: string
  porteEmpresa: PorteEmpresa
  enteFederativoResponsavel: string
}

export interface Pais {
  codigo: string
  descricao: string
}

export interface Municipio {
  codigo: string
  descricao: string
}

export interface CnaeFiscalPrincipal {
  codigo: string
  descricao: string
}

export interface Establishment {
  idEstabelecimentointeger: number
  cnpjBasico: string
  cnpjOrdem: string
  cnpjDv: string
  identificadorMatrizFilial: number
  nomeFantasia: string
  situacaoCadastral: number
  dataSituacaoCadastral: string
  motivoSituacaoCadastralCodigo: string
  nomeCidadeExterior: string
  paisCodigo: string
  pais: Pais
  dataInicioAtividade: string
  cnaeFiscalPrincipalCodigo: string
  cnaeFiscalPrincipal: CnaeFiscalPrincipal
  cnaeFiscalSecundaria: string
  cnaeFiscalSecundariaLista: CnaeFiscalPrincipal[]
  tipoLogradouro: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  uf: string
  municipioCodigo: string
  municipio: Municipio
  ddd1: string
  telefone1: string
  ddd2: string
  telefone2: string
  dddFax: string
  fax: string
  correioEletronico: string
  situacaoEspecial: string
  dataSituacaoEspecial: string
  empresa: Empresa
}

export interface EstablishmentResponse {
  data: Array<Establishment>
  lastId: number
  hasNext: boolean
}

export interface EstablishmentState {
  establishmentData: EstablishmentResponse | null
  isLoading: boolean
  cnae: string | null
  cnpjBasico: string | null
  nomeFantasia: string | null
}

export interface EstablishmentFilter {
  pageSize?: number
  cnae?: string | null
  cnpj?: string | null
  nomeFantasia?: string | null
  filter?: boolean
}
