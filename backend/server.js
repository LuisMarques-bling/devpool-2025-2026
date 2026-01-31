import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

const getBlingToken = (req) => {
    const authHeader = req.headers.authorization;
    return authHeader ? authHeader.replace('Bearer', '').trim() : '';
}

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
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao obter token do Bling:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao obter token do Bling' });
    }
});

app.get('/api/produtos', async (req, res) => {
    const token = getBlingToken(req);
    const { pagina, pesquisa, situacao, dataInicial, dataFinal } = req.query;

    try {

        const params = {
            pagina: Number(pagina || 1),
            limite: 10
        };

        if (pesquisa && pesquisa.trim() !== "") {
            const termo = pesquisa.trim();

            const eProvavelSKU = !termo.includes(' ') && (/\d/.test(termo) || termo.length <= 4);

            if (eProvavelSKU) {
                params.codigo = termo;
                console.log(`Buscando por SKU: ${termo}`);
            } else {
                params.nome = termo;
                console.log(`Buscando por Nome: ${termo}`);
            }
        }

        if (situacao === 'A') params.criterio = 2;
        else if (situacao === 'I') params.criterio = 3;
        else if (situacao === 'E') params.criterio = 4;

        if (dataInicial && dataInicial !== "") params.dataAlteracaoInicial = dataInicial;
        if (dataFinal && dataFinal !== "") params.dataAlteracaoFinal = dataFinal;

        const response = await axios.get('https://api.bling.com.br/Api/v3/produtos', {
            params,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: 'Erro no Bling' })
    }
});

app.post('/api/produtos', async (req, res) => {
    const token = getBlingToken(req);

    try {
        const response = await axios.post('https://api.bling.com.br/Api/v3/produtos', req.body, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

app.delete('/api/produtos/:id', async (req, res) => {
    const token = getBlingToken(req);

    const { id } = req.params;

    try {
        await axios.patch(`https://api.bling.com.br/Api/v3/produtos/${id}/situacoes`,
            { situacao: 'E' },
            {
                headers: { 'Authorization': `Bearer ${token}`, }
            });

        res.status(204).send();
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

app.get('/api/produtos/:id', async (req, res) => {
    const token = getBlingToken(req);
    const { id } = req.params;

    try {
        const response = await axios.get(`https://api.bling.com.br/Api/v3/produtos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

app.put('/api/produtos/:id', async (req, res) => {
    const token = getBlingToken(req);
    const { id } = req.params;

    try {
        const response = await axios.put(`https://api.bling.com.br/Api/v3/produtos/${id}`, req.body, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));