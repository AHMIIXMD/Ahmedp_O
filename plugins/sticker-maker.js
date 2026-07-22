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
        try {
            // Check karein ke kisi message ka reply kiya gaya hai ya nahi
            if (!mek.quoted) return reply(`*کسی تصویر، ویڈیو، GIF یا اسٹیکر کا ریپلائی کریں!*`);

            const quotedMsg = mek.quoted;
            const mime = quotedMsg.mtype || quotedMsg.mediaType;

            // Media type ki tasdeeq
            const isImage = mime === "imageMessage" || mime === "stickerMessage";
            const isVideo = mime === "videoMessage";

            if (!isImage && !isVideo) {
                return reply("*براہ کرم صرف تصویر، ویڈیو، GIF یا اسٹیکر کا ریپلائی کریں!*");
            }

            // Pack name set karein
            const defaultPackName = userConfig?.STICKER_NAME || config?.STICKER_NAME || "𝐀͢ͱ꧊ϻ͒͜𝛂͜𝛛🚩";
            let pack = q ? q : defaultPackName;

            // Media download karein
            let media = await quotedMsg.download();
            if (!media) return reply("*میڈیا ڈاؤن لوڈ نہیں ہو سکا۔ دوبارہ کوشش کریں!*");

            // Sticker banayein (Yeh Image aur Video dono ko handle karta hai)
            let sticker = new Sticker(media, {
                pack: pack,
                author: config?.AUTHOR_NAME || "Ahmad Tech",
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: crypto.randomBytes(4).toString('hex'),
                quality: 60, // Video jaldi convert karne ke liye quality 60 rakhi hai
                background: 'transparent',
            });

            let stickerBuffer = await sticker.toBuffer();

            // Sticker bhej dein
            return await conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

        } catch (error) {
            console.error("Sticker creation error:", error);
            return reply(`*اسٹیکر بنانے میں خرابی:* ${error.message}`);
        }
    }
);
