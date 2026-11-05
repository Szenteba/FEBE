import { userRepository } from '../repositories/user.repository.js';
import { generateSessionToken } from '../auth.js';

const sessions = new Map();

export const userService = {
    async getUserById(id) {
        const user = await userRepository.findById(parseInt(id, 10));
        if (!user) {
            return null;
        }
        return { id: user.id, name: user.nev, email: user.email };
    },

    async saveNewUser(szoveg) {
        const existing = await userRepository.findByName('teszt');
        if (existing) {
            throw new Error('USER_EXISTS');
        }
        return await userRepository.create('teszt', szoveg);
    },

    async login(userId) {
        const token = generateSessionToken();
        const expiresInSeconds = 30;
        sessions.set(token, {
            userId,
            expiresAt: Date.now() + expiresInSeconds * 1000
        });
        return { token, expiresInSeconds };
    },

    logout(token) {
        if (token && sessions.has(token)) {
            sessions.delete(token);
        }
    },

    verifySession(token) {
        if (!token || !sessions.has(token)) {
            return { valid: false };
        }

        const session = sessions.get(token);
        if (Date.now() > session.expiresAt) {
            sessions.delete(token);
            return { valid: false, expired: true };
        }

        return { valid: true, session };
    },

    async lekerUser() {
        return await userRepository.lekerUser();
    }
};
