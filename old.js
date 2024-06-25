const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads'; 
        fs.mkdirSync(uploadPath, { recursive: true }); 
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const dbConfig = {
    user: 'sa',
    password: 'Reliant#1',
    server: '3.97.243.202',
    database: 'test',
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
        instancename: '',
        port: 6625
    },
};


sql.connect(dbConfig).then(pool => {
    if (pool.connected) {
        console.log('Connected to MSSQL');
    }

    app.get('/getTickets', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM tickets order by id desc');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });


    app.post('/createTicket', upload.single('image'), async (req, res) => {
        const { name, email, description,img } = req.body; 
        const image = req.file;

        try {
            const result = await pool.request()
                .input('name', sql.VarChar, name)
                .input('email', sql.VarChar, email)
                .input('description', sql.VarChar, description)
                .input('img', sql.VarChar, img)
                .query(`INSERT INTO tickets (name, emailaddress, description,imgpath,status,inserted) VALUES (@name, @email, @description,@img,'new',getdate())`);
            
            if (image) {
                const imagePath = path.join(__dirname, 'uploads', image.originalname);
                console.log('Image uploaded:', imagePath);
            }

            res.status(201).send('Data inserted successfully');
        } catch (err) {
            console.log(err.message)
            res.status(500).send(err.message);
        }
    });


    app.post('/updateTicket',  async (req, res) => {
        const { id,response,status} = req.body;
        console.log(req.body)
        try {
            const result = await pool.request()
                .input('id', sql.VarChar, id)
                .input('response', sql.VarChar, response)
                .input('status', sql.VarChar, status)
                .query(`update tickets set  response=@response,status=@status where id=@id`);

            res.status(201).send('Data inserted successfully');
        } catch (err) {
            console.log(err.message)
            res.status(500).send(err.message);
        }
    });


    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}).catch(err => {
    console.error('Database connection failed:', err);
});
