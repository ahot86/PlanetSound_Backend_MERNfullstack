import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import djsRoute from "./routes/djsRoutes.js";
import clienteRoute from "./routes/clienteRoutes.js";

const app = express();
app.use(express.json());

const port = process.env.PORT || 4500;

dotenv.config();

conectarDB();

const urlAllowed = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, cb) {
        if(urlAllowed.indexOf(origin) !== -1){
            cb(null, true);
        }else{
            cb(new Error('No permitido por CORS'));
        }
    }
}
app.use(cors(corsOptions));

app.use(function(req, res, next){
    res.header(
        'Access-Control-Allow-Origin', urlAllowed[0]
    );
    res.header(
        'Access-Control-Allow-Headers', 'Content-Type, Authorization'
    );
    res.header(
        'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'
    );
    next();
});


app.use('/api/dj', djsRoute);
app.use('/api/cliente', clienteRoute);


app.listen(port, ()=>{
    console.log(`Servidor funcionando en el puerto ${port}`);
})