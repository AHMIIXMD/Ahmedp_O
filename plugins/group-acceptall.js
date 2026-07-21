import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
  pattern: "acceptall",
  alias: ["approveall", "allowall"],
  desc: "Accepts all pending group join requests",
  category: "group",
  react: "✅",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  reply
}) => {
  try {
    if (!isGroup) return await reply("⚠️ This command only works in groups.");
    if (!isBotAdmins) return await reply("❌ I must be admin to accept join requests.");
    if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
      return await reply("ℹ️ No pending join requests to accept.");
    }

    const jids = requests.map(u => u.jid);
    await conn.groupRequestParticipantsUpdate(from, jids, "approve");
    
    await reply(`✅ Successfully accepted ${requests.length} join request${requests.length > 1 ? 's' : ''}.`);

  } catch (err) {
    console.error(err);
    await reply("❌ Failed to accept join requests.");
  }
});

cmd({
  pattern: "rejectall",
  alias: ["declineall", "denyall"],
  desc: "Rejects all pending group join requests",
  category: "group",
  react: "❌",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  reply
}) => {
  try {
    if (!isGroup) return await reply("⚠️ This command only works in groups.");
    if (!isBotAdmins) return await reply("❌ I must be admin to reject join requests.");
    if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
      return await reply("ℹ️ No pending join requests to reject.");
    }

    const jids = requests.map(u => u.jid);
    await conn.groupRequestParticipantsUpdate(from, jids, "reject");
    
    await reply(`✅ Successfully rejected ${requests.length} join request${requests.length > 1 ? 's' : ''}.`);

  } catch (err) {
    console.error(err);
    await reply("❌ Failed to reject join requests.");
  }
});

cmd({
  pattern: "requests",
  alias: ["pending", "joinlist"],
  desc: "Shows pending group join requests with numbers",
  category: "group",
  react: "📋",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  reply
}) => {
  try {
    if (!isGroup) return await reply("⚠️ This command only works in groups.");
    if (!isBotAdmins) return await reply("❌ I must be admin to view join requests.");
    if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
      return await reply("ℹ️ No pending join requests.");
    }

    let text = `📋 *Pending Join Requests (${requests.length})*\n\n`;
    requests.forEach((user, i) => {
      text += `${i+1}. ${user.jid.replace('@s.whatsapp.net', '')}\n`;
    });

    text += `\n*Usage:*\n• Type \`accept 1\` to accept request #1\n• Type \`reject 3\` to reject request #3\n• Type \`acceptall\` to accept all\n• Type \`rejectall\` to reject all`;

    await reply(text);

  } catch (err) {
    console.error(err);
    await reply("❌ Failed to fetch join requests.");
  }
});

cmd({
  pattern: "accept",
  alias: ["approve"],
  desc: "Accept specific join request by number",
  category: "group",
  react: "✅",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  args,
  reply
}) => {
  try {
    if (!isGroup) return await reply("⚠️ This command only works in groups.");
    if (!isBotAdmins) return await reply("❌ I must be admin to accept join requests.");
    if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

    if (!args[0]) return await reply("❓ Usage: accept [number]\nExample: accept 1");

    const num = parseInt(args[0]);
    if (isNaN(num) || num < 1) return await reply("⚠️ Please provide a valid number.");

    const requests = await conn.groupRequestParticipantsList(from);
    if (!requests || requests.length === 0) {
      return await reply("ℹ️ No pending join requests.");
    }

    if (num > requests.length) {
      return await reply(`⚠️ Only ${requests.length} pending request${requests.length > 1 ? 's' : ''} available.`);
    }

    const user = requests[num - 1].jid;
    await conn.groupRequestParticipantsUpdate(from, [user], "approve");
    
    await reply(`✅ Accepted join request #${num} from ${user.replace('@s.whatsapp.net', '')}`);

  } catch (err) {
    console.error(err);
    await reply("❌ Failed to accept join request.");
  }
});

cmd({
  pattern: "reject",
  alias: ["decline", "deny"],
  desc: "Reject specific join request by number",
  category: "group",
  react: "❌",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  args,
  reply
}) => {
  try {
    if (!isGroup) return await reply("⚠️ This command only works in groups.");
    if (!isBotAdmins) return await reply("❌ I must be admin to reject join requests.");
    if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

    if (!args[0]) return await reply("❓ Usage: reject [number]\nExample: reject 2");

    const num = parseInt(args[0]);
    if (isNaN(num) || num < 1) return await reply("⚠️ Please provide a valid number.");

    const requests = await conn.groupRequestParticipantsList(from);
    if (!requests || requests.length === 0) {
      return await reply("ℹ️ No pending join requests.");
    }

    if (num > requests.length) {
      return await reply(`⚠️ Only ${requests.length} pending request${requests.length > 1 ? 's' : ''} available.`);
    }

    const user = requests[num - 1].jid;
    await conn.groupRequestParticipantsUpdate(from, [user], "reject");
    
    await reply(`✅ Rejected join request #${num} from ${user.replace('@s.whatsapp.net', '')}`);

  } catch (err) {
    console.error(err);
    await reply("❌ Failed to reject join request.");
  }
});
