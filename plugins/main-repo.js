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
    return url.startsWith('http://') || url.startsWith('https://');
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
        
        // Default Image Link (Nayi Catbox Image)
        const DEFAULT_IMAGE = 'https://files.catbox.moe/szdeci.jpg';
        const BOT_IMAGE = userConfig?.BOT_IMAGE || userConfig?.BOT_MEDIA_URL || config.BOT_IMAGE || config.BOT_MEDIA_URL || DEFAULT_IMAGE;
        
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

        // Safe Image Handling Logic
        let imagePayload = null;
        const localImagePath = path.join(__dirname, '../lib/HASSANmd.jpg');

        if (isValidImageUrl(BOT_IMAGE)) {
            imagePayload = { url: BOT_IMAGE };
        } else if (fs.existsSync(localImagePath)) {
            imagePayload = fs.readFileSync(localImagePath);
        } else {
            imagePayload = { url: DEFAULT_IMAGE };
        }

        const messageOptions = {
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
        };

        // Send message with image or fallback to plain text
        if (imagePayload) {
            await conn.sendMessage(from, { image: imagePayload, ...messageOptions }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { text: formattedInfo, contextInfo: messageOptions.contextInfo }, { quoted: mek });
        }

    } catch (error) {
        console.error("Error in repo command:", error);
        reply(`❌ Error: ${error.message || "Script fetch nahi ho saki."}`);
    }
});
