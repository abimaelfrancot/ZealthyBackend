const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // For handling file uploads

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads'; // Destination folder
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the directory exists
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original filename
    }
});
const upload = multer({ storage: storage });

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MSSQL Configuration
const dbConfig = {
    user: '',
    password: '',
    server: '',
    database: '',
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
        instancename: '', // SQL Server instance name
        port: ''
    },
};

// Connect to MSSQL
sql.connect(dbConfig).then(pool => {
    if (pool.connected) {
        console.log('Connected to MSSQL');
    }

    // GET endpoint
    app.get('/getTickets', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM tickets with(nolock) order by id desc');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST endpoint for creating tickets with image upload
    app.post('/createTicket', upload.single('image'), async (req, res) => {
        const { name, email, description,img } = req.body; // Adjust according to your table columns
        const image = req.file; // This will contain file information if an image was uploaded

        try {
            // Insert data into MSSQL
            const result = await pool.request()
                .input('name', sql.VarChar, name)
                .input('email', sql.VarChar, email)
                .input('description', sql.VarChar, description)
                .input('img', sql.VarChar, img)
                .query(`INSERT INTO tickets (name, emailaddress, description,imgpath,status,inserted) VALUES (@name, @email, @description,@img,'new',getdate())`);
            
            // Handle image saving logic if needed
            if (image) {
                // Save image path to database or perform other actions
                const imagePath = path.join(__dirname, 'uploads', image.originalname);
                console.log('Image uploaded:', imagePath);
            }

            res.status(201).send('Data inserted successfully');
        } catch (err) {
            console.log(err.message)
            res.status(500).send(err.message);
        }
    });

     // POST endpoint for creating tickets with image upload
    app.post('/updateTicket',  async (req, res) => {
        const { id,response,status} = req.body; // Adjust according to your table columns
        console.log(req.body)
        try {
            // Insert data into MSSQL
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

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}).catch(err => {
    console.error('Database connection failed:', err);
});
