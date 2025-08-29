import fetch from 'node-fetch';
import cron from 'cron';

const { CronJob } = cron;

const webhookTokenURL = 'https://discord.com/api/webhooks/1411004243405701330/vkvEVrs0WXeoEGt1eAc_h8PZuLcTS7u9rZI_p9QJMVNZtG1c5Bu7yhUi6B0WgLR1Nfh9';
const secret = '🔐MiClaveSecreta';


function generateDailyToken() {
  const today = new Date().toISOString().slice(0, 10);
  return Buffer.from(today + secret).toString('base64');
}

function sendTokenToDiscord() {
  const token = generateDailyToken();

  const embed = {
    title: '**Token nuevo**',
  description: `\`\`\`${token}\`\`\``,
  color: 0x5865F2,
  timestamp: new Date().toISOString(),
  footer: {
    text: 'Token generado automáticamente'
  }
  };

  const payload = {
    embeds: [embed]
  };
console.log('Enviando token a Discord:', token);
console.log('Cron job iniciado');
  fetch(webhookTokenURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(() => console.log('✅ Token enviado como embed:', token))
    .catch(err => console.error('❌ Error al enviar token:', err));
}

// Ejecutar cada día a las 00:01 (hora de España)
const job = new CronJob('1 0 * * *', sendTokenToDiscord, null, true, 'Europe/Madrid');
job.start();

if (process.argv.includes('--manual')) {
  sendTokenToDiscord();
}
