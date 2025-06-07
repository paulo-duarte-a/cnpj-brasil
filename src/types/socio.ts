export enum FaixaEtaria {
  NAO_SE_APLICA = 0,
  ATE_12_ANOS = 1,
  DE_13_A_20_ANOS = 2,
  DE_21_A_30_ANOS = 3,
  DE_31_A_40_ANOS = 4,
  DE_41_A_50_ANOS = 5,
  DE_51_A_60_ANOS = 6,
  DE_61_A_70_ANOS = 7,
  DE_71_A_80_ANOS = 8,
  ACIMA_DE_80_ANOS = 9,
}

export enum IdentificadorSocio {
  PESSOA_JURIDICA = 1,
  PESSOA_FISICA = 2,
  ESTRANGEIRO = 3,
}

export const IdentificadorSocioDescricao: Record<IdentificadorSocio, string> = {
  [IdentificadorSocio.PESSOA_JURIDICA]: 'PESSOA JURÍDICA',
  [IdentificadorSocio.PESSOA_FISICA]: 'PESSOA FÍSICA',
  [IdentificadorSocio.ESTRANGEIRO]: 'ESTRANGEIRO',
}

export const FaixaEtariaDescricao: Record<FaixaEtaria, string> = {
  [FaixaEtaria.NAO_SE_APLICA]: 'NÃO SE APLICA',
  [FaixaEtaria.ATE_12_ANOS]: 'ATÉ 12 ANOS',
  [FaixaEtaria.DE_13_A_20_ANOS]: 'DE 13 A 20 ANOS',
  [FaixaEtaria.DE_21_A_30_ANOS]: 'DE 21 A 30 ANOS',
  [FaixaEtaria.DE_31_A_40_ANOS]: 'DE 31 A 40 ANOS',
  [FaixaEtaria.DE_41_A_50_ANOS]: 'DE 41 A 50 ANOS',
  [FaixaEtaria.DE_51_A_60_ANOS]: 'DE 51 A 60 ANOS',
  [FaixaEtaria.DE_61_A_70_ANOS]: 'DE 61 A 70 ANOS',
  [FaixaEtaria.DE_71_A_80_ANOS]: 'DE 71 A 80 ANOS',
  [FaixaEtaria.ACIMA_DE_80_ANOS]: 'ACIMA DE 80 ANOS',
}

/**
 * Qualificação do Representante Legal
 */
export interface QualificacaoRepresentanteLegal {
  codigo: string
  descricao: string
}

/**
 * Representa um Sócio da empresa.
 */
export interface Socio {
  idSocio: number
  cnpjBasico: string
  identificadorSocio: number
  nomeSocio: string
  cpfCnpjSocio: string
  qualificacaoSocio: QualificacaoRepresentanteLegal
  dataEntradaSociedade: string
  paisCodigo: string | null
  representanteLegalCpf: string
  nomeRepresentanteLegal: string | null
  qualificacaoRepresentanteLegal: QualificacaoRepresentanteLegal
  faixaEtaria: number
}

export interface PageableSort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: PageableSort
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface SociosApiResponse {
  content: Socio[]
  pageable: Pageable
  totalElements: number
  totalPages: number
  last: boolean
  size: number // Should match pageSize requested
  number: number // Current page number (0-indexed)
  sort: PageableSort
  numberOfElements: number // Number of elements in the current page
  first: boolean
  empty: boolean
}
