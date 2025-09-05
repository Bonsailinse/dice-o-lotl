import { Events, GuildMember } from 'discord.js';
import { UserSyncService } from '../database/UserSyncService';

export default {
    name: Events.GuildMemberRemove,
    once: false,
    async execute(member: GuildMember) {
        await UserSyncService.handleMemberRemove(member);
    },
};
