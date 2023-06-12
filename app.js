require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbUrl = process.env.DB_URL;
const port = process.env.PORT;
const multer = require('multer');
const jwt = require("jsonwebtoken");
var cors = require('cors');
var morgan = require('morgan')

app.use(morgan('combined'))
/********************************************************************************* */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

/********************************************************************************* */
const upload = multer({ storage: storage });
/********************************************************************************** */
// const store = new MongoDBStore({
//     uri: dbUrl,
//     collection: 'mySessions'
// });
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: store
// }))
/********************************************************************************* */
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/********************************************************************************* */
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const companiesRoutes = require('./routes/companies');
const saeeRoutes = require("./routes/saee");
const aramexRoutes = require("./routes/aramex");
const smsaRoutes = require("./routes/smsa");
const gltRoutes = require("./routes/glt");
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/saee", saeeRoutes);
app.use("/aramex", aramexRoutes);
app.use("/companies", companiesRoutes);
app.use("/glt", gltRoutes);
app.use("/smsa", smsaRoutes);

/********************************************************************************* */
mongoose.connect(dbUrl)
    .then(resu => {
        console.log('db connection done !');
        app.listen(port, () => {
            console.log('app conneted on port ' + port)
        })
    })
    .catch(err => {
        console.log(err)
    })