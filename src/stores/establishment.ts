import { defineStore } from 'pinia'
import api from '@/utils/axios'
import type {
  EstablishmentState,
  EstablishmentResponse,
  EstablishmentFilter,
} from '@/types/establishment'

export const useEstablishmentStore = defineStore('establishment', {
  state: (): EstablishmentState => ({
    establishmentData: null,
    isLoading: false,
    cnae: null,
    cnpjBasico: null,
    nomeFantasia: null,
  }),

  actions: {
    async fetchEstablishments(filterParam: EstablishmentFilter) {
      try {
        this.isLoading = true

        if (filterParam.filter && this.establishmentData) {
          this.establishmentData.lastId = 0
          this.cnae = null
          this.cnpjBasico = null
          this.nomeFantasia = null
        }

        const params: {
          lastId: number
          limit?: number
          cnaeFiscalPrincipalCodigo?: string
          cnpjBasico?: string
          nomeFantasia?: string
        } = {
          lastId: this.establishmentData?.lastId || 0,
        }

        if (filterParam.pageSize) {
          params.limit = filterParam.pageSize
        }

        if (filterParam.cnae) {
          params.cnaeFiscalPrincipalCodigo = filterParam.cnae
        } else if (this.cnae) {
          params.cnaeFiscalPrincipalCodigo = this.cnae
        }

        if (filterParam.cnpj && filterParam.cnpj.length >= 8) {
          params.cnpjBasico = filterParam.cnpj
        } else if (this.cnpjBasico) {
          params.cnpjBasico = this.cnpjBasico
        }

        if (filterParam.nomeFantasia && filterParam.nomeFantasia.length >= 3) {
          params.nomeFantasia = filterParam.nomeFantasia
        } else if (this.nomeFantasia) {
          params.nomeFantasia = this.nomeFantasia
        }

        const response = await api.get<EstablishmentResponse>('/estabelecimentos/scroll', {
          params,
        })

        if (
          this.establishmentData &&
          this.cnae == params.cnaeFiscalPrincipalCodigo &&
          this.cnpjBasico == params.cnpjBasico &&
          this.nomeFantasia == params.nomeFantasia
        ) {
          this.establishmentData.data = [...this.establishmentData.data, ...response.data.data]
          this.establishmentData.lastId = response.data.lastId
          this.establishmentData.hasNext = response.data.hasNext
        } else {
          this.establishmentData = response.data
          this.cnae = params.cnaeFiscalPrincipalCodigo ?? null
          this.cnpjBasico = params.cnpjBasico ?? null
          this.nomeFantasia = params.nomeFantasia ?? null
        }
      } catch (error) {
        console.error('API Error:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
