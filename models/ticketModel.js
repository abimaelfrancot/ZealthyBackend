const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

const getTickets = async () => {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM tickets order by id desc');
        return result.recordset;
    } catch (err) {
        throw err;
    }
};

const createTicket = async (name, email, description, img, image) => {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('description', sql.VarChar, description)
            .input('img', sql.VarChar, img)
            .query(`INSERT INTO tickets (name, emailaddress, description, imgpath, status, inserted) VALUES (@name, @email, @description, @img, 'new', getdate())`);

        return result;
    } catch (err) {
        throw err;
    }
};

const updateTicket = async (id, response, status) => {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.VarChar, id)
            .input('response', sql.VarChar, response)
            .input('status', sql.VarChar, status)
            .query(`UPDATE tickets SET response = @response, status = @status WHERE id = @id`);

        return result;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getTickets,
    createTicket,
    updateTicket,
};
