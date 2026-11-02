import { userService } from '../services/user.service.js';

export const userController = {
    async getUser(req, res) {
        try {
            console.log('Backend Response');
            const { userId } = req.body;
            console.log('POST kérés érkezett!');
            console.log('Kért ID:', userId);

            const user = await userService.getUserById(userId);
            return res.json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }
    },

    async sendUser(req, res) {
        try {
            const { szoveg } = req.body;
            await userService.saveNewUser(szoveg);
            return res.json({ success: true, message: 'Felhasználó sikeresen elmentve!' });
        } catch (error) {
            if (error.message === 'USER_EXISTS') {
                return res.json({ success: false, message: 'A felhasználó létezik!' });
            }
            console.error(error);
            return res.status(500).json({ error: 'Database insert failed' });
        }
    },

    async login(req, res) {
        try {
            const userId = req.body?.id;
            console.log('Login userId:', userId);
    
            if (!userId) {
                return res.status(400).json({ error: 'Hiányzó felhasználó azonosító' });
            }
    
            const { token, expiresInSeconds } = await userService.login(userId);
    
            res.cookie('session_token', token, {
                httpOnly: true,
                maxAge: expiresInSeconds * 1000
            });
    
            return res.status(200).json({ success: true, userId });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    logout(req, res) {
        const token = req.cookies?.session_token;
        userService.logout(token);
        res.clearCookie('session_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        return res.status(200).json({ success: true, message: 'Sikeres kijelentkezés' });
    },

    checkSession(req, res) {
        const token = req.cookies?.session_token;
        const result = userService.verifySession(token);

        if (!result.valid) {
            if (result.expired) {
                return res.status(100).json({ loggedIn: false, error: 'A munkamenet lejárt' });
            }
            return res.status(401).json({ loggedIn: false });
        }

        return res.status(200).json({
            loggedIn: true,
            userId: result.session.userId
        });
    },

    async lekerUser(req, res){
        const user = userService.lekerUser();

        return res.status(200).json({
            nev: user.nev || null,
            rank: user.rank || null
        })
    }
};
