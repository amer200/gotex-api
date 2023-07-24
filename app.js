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
const crStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/cr/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
const clintReciptsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/recipts/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
/********************************************************************************* */
const upload = multer({ storage: crStorage });
const uploadClintRecipts = multer({ storage: clintReciptsStorage });
app.post('/user/signup', upload.array('cr'));
app.post('/user/marketer-signup', upload.array('cr'));
app.post('/invatation/invited-user-signup', upload.array('cr'));
app.post('/user/add-clint-deposit', uploadClintRecipts.single('recipt'));
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
const anwanRoutes = require("./routes/anwan");
const invRoutes = require("./routes/invatation");
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/companies", companiesRoutes);
app.use("/saee", saeeRoutes);
app.use("/aramex", aramexRoutes);
app.use("/glt", gltRoutes);
app.use("/smsa", smsaRoutes);
app.use("/anwan", anwanRoutes);
app.use("/invatation", invRoutes);

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