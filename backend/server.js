import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

console.log("ID fo Cliente carregado no Server:", process.env.BLING_CLIENT_ID);

const app = express();

app.use(cors());
app.use(express.json());

app.post('/auth/bling', async (req, res) => {
    const { code } = req.body;

    const clientId = process.env.BLING_CLIENT_ID;
    const clientSecret = process.env.BLING_CLIENT_SECRET;

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post('https://www.bling.com.br/b/Api/v3/oauth/token',
            {
                grant_type: 'authorization_code',
                code: code
            },
            {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log('Token gerado com  sucesso via Proxy!')
        res.json(response.data);
    } catch (error) {
        console.error("Erro no proxy:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Erro ao trocar token no Bling',
            details: error.response?.data
        });
    }
});

app.get('/api/produtos', async (req, res) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({error: 'Token não fornecido'});

    try {
        const response = await axios.get('https://www.bling.com.br/b/Api/v3/produtos', {
            headers:{ 'Authorization': authHeader}
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({error: 'Erro no Bling'})
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));