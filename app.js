const dotenv = require('dotenv')
dotenv.config({ path: 'test.env' })
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbUrl = process.env.DB_URL;
const port = process.env.PORT;
const jwt = require("jsonwebtoken");
var cors = require('cors');
var morgan = require('morgan')
app.use(morgan('combined'))
const { upload, uploadClintReceipts } = require('./modules/fileUpload')
const { dbConnection } = require('./db/mongoose');
/********************************************************************************* */
/** File Upload */
app.post('/user/signup', upload.array('cr'));
app.post('/user/marketer-signup', upload.array('cr'));
app.post('/invatation/invited-user-signup', upload.array('cr'));
app.post('/user/add-clint-deposit', uploadClintReceipts.single('recipt'));
/********************************************************************************** */
app.set("view engine", "ejs");
/********************************************************************************* */
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/********************************************************************************* */
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// Connect with database
dbConnection()

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const companiesRoutes = require('./routes/companies');
const saeeRoutes = require("./routes/saee");
const aramexRoutes = require("./routes/aramex");
const smsaRoutes = require("./routes/smsa");
const gltRoutes = require("./routes/glt");
const anwanRoutes = require("./routes/anwan");
const splRoutes = require("./routes/spl");
const invRoutes = require("./routes/invatation");
const daftraRoutes = require("./routes/daftra");
const imileRoutes = require("./routes/imile");
const jtRouters = require("./routes/jt");
const clientRouters = require("./routes/client");
const marketerRoutes = require("./routes/markter");
const packageRoutes = require("./routes/package");
const ordersRoutes = require("./routes/orders");
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/companies", companiesRoutes);
app.use("/saee", saeeRoutes);
app.use("/aramex", aramexRoutes);
app.use("/glt", gltRoutes);
app.use("/smsa", smsaRoutes);
app.use("/anwan", anwanRoutes);
app.use("/spl", splRoutes);
app.use("/invatation", invRoutes);
app.use("/daftra", daftraRoutes);
app.use("/imile", imileRoutes);
app.use("/jt", jtRouters);
app.use("/clients", clientRouters);
app.use("/markter", marketerRoutes);
app.use("/package", packageRoutes);
app.use("/orders", ordersRoutes);
/********************************************************************************* */
app.listen(port, () => {
    console.log('app connected on port ' + port)
})