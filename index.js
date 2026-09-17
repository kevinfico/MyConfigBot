// index.js - Node Telegram Bot API Version
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { registerHandlers } = require('./bot');

// Inisialisasi bot dengan polling
const bot = new TelegramBot(config.BOT_TOKEN, { 
  polling: true,
  request: {
    timeout: 60000
  }
});

console.log('🤖 Bot Telegram API sedang berjalan...');

// Simpan waktu mulai untuk runtime
const startTime = Date.now();

// Set bot commands
bot.setMyCommands([
  { command: "start", description: "Menu utama" }
]).then(() => {
  console.log("✅ Bot commands berhasil di-set");
}).catch(err => {
  console.error("❌ Gagal set bot commands:", err.message);
});

// Daftar semua handler
registerHandlers(bot, startTime);

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('error', (error) => {
  console.error('Bot error:', error);
});

console.log('✅ Bot berhasil dijalankan dengan Node Telegram Bot API!');

// Send startup notification to owner
try {
  bot.sendMessage(
    config.OWNER_ID, 
    `*✅ Bot Telegram Berhasil Tersambung!*\n\n🤖 *${config.BRAND || "Bot Nokos"}*\n⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n📋 Commands:\n/start - Menu utama\n/owner - Owner panel\n/profile - Cek saldo\n/cancel - Batalkan chat dengan admin`, 
    { parse_mode: "Markdown" }
  );
} catch (error) {
  console.error("Gagal mengirim notifikasi ke owner:", error.message);
}

// Graceful shutdown
process.once("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down...");
  bot.stopPolling();
  process.exit(0);
});

process.once("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down...");
  bot.stopPolling();
  process.exit(0);
});

console.log("🚀 Bot is now running. Press Ctrl+C to stop.");