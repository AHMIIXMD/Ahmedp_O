import config from '../config.js';
import { cmd, commands } from '../command.js';
import path from 'path';
import os from "os";
import fs from 'fs';
import { runtime } from '../lib/functions.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function for Premium Small Caps text
const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';
    const smallCapsMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.toLowerCase().split('').map(char => smallCapsMap[char] || char).join('');
};

// --- MINI PAGE / DASHBOARD CATEGORY STYLE ---
const formatCategory = (category, cmds) => {
    const validCmds = cmds.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
    if (validCmds.length === 0) return ''; 
    
    let title = `\n📂 *[ ${category.toUpperCase()} PANEL ]*\n`;
    let body = validCmds.map(cmd => ` ├─⚙️ ${toSmallCaps(cmd.pattern)}`).join('\n');
    return `${title}${body}\n └───────────────────\n`;
};

cmd({
    pattern: "menu",
    alias: ["m", "help", "allmenu"],
    category: "main",
    react: "📊",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const categories = [...new Set(Object.values(commands).map(c => c.category))].filter(Boolean);
        let menuSections = '';
        categories.forEach(cat => {
            const catCmds = Object.values(commands).filter(c => c.category === cat);
            menuSections += formatCategory(cat, catCmds);
        });

        const BOT_NAME = config.BOT_NAME || "AHMAD-MD";
        const uptime = runtime(process.uptime());

        // --- DASHBOARD / PAGE INTERFACE ---
        let dec = `
🖥️ *${BOT_NAME.toUpperCase()} : MINI DASHBOARD*
🌐 *STATUS:* SYSTEM ACTIVE
───────────────────
👤 *CLIENT:* ${pushname || 'User'}
👑 *HOST:* ${config.OWNER_NAME || "Ahmad Hassan"}
⏱️ *UPTIME:* ${uptime}
📊 *TOTAL INDEX:* ${Object.keys(commands).length}
⚙️ *CORE MODE:* ${config.MODE || "Public"}
───────────────────
${menuSections}
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʜᴍᴀᴅ ʜᴀssᴀɴ*`;

        // Image URL Selection
        let imageToUse = "https://files.catbox.moe/ptvl03.jpg";

        // 1. Menu Image Send with Caption
        await conn.sendMessage(from, { 
            image: { url: imageToUse },
            caption: dec, 
            contextInfo: { 
                mentionedJid: [m.sender], 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363426472060176@newsletter', 
                    newsletterName: "AHMADTech", 
                    serverMessageId: 143 
                } 
            } 
        }, { quoted: mek });

        // 2. Audio File Send (As Audio, not Voice Note)
        await conn.sendMessage(from, {
            audio: { url: "https://files.catbox.moe/hoi9ur.mp3" },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: mek });

    } catch (e) { 
        reply(`Error: ${e.message}`); 
    } 
});
    
