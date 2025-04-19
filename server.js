const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// API KEY em Base64
const apiKeyBase64 = 'NTcyMzNkMGEwZTMxYTU1ODdlMTU5ZmRj';

// URL do endpoint SyncPay
const gerarQrCodeUrl = 'https://api.syncpay.pro/v1/gateway/api/';

// Função para gerar QR Code via API
async function gerarQrCode() {
  const payload = {
    amount: "36.90",
    description: "cred amigo"
  };

  const response = await axios.post(gerarQrCodeUrl, payload, {
    headers: {
      'Authorization': `Basic ${apiKeyBase64}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

// Rota principal só pra testar se API tá online
app.get('/', (req, res) => {
  res.send('✅ API Cred Amigo está rodando! Use /checkout pra gerar o QR Code.');
});

// Rota para gerar o QR Code Pix
app.get('/checkout', async (req, res) => {
  try {
    const data = await gerarQrCode();
    res.json({
      status: 'sucesso',
      valor: '36.90',
      descricao: 'cred amigo',
      pix_copiaecola: data.pix_copiaecola,
      qrcode_base64: data.qrcode
    });
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'erro', mensagem: 'Falha ao gerar QR Code' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
