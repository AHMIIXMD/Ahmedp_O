// King

import { cmd, commands } from '../command.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Fixed the double https:// typo here
const API_BASE_URL = 'https://hasan-md-bot.vercel.app/api'; 

// Function to get status emoji based on count
function getCountStatus(count) {
    if (count === 30) return '🔴'; // Full
    if (count >= 24) return '🟣'; // 24-29
    if (count >= 18) return '🟡'; // 18-23
    if (count >= 12) return '🟠'; // 12-17
    if (count >= 6) return '🔵'; // 6-11
    return '🟢'; // 0-5
}

cmd({
    pattern: "status",
    alias: ["serverstatus", "stats", "servers"],
    react: "📊",
    desc: "Check server status and active users",
    category: "owner",
    use: ".status",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Show processing message
        await reply("📡 Checking server status...");

        // Fetch servers list from your Vercel API
        const serversResponse = await axios.get(`${API_BASE_URL}/servers`, { timeout: 5000 });
        
        if (!serversResponse.data || !serversResponse.data.servers) {
            return reply("❌ Failed to fetch server list.");
        }

        const servers = serversResponse.data.servers;
        let serverStatus = [];
        let totalActive = 0;
        let totalLimit = 0;
        let onlineServers = 0;
        let offlineServers = 0;
        
        // Check each server status through your Vercel API
        for (let i = 0; i < servers.length; i++) {
            const server = servers[i];
            
            try {
                // Get status from your Vercel API
                const statusResponse = await axios.get(`${API_BASE_URL}/status/${server.id}`, { timeout: 5000 });
                
                if (statusResponse.data && !statusResponse.data.error) {
                    const count = statusResponse.data.count || 0;
                    const limit = statusResponse.data.limit || 30;
                    const statusEmoji = getCountStatus(count);
                    
                    serverStatus.push({
                        server: server.id,
                        name: server.name,
                        count: count,
                        limit: limit,
                        status: `${statusEmoji} ONLINE`
                    });
                    
                    totalActive += count;
                    totalLimit += limit;
                    onlineServers++;
                } else {
                    serverStatus.push({
                        server: server.id,
                        name: server.name,
                        count: 0,
                        limit: 30,
                        status: '🟡 NO DATA'
                    });
                    offlineServers++;
                }
            } catch (error) {
                serverStatus.push({
                    server: server.id,
                    name: server.name,
                    count: 0,
                    limit: 30,
                    status: '🔴 OFFLINE'
                });
                offlineServers++;
            }
        }

        // Create status message
        let statusMessage = `╭──「 *HASAN-MD SERVER STATUS* 」\n│\n`;
        statusMessage += `│ *📊 Overview*\n`;
        statusMessage += `│ Total: ${servers.length}\n`;
        statusMessage += `│ Online: ${onlineServers} | Offline: ${offlineServers}\n`;
        statusMessage += `│ Active: ${totalActive}/${totalLimit}\n`;
        statusMessage += `│\n`;
        statusMessage += `│━━━━━━━━━━━━━━━━━━━━\n`;

        // Add each server status
        serverStatus.forEach((s) => {
            let statusIcon = s.status.split(' ')[0];
            let statusText = s.status.split(' ')[1];
            statusMessage += `│ ${s.name.padEnd(8)}: ${s.count.toString().padStart(2)}/${s.limit} ${statusIcon} ${statusText}\n`;
        });

        statusMessage += `╰─────────────────`;

        // Send status report
        await reply(statusMessage);

    } catch (error) {
        console.error("Status command error:", error);
        await reply("❌ Error checking server status. Make sure your API is running.");
    }
});
