import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth.ts";

export interface Produto {
    id: number;
    nome: string;
    codigo: string;
    preco: number | null;
    situacao: string;
    unidade: string;
}

interface Filtros {
    pagina: number;
    situacao: string;
    pesquisa: string;
    dataInicio: string;
    dataFim: string
}


export const useProdutoStore = defineStore('produto', {
    state: () => ({
        produtos: [] as Produto[],
        filtros: {
            pagina: 1,
            situacao: 'U',
            pesquisa: '',
            dataInicio: '',
            dataFim: '',
        } as Filtros,
        carregando: false,
        temMais: true
    }),

    actions: {
        setFiltros(novosFiltros: Partial<Filtros>) {
            this.filtros = { ...this.filtros, ...novosFiltros };
        },

        resetFiltros() {
            this.filtros = {
                pagina: 1,
                situacao: 'U',
                pesquisa: '',
                dataInicio: '',
                dataFim: '',
            };
            this.produtos = [];
            this.temMais = true;
        },

        async buscarProdutos(paginaForcada?: number) {
            this.carregando = true;

            if (paginaForcada !== undefined) {
                this.filtros.pagina = paginaForcada;
            }

            try {
                const authStore = useAuthStore();

                const params: any = {
                    pagina: this.filtros.pagina,
                    pesquisa: this.filtros.pesquisa,
                    situacao: this.filtros.situacao,
                };

                if (this.filtros.dataInicio) params.dataInicial = this.filtros.dataInicio;
                if (this.filtros.dataFim) params.dataFinal = this.filtros.dataFim;

                const response = await axios.get('http://localhost:3000/api/produtos', {
                    params,
                    headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
                });

                const listaRetornada = response.data.data || [];

                if (listaRetornada.length === 0 && this.filtros.pagina > 1) {
                    this.filtros.pagina--;
                    this.temMais = false;
                    alert('Você já está na última página.')
                } else {
                    this.produtos = listaRetornada;
                    this.temMais = listaRetornada.length >= 10;
                }

            } catch (error: any) {
                alert('Erro ao buscar produtos na Store' + (error.response?.data.message || 'Erro de conexão'));
                throw error;
            } finally {
                this.carregando = false
            }
        }
    },
})