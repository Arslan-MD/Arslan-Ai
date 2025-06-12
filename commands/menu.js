console.log('📥 .menu command triggered');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

async function menuCommand(sock, m, command, prefix, from, pushName) {
    const time = moment().tz('Asia/Karachi').format('hh:mm A');
    const date = moment().tz('Asia/Karachi').format('dddd, MMMM Do YYYY');

    const menuText = `
╭━━━〔 🤖 *Arslan-MD Bot Menu* 〕━━━⬣
┃ 👤 *User:* ${pushName}
┃ 📆 *Date:* ${date}
┃ ⏰ *Time:* ${time}
┃ 🧩 *Prefix:* ${prefix}
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 🎉 Fun & Games 〕─⬣
┃ 🎭 ${prefix}joke
┃ 🎲 ${prefix}truth / dare
┃ 🎯 ${prefix}slot / guess

╭─〔 📥 Downloaders 〕─⬣
┃ 🎧 ${prefix}play [name]
┃ 📸 ${prefix}ig / fb / tiktok
┃ 🖼️ ${prefix}pinterest

╭─〔 🤖 AI Tools 〕─⬣
┃ 🧠 ${prefix}gpt / ai-img
┃ 📚 ${prefix}google / wiki

╭─〔 🧰 Admin & Owner 〕─⬣
┃ 🚫 ${prefix}ban / kick
┃ 👑 ${prefix}promote / demote
┃ ⚙️ ${prefix}setpp / restart

╰━━━━━━━〔 💎 *Arslan-MD v2.0* 〕━━━━━━⬣
`;

    try {
        const gifPath = path.resolve('ArslanMedia/media/menu.gif');
        const voicePath = path.resolve('ArslanMedia/audio/welcome.mp3');

        // Check file existence before reading
        if (!fs.existsSync(gifPath)) throw new Error("menu.gif not found!");
        if (!fs.existsSync(voicePath)) throw new Error("welcome.mp3 not found!");

        await sock.sendMessage(from, {
            video: fs.readFileSync(gifPath),
            gifPlayback: true,
            caption: menuText
        }, { quoted: m });

        await sock.sendMessage(from, {
            audio: fs.readFileSync(voicePath),
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m });

    } catch (err) {
        console.error('❌ Error in menuCommand:', err);
        await sock.sendMessage(from, {
            text: `❌ Menu error: ${err.message}`
        }, { quoted: m });
    }
}

module.exports = menuCommand;
