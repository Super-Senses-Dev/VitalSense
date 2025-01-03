const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const requestLimit = '50mb'
app.use(express.json({ limit: requestLimit }));
app.use(express.urlencoded({ extended: true, limit: requestLimit }));

// Limit the api requests to prevent abuse
const rateLimit = require("express-rate-limit");
const routes = require('./routes');

app.use(cors({
    credentials: true,
    origin: '*', // Todo: change this to your frontend domain
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, device-unique-id,content-language, Content-Disposition, time-zone',
}));

const limiter = rateLimit({
    windowMs: 1 * 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Don't send the `X-RateLimit-*` headers,
});

app.use(limiter);

const port = process.env.PORT || 3257;



app.get('/', (req, res) => {
    res.send('Vital sense demo is running');
});

app.use('/extract', routes.extractRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

