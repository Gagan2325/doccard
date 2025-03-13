const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var cookieParser = require('cookie-parser');
const connectToMongoDB = require('./db/dbConfig');
const verifyToken = require('./src/middleware/auth');

const PORT = process.env.PORT || 3030;


var corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}

//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());



app.use("/api/auth", require("./src/controller/userController"));
app.use('/api/profile', verifyToken, require('./src/controller/profileController'));



app.get('/', function(req, res) { res.send('Welcome to DocCard API!'); });

async function connection() {
    try {
        await connectToMongoDB();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}
connection();