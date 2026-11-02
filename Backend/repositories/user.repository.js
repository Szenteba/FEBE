import mysql from 'mysql2/promise';
import 'dotenv/config';

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

export const userRepository = {
    async findAll() {
        const [rows] = await db.query('SELECT * FROM teszt');
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM teszt WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async findByName(nev) {
        const [rows] = await db.query('SELECT nev FROM teszt WHERE nev = ?', [nev]);
        return rows[0] || null;
    },

    async create(nev, email) {
        const [result] = await db.query(
            'INSERT INTO teszt (nev, email) VALUES (?, ?)',
            [nev, email]
        );
        return { id: result.insertId, nev, email };
    }
};
