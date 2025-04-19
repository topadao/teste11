const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const apiKeyBase64 = 'NTcyMzNkMGEwZTMxYTU1ODdlMTU5ZmRj';
const gerarQrCodeUrl = 'https://api.syncpay.pro/v1/gateway/api/';

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

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
