import Jwt from "jsonwebtoken";
import Cliente from "../models/Cliente.js";

const checkAuthCliente = async (req, res, next) => {
    let token; 

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        if(token){
            try {
                const decoded = Jwt.verify(token, process.env.JWT_SECRET);
                req.clienteUsuario = await Cliente.findById(decoded.id).select('-password -token -confirmado -__v');
                return next();                
            } catch (error) {
                const e = new Error('Token no válido');
                return res.status(403).json({msg: e.message});
            }
        }        
    }

    if(!token){
        const e = new Error('Token no válido o inexistente');
        return res.status(403).json({msg: e.message});
    }

    next();
}

export default checkAuthCliente;