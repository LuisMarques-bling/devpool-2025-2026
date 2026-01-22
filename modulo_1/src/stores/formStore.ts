import { defineStore } from 'pinia'

export const useFormStore = defineStore('form',{
    state: () =>({
        formData: {
            nome: '',
            email: '',
            telefone: '',
            nomeEmpresa: '',
            tamanhoEmpresa: '',
            mensagem: ''
        },
        enviando: false
    }),
    actions:{
        async enviarFormulario(){
            this.enviando = true
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log('Contato enviado com sucesso', this.formData);
            this.enviando = false
            this.limparForm()
        },
        limparForm(){
            this.formData = {
                nome: '',
                email: '',
                telefone: '',
                nomeEmpresa: '',
                tamanhoEmpresa: '',
                mensagem: '',
            }
        }
    }
})