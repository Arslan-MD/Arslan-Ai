const os = require("os");
const settings = require("../settings.js");

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = "";
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === "") time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        // Auto reaction ⚡
        await sock.sendMessage(chatId, { react: { text: "⚡", key: message.key } });

        const start = performance.now();
        const sentMsg = await sock.sendMessage(chatId, { text: "⚙️ *Pinging... Please wait!*" }, { quoted: message });
        const end = performance.now();

        const ping = Math.round(end - start);
        const uptimeFormatted = formatTime(process.uptime());
        const totalRam = (os.totalmem() / (1024 ** 3)).toFixed(2);
        const freeRam = (os.freemem() / (1024 ** 3)).toFixed(2);
        const usedRam = (totalRam - freeRam).toFixed(2);
        const cpu = os.cpus()[0]?.model || "Unknown CPU";
        const platform = `${os.type()} (${os.arch()})`;

        const botInfo = `
╭━〔 ⚡ *${settings.botName || "ARSLAN-AI"} STATUS* ⚡ 〕━━╮
┃ 🤖 *Bot Name:* ${settings.botName || "Arslan-Ai"}
┃ 👑 *Owner:* ${settings.ownerName || "ArslanMD Official"}
┃ 🔖 *Version:* v${settings.version || "2.0"}
┃ ⚡ *Ping:* ${ping} ms
┃ ⏱️ *Uptime:* ${uptimeFormatted}
┃ 💻 *Platform:* ${platform}
┃ 🧠 *CPU:* ${cpu}
┃ 🖥️ *RAM:* ${usedRam} / ${totalRam} GB
┃ 📡 *Mode:* ${settings.mode?.toUpperCase() || "PUBLIC"}
╰━━━━━━━━━━━━━━━╯

* *© 2025 ${settings.botName || "Arslan-Ai"}*
> *Power By ArslanMD Official 🔥*
        `.trim();

        // Stylish message send karein 💫
        await sock.sendMessage(chatId, { text: botInfo }, { quoted: sentMsg });

    } catch (error) {
        console.error("❌ Ping Command Error:", error);
        await sock.sendMessage(chatId, { text: "❌ Error fetching system status! Please try again later." }, { quoted: message });
    }
}

module.exports = pingCommand;
