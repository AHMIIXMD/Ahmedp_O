
// AHMAD Tech

import config from '../config.js';
import { cmd, commands } from '../command.js';
import os from "os";
import { runtime, sleep } from '../lib/functions.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function for small caps text
const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';
    const smallCapsMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.toLowerCase().split('').map(char => smallCapsMap[char] || char).join('');
};

const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    const urlLower = url.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => urlLower.endsWith(ext));
};

cmd({
    pattern: "repo",
    alias: ["sc", "script", "repository", "deploy"],
    desc: "Get HASSAN-MD deploy link and information",
    react: "📂",
    category: "main",
    filename: __filename,
},
async (conn, mek, m, { from, reply, userConfig }) => {
    try {
        const BOT_NAME = userConfig?.BOT_NAME || config.BOT_NAME || 'AHMAD-MD';
        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || 'AHMAD HASSAN';
        const BOT_IMAGE = userConfig?.BOT_IMAGE || userConfig?.BOT_MEDIA_URL || config.BOT_IMAGE || config.BOT_MEDIA_URL;
        
        const deployLink = 'https://hassanxmd.vercel.app';

        // --- MATCHED MODERN UI DESIGN ---
        const formattedInfo = `
✨ *${BOT_NAME.toUpperCase()}* ✨

*╭══════════════════⊷*
*│ 📂 sᴄʀɪᴘᴛ:* HASSAN-MD
*│ 👤 ᴏᴡɴᴇʀ:* ${OWNER_NAME}
*│ 📦 ᴠᴇʀsɪᴏɴ:* 1.0.0
*│ ⚡ ᴇɴɢɪɴᴇ:* Node.js / Baileys
*│ ⏳ ᴜᴘᴛɪᴍᴇ:* ${runtime(process.uptime())}
*╰══════════════════⊷*

*╭══════════════════⊷*
*│ 🔗 ᴘᴀɪʀɪɴɢ ʟɪɴᴋ:*
*│* ${deployLink}
*│*
*│ 📑 ɪɴsᴛʀᴜᴄᴛɪᴏɴs:*
*│ 1.* Click link above
*│ 2.* Enter phone number
*│ 3.* Link in Linked Devices
*╰══════════════════⊷*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${toSmallCaps(OWNER_NAME)}*`.trim();

        let imageToUse;
        const localImagePath = path.join(__dirname, '../lib/HASSANmd.jpg');
        
        if (isValidImageUrl(BOT_IMAGE)) {
            try {
                await axios.head(BOT_IMAGE, { timeout: 3000 });
                imageToUse = BOT_IMAGE;
            } catch (e) {
                imageToUse = localImagePath;
            }
        } else {
            imageToUse = localImagePath;
        }

        await conn.sendMessage(from, {
            image: { url: imageToUse },
            caption: formattedInfo,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363427595490126@newsletter',
                    newsletterName: `${BOT_NAME} - OFFICIAL`,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in repo command:", error);
        reply("❌ Error: Script fetch nahi ho saki.");
    }
});
        
