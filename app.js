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
    origin: "*",
    methods: ["post", "get", "put", "delete"],
}))
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const saeeRoutes = require("./routes/saee");
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/saee", saeeRoutes);
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