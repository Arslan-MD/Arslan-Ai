const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ');

        if (!query) {
            await sock.sendMessage(chatId, {
                react: { text: '❌', key: message.key }
            });
            return await sock.sendMessage(chatId, {
                text: '🎵 *Usage:* `.song song name`\n\n_Example:_ `.song alone alan walker`'
            });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🎶', key: message.key }
        });

        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            await sock.sendMessage(chatId, {
                react: { text: '❌', key: message.key }
            });
            return await sock.sendMessage(chatId, { text: '❌ No results found!' });
        }

        const { title, url, thumbnail, duration, views } = video;
        const audioPath = path.join(__dirname, `ArslanMD_${Date.now()}.mp3`);
        const thumbPath = path.join(__dirname, `thumb_${Date.now()}.jpg`);

        await sock.sendMessage(chatId, {
            text: `🎧 *${title}*\n\n*Duration:* ${duration.timestamp}\n*Views:* ${views.toLocaleString()}\n\n⏳ Downloading...`
        });

        // Thumbnail
        const thumb = await axios.get(thumbnail, { responseType: 'arraybuffer' });
        await fs.writeFile(thumbPath, thumb.data);

        // Audio stream download
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
        const writer = fs.createWriteStream(audioPath);

        await new Promise((resolve, reject) => {
            stream.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send thumbnail preview
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(thumbPath),
            caption: `🎵 *${title}*\n🎬 *Duration:* ${duration.timestamp}\n📈 *Views:* ${views.toLocaleString()}\n🔗 ${url}\n\n🎧 _Powered by Arslan-MD_`
        }, { quoted: message });

        // ✅ Fix: send with correct mimetype
        await sock.sendMessage(chatId, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: message });

        // React success
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });

        fs.unlinkSync(audioPath);
        fs.unlinkSync(thumbPath);

    } catch (err) {
        console.error('[.song] Error:', err);
        await sock.sendMessage(chatId, {
            react: { text: '⚠️', key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: '❌ Failed to download the song. Please try again later.'
        });
    }
}

module.exports = songCommand;
