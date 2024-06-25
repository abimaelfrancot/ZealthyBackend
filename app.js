const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const ticketRoutes = require('./routes/ticketRoutes');
const path = require('path');

app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/tickets', ticketRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
