import Djs from "../models/Djs.js";
import Pedido from "../models/Pedidos.js";
import generarJWT from "../helper/generarJWT.js";
import fs from "fs";

const registrar = async (req, res) => {
    const {email} = req.body;
    const existeEmail = await Djs.findOne({email});

    if(existeEmail){
        const error = new Error('El usuario ya existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        const dj = new Djs(req.body);
        const djGuardado = await dj.save();

        res.json(djGuardado);
        
    } catch (error) {
        console.log(error);
        
    }    
}

const confirmar = async (req, res) => {
    const {token} = req.params;

    const djConfirmado = await Djs.findOne({token});

    if(!djConfirmado){
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }

    try {
        djConfirmado.token = null;
        djConfirmado.confirmado = true;
        await djConfirmado.save();

        res.json({msg: 'Cuenta de Dj confirmada'});        
    } catch (error) {
        console.log(error);        
    }
}

const autenticar = async (req, res) =>{
    const {email, password} = req.body;

    const usuario = await Djs.findOne({email});

    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(403).json({msg: error.message});
    }

    if(!usuario.confirmado){
        const error = new Error('Cuenta no confirmada, revisa tu email para confirmarla');
        return res.status(403).json({msg: error.message});
    }

    if(await usuario.comprobrarPassword(password)){
        return  res.json({
                    _id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    yearsExp: usuario.yearsExp,
                    descripcion: usuario.descripcion,
                    avatar: usuario.avatar,
                    token: generarJWT(usuario.id)
                });
    } else {                
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message});
    }    
}

const perfil = (req, res) => {
    const {dj} = req;
    res.json(dj);
}

const actualizarPerfil = async (req, res) =>{
    if(req.fileValidationError){
        const e = new Error(req.fileValidationError);
        return res.status(403).json({msg: e.message});
    }
    
    const {email} = req.dj;
    const perfilDj = await Djs.findOne({email}).select('-password -token -confirmado -__v');    
    
    const dirLenght = "./img_upload/";
    const disponible = fs.readdirSync(dirLenght).length === 0;

    if(!disponible){
        const path = "./img_upload/" + req.file.filename;

        perfilDj.nombre = req.body.nombre || perfilDj.nombre,
        perfilDj.email = req.body.email || perfilDj.email,
        perfilDj.yearsExp = req.body.yearsExp || perfilDj.yearsExp,
        perfilDj.descripcion = req.body.descripcion || perfilDj.descripcion,
        perfilDj.avatar = {data: fs.readFileSync(path), contentType: "image/png"}

        try {            
            await perfilDj.save();
            fs.unlinkSync(path);
            return res.json(perfilDj);        
        } catch (error) {
            console.log(error);
        }
    }

    perfilDj.nombre = req.body.nombre || perfilDj.nombre,
    perfilDj.email = req.body.email || perfilDj.email,
    perfilDj.yearsExp = req.body.yearsExp || perfilDj.yearsExp,
    perfilDj.descripcion = req.body.descripcion || perfilDj.descripcion    

    try {
        await perfilDj.save();
        return res.json(perfilDj);                         
    } catch (error) {
        console.log(error);            
    }          
}

const lista = async (req, res) => {
    const {dj} = req;

    const djPedidos = await Pedido.find().where('dj').equals(dj._id).sort({fecha: 'desc'});
    
    return res.json(djPedidos);
}

const aceptar = async (req, res) => {
    const {id} = req.params;
    const clientePedido = await Pedido.findById(id);

    if(clientePedido.dj._id.toString() !== req.dj._id.toString()){
        const e = new Error('Accion no Válida');
        return res.json({msg: e.message});
    };

    clientePedido.aceptado = true;

    try {
        await clientePedido.save();
        return res.json({msg: 'Pedido Aceptado'});
    } catch (error) {
        console.log(error);
    }
}

export{
    registrar,
    confirmar,
    autenticar,
    perfil,
    actualizarPerfil,
    lista,
    aceptar
}