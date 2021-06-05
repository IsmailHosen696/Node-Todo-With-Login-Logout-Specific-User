require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT
const path = require('path');
const router = require('./server/router/router');
const routes = require('./server/router/routes');
const connection = require('./server/db/db');
connection();
const methodOverride = require('method-override');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressEjsLayouts);
app.use(methodOverride('_method'));


app.set('view engine', 'ejs');

app.use('/', router);
app.use('/todo', routes);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));