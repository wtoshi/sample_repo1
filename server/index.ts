import express = require("express");
import cors = require("cors");
import dotenv = require("dotenv");
import cookieParser = require("cookie-parser");

import { connectDB } from './core/services/db.service';
import serverManager from './core/managers/serverManager';
import eventManager from './core/managers/eventManager';

import routes from './routes'

const app = express();

dotenv.config();

connectDB();

app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(routes);

app.use((err: any, req: any, res: any, next: any) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong!';

    return res.status(status).json({
        success : false,
        status,
        message
    });
});

// const PORT = process.env.PORT || 5000;

// server.listen(PORT,()=>{
//     console.log('Server is running on port 5000');
// });

eventManager.registerHandlers()
serverManager.init(app)