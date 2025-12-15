const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDb  = require('./config/db');

const app = express();
app.use(express.json());
app.use(cors());

connectDb(process.env.MONGO_URI);

app.use('/auth', require('./routes/auth'));
app.use('/expenses', require('./routes/expenses'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));