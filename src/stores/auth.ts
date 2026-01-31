import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        clientId: import.meta.env.VITE_BLING_CLIENT_ID,
        accessToken: localStorage.getItem('access_token') || null,
        refreshToken: localStorage.getItem('refresh_token'),
        isAuthenticated: !!localStorage.getItem('access_token'),
    }),
    actions: {

        generateState(){
            const hash = Math.random().toString(36).substring(2,15);
            sessionStorage.setItem('oauth_state', hash);
            return hash;
        },

        async exchangeCodeForToken(code: string, stateReceived: string) {

            const savedState = sessionStorage.getItem('oauth_state');
            if (!stateReceived || stateReceived !== savedState){
                throw new Error("State inválido!")
            }
            
            try {
                const response = await axios.post('http://localhost:3000/auth/bling',{
                    code: code
                });

                this.accessToken = response.data.access_token;
                this.refreshToken = response.data.refresh_token;
                this.isAuthenticated = true;

                localStorage.setItem('access_token', this.accessToken!);
                localStorage.setItem('refresh_token', this.refreshToken!)
                sessionStorage.removeItem('oauth_state');

                return response.data;
            } catch (error) {
                this.logout();
                throw error;
            }
        },
        logout(){
            this.accessToken = null;
            this.refreshToken = null;
            this.isAuthenticated = false;
            localStorage.clear();
        }
    }
})