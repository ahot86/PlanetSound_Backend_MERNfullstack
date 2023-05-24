import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const url = `${db.connection.host} : ${db.connection.port}`;
        console.log(`Mongoose conectado en : ${url}`);
    
    } catch (error) {
        console.log(`error : ${error.mensage}`);
        process.exit(1);    
    }
}

export default conectarDB;