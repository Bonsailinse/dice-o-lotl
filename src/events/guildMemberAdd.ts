import { Events, GuildMember } from 'discord.js';
import { UserSyncService } from '../database/UserSyncService';

export default {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member: GuildMember) {
        await UserSyncService.handleMemberAdd(member);
    },
};
