const sql = require('mssql');
const path = require('path');
const { upload } = require('../config/uploadConfig'); 
const db = require('../models/ticketModel');

const getTickets = async (req, res) => {
    try {
        const tickets = await db.getTickets();
        res.json(tickets);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createTicket = async (req, res) => {
    const { name, email, description, img } = req.body;
    const image = req.file;

    try {
        await db.createTicket(name, email, description, img, image);

        if (image) {
            const imagePath = path.join(__dirname, '../uploads', image.originalname);
            console.log('Image uploaded:', imagePath);
        }

        res.status(201).send('Data inserted successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
};

const updateTicket = async (req, res) => {
    const { id, response, status } = req.body;

    try {
        await db.updateTicket(id, response, status);
        res.status(201).send('Data updated successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
};

module.exports = {
    getTickets,
    createTicket,
    updateTicket,
};
