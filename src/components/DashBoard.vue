<script setup lang="ts">
import api from '@/utils/axios'
import { useEstablishmentStore } from '@/stores/establishment'
import type { Establishment, EstablishmentFilter } from '@/types/establishment'
import { PorteEmpresaDescricao } from '@/types/establishment'
import type { FieldsetToggleEvent } from 'primevue'
import { onMounted, ref } from 'vue'
import type { SociosApiResponse } from '@/types/socio'
import type { PageCnae } from '@/types/cnae'

const store = useEstablishmentStore()
const pageSize = ref(10)
const loadingSocios = ref(false)
const sociosCache = ref<{ [key: string]: SociosApiResponse }>({})

const selectedItem = ref<{ id: number; name: string } | null>(null)
const items = ref<{ id: number; name: string }[]>([])
const loadingCnae = ref(false)
const page = ref(0)
const limit = ref(30)
const lastFilter = ref('')
// const totalRecords = ref(0)

const cnpjFilter = ref<string | null>(null)
const nomeFantasia = ref<string | null>(null)

onMounted(() => {
  const filter: EstablishmentFilter = {
    pageSize: pageSize.value,
    cnae: selectedItem.value ? selectedItem.value.id.toString() : ''
  }
  store.fetchEstablishments(filter)
  loadItems()
})

const loadMore = () => {
  const filter: EstablishmentFilter = {
    pageSize: pageSize.value,
    cnae: selectedItem.value ? selectedItem.value.id.toString() : ''
  }
  store.fetchEstablishments(filter)
}

const loadMoreFilter = () => {
  const filter: EstablishmentFilter = {
    pageSize: pageSize.value,
    cnae: selectedItem.value ? selectedItem.value.id.toString() : '',
    cnpj: cnpjFilter.value ? cnpjFilter.value.replace(/\D/g, '').slice(0, 8) : '',
    nomeFantasia: nomeFantasia.value ? nomeFantasia.value : '',
    filter: true
  }
  store.fetchEstablishments(filter)
}

const loadSocios = async (est: Establishment) => {
  if (sociosCache.value[est.cnpjBasico]) {
    return
  }
  loadingSocios.value = true
  try {
    const response = await api.get<SociosApiResponse>('/socios', {
      params: {
        page: 0,
        size: 30,
        sort: 'idSocio',
        'qualificacaoSocio.dir': 'desc',
        cnpjBasico: est.cnpjBasico
      }
    })
    sociosCache.value[est.cnpjBasico] = response.data
  } catch (e) {
    console.error(e)
  } finally {
    loadingSocios.value = false
  }
}

const onSociosToggle = (e: FieldsetToggleEvent, est: Establishment) => {
  if (!e.value) {
    loadSocios(est)
  }
}

const formatCnpjBase = (cnpj: string): string => {
  if (cnpj.length !== 8) return cnpj
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}`
}

const formatCnpj = (est: Establishment): string => {
  return `${formatCnpjBase(est.cnpjBasico)} / ${est.cnpjOrdem} - ${est.cnpjDv}`
}

const getLegend = (est: Establishment): string => {
  return est.nomeFantasia || est.empresa.razaoSocial || formatCnpj(est)
}

const loadItems = async (isNewFilter = false) => {
  if (loadingCnae.value) return;
  loadingCnae.value = true;

  if (isNewFilter) {
    page.value = 0;
    items.value = [];
  }

  const response = await api.get<PageCnae>('/cnaes', {
    params: {
      page: page.value,
      size: limit.value,
      sort: 'codigo',
      descricao: lastFilter.value
    }
  })

  items.value.push(...response.data.content.map((item) => ({ id: Number(item.codigo), name: item.descricao })));

  loadingCnae.value = false;
};

const onLazyLoad = () => {
  if (loadingCnae.value) return;

  page.value++;
  loadItems();
};

const onFilter = (event: { value: string }) => {
  if ((event.value || '').length <= 2) {
    return;
  }
  lastFilter.value = event.value || ''
  loadItems(true)
};
</script>

<template>
  <div v-if="store.establishmentData" class="p-m-2 establishment-container">
    <!-- Filtros -->
    <div class="p-grid">

      <div class="p-col-12 card">

        <Fieldset legend="Filtros" :toggleable="true" :collapsed="true">

          <div>

            <div class="card flex justify-center">

              <InputText v-keyfilter.num v-model="cnpjFilter" placeholder="CPNJ" fluid />

            </div>

          </div>

          <div>

            <div class="card flex justify-center">

              <InputGroup>

                <InputGroupAddon>

                  <i class="pi pi-user"></i>

                </InputGroupAddon>

                <InputText v-model="nomeFantasia" placeholder="Nome Fantasia" />

              </InputGroup>

            </div>

          </div>

          <div>

            <Select v-model="selectedItem" :options="items" optionLabel="name" placeholder="Atividade Econômica"
              :loading="loadingCnae" :virtualScrollerOptions="{ lazy: true, onLazyLoad: onLazyLoad, itemSize: 38 }"
              @filter="onFilter" filter fluid showClear>
              <template #option="slotProps">

                <div>{{ slotProps.option.name }}</div>

              </template>

              <template #footer>

                <div v-if="loadingCnae">
                  Carregando mais itens...
                </div>

              </template>

            </Select>

          </div>

          <Button :disabled="store.isLoading" label="Pesquisar"
            :icon="store.isLoading ? 'pi pi-spinner' : 'pi pi-search'" iconPos="right" @click="loadMoreFilter" />

        </Fieldset>

      </div>

    </div>

    <!-- Lista de Estabelecimentos -->
    <div class="p-grid">

      <div v-for="est in store.establishmentData.data" :key="est.idEstabelecimentointeger"
        class="p-col-12 p-md-6 p-lg-4 card">

        <Fieldset>

          <template #legend>

            <div>
              {{ getLegend(est) }}
            </div>

          </template>

          <div class="p-grid p-dir-col p-ai-start">

            <Fieldset>

              <template #legend>
                Situação Cadastral
              </template>

              <div>

                <span v-if="est.situacaoCadastral == 2" class="p-text-success" style="color: green;">
                  <i class="pi pi-shield"></i> Ativa
                </span>

                <span v-else-if="est.situacaoCadastral == 3" class="p-text-warning" style="color: orange;">
                  <i class="pi pi-exclamation-circle"></i> Suspensa
                </span>

                <span v-else-if="est.situacaoCadastral == 4" class="p-text-warning" style="color: orange;">
                  <i class="pi pi-exclamation-circle"></i> Inapta
                </span>

                <span v-else-if="est.situacaoCadastral == 1" class="p-text-danger" style="color: red;">
                  <i class="pi pi-ban"></i> Nula
                </span>

                <span v-else-if="est.situacaoCadastral == 8" class="p-text-danger" style="color: red;">
                  <i class="pi pi-ban"></i> Baixada
                </span>

                <span>{{ formatCnpj(est) }}</span>

              </div>

              <div>

                <span>
                  <i class="pi pi-calendar"></i>
                  {{ est.dataInicioAtividade }} -
                  <span v-if="est.situacaoCadastral != 2">
                    {{ est.dataSituacaoCadastral }}
                  </span>

                  <span v-else>Presente</span>

                </span>

                <span v-if="est.situacaoEspecial">
                  Situação especial: {{ est.situacaoEspecial }} em {{ est.dataSituacaoCadastral }}
                </span>

              </div>

              <div>
                Natureza Jurídica: {{ est.empresa.naturezaJuridica.descricao }}
              </div>

              <div>
                Capital Social: {{ est.empresa.capitalSocial }}
              </div>

              <div>
                Porte da Empresa: {{ PorteEmpresaDescricao[est.empresa.porteEmpresa] }}
              </div>

            </Fieldset>

            <Fieldset>
              <template #legend>
                <span v-if="est.identificadorMatrizFilial == 1">Matriz</span>
                <span v-else-if="est.identificadorMatrizFilial == 2">Filial</span>
              </template>
              <div>
                <span>
                  {{ est.tipoLogradouro }} {{ est.logradouro }}, {{ est.numero }} -
                  {{ est.bairro }} - {{ est.municipio.descricao }} - {{ est.uf }} - {{ est.cep }}
                </span>
              </div>
              <div>
                <span>{{ est.complemento }}</span>
              </div>
            </Fieldset>

            <Fieldset legend="Dados de Contato">
              <div v-if="est.correioEletronico">
                <span>Email: {{ est.correioEletronico }}</span>
              </div>
              <div v-if="est.ddd1 && est.telefone1">
                <span>({{ est.ddd1 }}) {{ est.telefone1 }}</span>
              </div>
              <div v-if="est.ddd2 && est.telefone2">
                <span>({{ est.ddd2 }}) {{ est.telefone2 }}</span>
              </div>
            </Fieldset>

            <Fieldset legend="Atividades Econômicas">
              <div>
                <strong>Principal:</strong> {{ est.cnaeFiscalPrincipal.descricao }}
              </div>
              <div>
                <Fieldset legend="Atividade Secundária" :toggleable="true" :collapsed="true">
                  <ul v-if="est.cnaeFiscalSecundariaLista && est.cnaeFiscalSecundariaLista.length">
                    <li v-for="atividade in est.cnaeFiscalSecundariaLista" :key="atividade.codigo">
                      {{ atividade.descricao }}
                    </li>
                  </ul>
                  <p v-else>Nenhuma atividade secundária encontrada.</p>
                </Fieldset>
              </div>
            </Fieldset>

            <Fieldset legend="Socios" :toggleable="true" :collapsed="true"
              :toggleButtonProps="{ 'aria-label': 'toggle-socios' }" @toggle="(event) => onSociosToggle(event, est)">
              <div v-if="sociosCache[est.cnpjBasico]">
                <div v-if="!sociosCache[est.cnpjBasico].content || sociosCache[est.cnpjBasico].content.length === 0">
                  <span>Esta empresa não possui sócios.</span>
                </div>
                <ul v-else>
                  <li v-for="(socio, index) in sociosCache[est.cnpjBasico].content" :key="index">
                    {{ socio.qualificacaoSocio.descricao }} - {{ socio.nomeSocio }}
                  </li>
                </ul>
              </div>
              <div v-if="!sociosCache[est.cnpjBasico]" class="p-mt-2 loading-container">
                <ProgressSpinner />
              </div>
            </Fieldset>
          </div>
        </Fieldset>
      </div>
    </div>

    <!-- Carregar Mais -->
    <div v-if="store.isLoading" class="p-mt-2 loading-container">
      <ProgressSpinner />
    </div>
    <div class="p-text-center p-mt-2 load-more">
      <Button @click="loadMore" :disabled="store.isLoading">Carregar Mais</Button>
    </div>
  </div>

  <div v-else class="p-text-center p-m-2 loading-container">
    <div v-if="store.isLoading">
      <ProgressSpinner />
    </div>
    <p v-else>Nenhum estabelecimento encontrado</p>
  </div>
</template>

<style scoped>
.establishment-container .card {
  font-size: 16px;
  margin-bottom: 5dvw;
  line-height: 2rem;
}

.establishment-container fieldset {
  margin-bottom: 1dvw;
}

.load-more,
.loading-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
