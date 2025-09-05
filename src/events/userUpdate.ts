import { Events, User } from 'discord.js';
import { UserSyncService } from '../database/UserSyncService';

export default {
    name: Events.UserUpdate,
    once: false,
    async execute(oldUser: User, newUser: User) {
        await UserSyncService.handleUserUpdate(oldUser, newUser);
    },
};
