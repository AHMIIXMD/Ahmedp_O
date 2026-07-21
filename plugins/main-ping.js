import { fileURLToPath } from 'url';
import config from '../config.js';
import { cmd, commands } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

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

// --- PING COMMAND (MODERN UI) ---
cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['⚡', '🚀', '🎯', '✨', '💎'];
        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

        // Quick reaction
        await conn.sendMessage(from, {
            react: { text: reactionEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;
        
        const BOT_NAME = config.BOT_NAME || "AHMAD-MD";
        const OWNER_NAME = config.OWNER_NAME || "AHMAD HASSAN";

        // Ultra Sleek Text Design WITH ROYAL MATCH
        const text = `
*✨ ${BOT_NAME.toUpperCase()} ✨*

*╭══════════════════⊷*
*│ ⚡ ᴘᴏɴɢ...!!* 📡
*│ 🚀 sᴘᴇᴇᴅ:* ${responseTime.toFixed(2)}ms
*│ 🧬 sᴛᴀᴛᴜs:* Online
*╰══════════════════⊷*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${toSmallCaps(OWNER_NAME)}*`;

        await conn.sendMessage(from, {
            text: text.trim(),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363427595490126@newsletter',
                    newsletterName: "AHMADTech",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});

// --- PING2 COMMAND (DASHBOARD UI) ---
cmd({
    pattern: "ping2",
    desc: "Check bot's response time with dashboard view.",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 500));
        const endTime = Date.now();
        const ping = endTime - startTime;

        let status;
        let indicator;
        if (ping < 1000) {
            status = "ᴇxᴄᴇʟʟᴇɴᴛ";
            indicator = "🟢";
        } else if (ping < 1500) {
            status = "ɢᴏᴏᴅ";
            indicator = "🟡";
        } else {
            status = "ʟᴀɢɢʏ";
            indicator = "🔴";
        }

        const BOT_NAME = config.BOT_NAME || "AHMAD-MD";
        const OWNER_NAME = config.OWNER_NAME || "AHMAD HASSAN";

        // Dashboard Style Design MATCHED TO MENU
        const msg = `
*✨ ${BOT_NAME.toUpperCase()} ✨*

*╭══════════════════⊷*
*│ 📡 LATENCY:* ${ping} ms
*│ 🧠 QUALITY:* ${status.toUpperCase()} ${indicator}
*│ ⚡ PERFORMANCE:* Stable
*│ 🛰️ SERVER:* Global-High
*╰══════════════════⊷*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${toSmallCaps(OWNER_NAME)}*`;

        await conn.sendMessage(from, { 
            text: msg.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363427595490126@newsletter',
                    newsletterName: "HASSAN TECH🚩",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
                    
