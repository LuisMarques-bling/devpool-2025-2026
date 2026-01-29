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

app.get('/api/produtos', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

    const { pagina, pesquisa, situacao, dataInicial, dataFinal } = req.query;
    const token = authHeader.replace('Bearer', '').trim();

    try {

        const params = {
            pagina: Number(pagina || 1),
            limite: 10
        };

        if (pesquisa && pesquisa.trim() !== "") {
            const termo = pesquisa.trim();

            const eProvavelSKU = !termo.includes(' ') && (/\d/.test(termo) || termo.length <= 6);

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
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

    const token = authHeader.replace('Bearer', '').trim();

    try {
        const response = await axios.post('https://api.bling.com.br/Api/v3/produtos', req.body, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        res.status(201).json(response.data);
    } catch (error) {
        console.error("Erro ao cadastrar no Bling:", error.response?.data);
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

app.delete('/api/produtos/:id', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

    const { id } = req.params;

    const token = authHeader.replace('Bearer', '').trim();

    try {
        await axios.patch(`https://api.bling.com.br/Api/v3/produtos/${id}/situacoes`,
            { situacao: 'E' },
            {
                headers: { 'Authorization': `Bearer ${token}`, }
            });

        console.log(`Produto ${id} excluido com sucesso no Bling`)
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar:", error.response?.data);
        res.status(error.response?.status || 500).json({
            message: 'Erro ao excluir no Bling',
            detalhes: error.response?.data || error.message
        });
    }
});

app.get('/api/produtos/:id', async (req, res) => {
    const authHeader = req.headers.authorization;
    const { id } = req.params;
    const token = authHeader.replace('Bearer', '').trim();

    try {
        const response = await axios.get(`https://api.bling.com.br/Api/v3/produtos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar produto:", error.response?.data);
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

app.put('/api/produtos/:id', async (req, res) => {
    const authHeader = req.headers.authorization;
    const { id } = req.params;
    const token = authHeader.replace('Bearer', '').trim();

    try {
        const response = await axios.put(`https://api.bling.com.br/Api/v3/produtos/${id}`, req.body, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao editar produto:", error.response?.data);
        res.status(error.response?.status || 500).json(error.response?.data);
    }
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));