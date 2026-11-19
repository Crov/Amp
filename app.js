const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const errorMiddleware = require('./middleware/error');
require('dotenv').config();

const app = express();

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error: ', err);
    }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    const token = auth.getToken(req);

    if (!token) return res.redirect('/register');

    try {
        auth.verifyToken(token);
        return res.redirect('/home');
    } catch (error) {
        res.clearCookie('amp_token');
        return res.redirect('/register');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.use('/', require('./routes/auth.route'));

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.server);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

main();