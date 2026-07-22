// Ahmad Tech 

import { cmd } from '../command.js';
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import config from '../config.js';
import * as StickerMaker from '../lib/sticker-maker.js';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Mega Sticker Command
cmd(
    {
        pattern: 'sticker',
        alias: ['s', 'take', 'rename', 'stake', 'vsticker', 'gsticker', 'g2s', 'gs', 'v2s', 'vs'],
        desc: 'Create stickers from images, videos, GIFs with custom pack names',
        category: 'tools',
        react: "⚡",
        use: '<reply media> | <pack name>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from, userConfig }) => {

        // ✅ FIX: More robust quoted message detection
        const quotedMsg = mek.quoted || quoted;
        if (!quotedMsg) return reply(`*Reply to any Image, Video, GIF, or Sticker*`);

        // ✅ FIX: Handle multiple possible mtype formats
        let mime = quotedMsg.mtype || quotedMsg.type || "";
        
        // Normalize mime — some Baileys versions return full type, some short
        if (mime.includes("image")) mime = "imageMessage";
        else if (mime.includes("video")) mime = "videoMessage";
        else if (mime.includes("sticker")) mime = "stickerMessage";
        
        const defaultPackName = userConfig?.STICKER_NAME || config.STICKER_NAME || "𝐀͢ͱ꧊ϻ͒͜𝛂͜𝛛🚩";
        let pack = q ? q : defaultPackName;
        
        try {
            let media, stickerBuffer;
            
            if (mime === "imageMessage" || mime === "stickerMessage") {
                media = await quotedMsg.download();
                
                let sticker = new Sticker(media, {
                    pack: pack,
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: crypto.randomBytes(4).toString('hex'),
                    quality: 75,
                    background: 'transparent',
                });
                stickerBuffer = await sticker.toBuffer();

            } else if (mime === "videoMessage") {
                // ✅ wa-sticker-formatter handles video natively — no manual conversion needed
                media = await quotedMsg.download();
                
                let sticker = new Sticker(media, {
                    pack: pack,
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: crypto.randomBytes(4).toString('hex'),
                    quality: 75,
                    background: 'transparent',
                });
                stickerBuffer = await sticker.toBuffer();

            } else {
                // ✅ Show what mime was detected — helpful for debugging
                return reply(`*Please reply to an image, video, GIF, or sticker*\n_(Detected type: ${mime || "unknown"})_`);
            }
            
            return conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });
            
        } catch (error) {
            console.error("Sticker creation error:", error);
            return reply(`*Error creating sticker: ${error.message}*`);
        }
    }
);

// attp command with userConfig support
cmd({
    pattern: "attp",
    desc: "Convert text to a GIF sticker.",
    react: "✨",
    category: "tools",
    use: ".attp HI",
    filename: __filename,
}, async (conn, mek, m, { args, reply, userConfig }) => {
    try {
        if (!args[0]) return reply("*Please provide text!*");

        const gifBuffer = await StickerMaker.fetchGif(`https://api-fix.onrender.com/api/maker/attp?text=${encodeURIComponent(args[0])}`);
        const stickerBuffer = await StickerMaker.gifToSticker(gifBuffer);

        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: mek });
    } catch (error) {
        console.error("ATTP error:", error);
        reply(`❌ ${error.message}`);
    }
});
