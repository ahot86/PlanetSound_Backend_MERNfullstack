import Cliente from "../models/Cliente.js";
import Pedido from "../models/Pedidos.js";
import Djs from "../models/Djs.js";
import generarJWT from "../helper/generarJWT.js";
import generarID from "../helper/generarID.js";
import emailRegistro from "../helper/emailRegistro.js"
import emailOlvidePassword from "../helper/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const {email, nombre} = req.body;

    const usuario = await Cliente.findOne({email});
    
    if(usuario){
        const e = new Error('El email ingresado pertenece a un usuario registrado');
        return res.status(403).json({msg: e.message});
    }

    try {
        const cliente = new Cliente(req.body);
        const clienteGuardado = await cliente.save();
        emailRegistro({
            email,
            nombre,
            token: clienteGuardado.token
        })
        return res.json({msg: 'Te enviamos un email a tu correo con las instrucciones'});        
    } catch (error) {
        console.log(error);        
    }
}

const confirmar = async (req, res) =>{
    const {token} = req.params;

    const usuarioCliente = await Cliente.findOne({token});

    if(!usuarioCliente){
        const e = new Error('El token es inválido');
        return res.status(404).json({msg: e.message});
    }

    try {
        usuarioCliente.token = null;
        usuarioCliente.confirmado = true;
        usuarioCliente.save();
        res.json({msg: `Cuenta del cliente confirmada ya puede iniciar sesión`});        
    } catch (error) {
        console.log(error);        
    }
    
}

const autenticar = async (req, res) => {

    const {email, password} = req.body;

    const usuarioCliente = await Cliente.findOne({email});

    if(!usuarioCliente){
        const e = new Error('El usuario no existe');
        return res.status(403).json({msg: e.message});
    }

    if(!usuarioCliente.confirmado){
        const e = new Error('Tu cuenta no ha sido confirmada, revisa tu email para confirmarla');
        return res.status(403).json({msg: e.message});
    };    

    if(await usuarioCliente.comprobarPassword(password)){
        return res.json({
                    _id: usuarioCliente.id,
                    nombre: usuarioCliente.nombre,
                    email: usuarioCliente.email,
                    token: generarJWT(usuarioCliente.id)
                    }); 
    }else{
        const e = new Error('El password es incorrecto');
        return res.status(403).json({msg: e.message});
    }
    
}

const olvidePassword = async (req, res) => {
    const {email} = req.body;

    const usuarioCliente = await Cliente.findOne({email});

    if(!usuarioCliente){
        const e = new Error('El usuario no existe');
        return res.status(400).json({msg: e.message});
    }

    try {
        usuarioCliente.token = generarID();
        usuarioCliente.confirmado = false;
        await usuarioCliente.save();

        emailOlvidePassword({
            email,
            nombre: usuarioCliente.nombre,
            token: usuarioCliente.token
        });
        
        return res.json({msg: 'Te enviamos un email a tu correo con las instrucciones'});        
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;

    const usuarioCliente = await Cliente.findOne({token});

    if(!usuarioCliente){
        const e = new Error('Token inválido o inexistente');
        return res.status(400).json({msg: e.message});
    }

    return res.json({msg: 'Acceso Permitido'});
}

const nuevoPassword = async (req, res) => {
    const {password} = req.body;
    const {token} = req.params;

    const usuarioCliente = await Cliente.findOne({token});

    if(!usuarioCliente){
        const e = new Error('Token inválido o inexistente');
        return res.status(403).json({msg: e.message});
    }

    try {
        usuarioCliente.password = password;
        usuarioCliente.token = null;
        usuarioCliente.confirmado = true;
        await usuarioCliente.save();
        return res.json({msg: 'Nuevo password creado correctamente, ya puede iniciar sesión'});        
    } catch (error) {
        console.log(error);        
    }
}

const perfil = async (req, res) => {
    const {clienteUsuario} = req;
    return res.json(clienteUsuario); 
}

const listaDJs = async (req, res) => {
    const listadoDjs = await Djs.find().where('confirmado').equals(true).select('-password -token -confirmado -__v');
    return res.json(listadoDjs);
}

const djSeleccionado = async (req, res) => {
    const {clienteUsuario} = req;
    if(clienteUsuario === null){
        res.json({msg: 'No estás permitido'});
        return
    }
    const {dj} = req.params;
    const djEscojido = await Djs.findById(dj).select('-password -token -confirmado -__v');
    return res.json(djEscojido);
}

const pedido = async (req, res) => {
    
    const {clienteUsuario} = req;
    const {dj} = req.params;
    const djSeleccionado = await Djs.findById(dj);

    const pedidos = new Pedido(req.body);
    pedidos.dj = djSeleccionado._id;
    pedidos.cliente = clienteUsuario._id;

    try {
        const pedidoGuardado = await pedidos.save();
        return res.json(pedidoGuardado);
        
    } catch (error) {
        console.log(error);
    }
}

const pedidos = async (req, res) => {
    const listaPedidos = await Cliente.aggregate([
        {
            $match: {
                _id: req.clienteUsuario._id
            }
        },
        {            
            $lookup: {
                from: 'pedidos',
                localField: '_id',
                foreignField: 'cliente',
                as: 'pedido'
            }
        },
        {
            $unwind: '$pedido'
        },
        {            
            $lookup: {
                from: 'djs',
                localField: 'pedido.dj',
                foreignField: '_id',
                as: 'dj'
            }
        },
        {
            $unwind: '$dj'
        },
        {
            $project: {
                _id: '$pedido._id',
                evento: '$pedido.evento',
                fecha: '$pedido.fecha',
                musica: '$pedido.musica',
                duracion: '$pedido.duracion',
                aceptado: '$pedido.aceptado',
                nombre: '$dj.nombre',
                avatar: '$dj.avatar'
            }
        },
        {
            $sort : {
                fecha: -1
            }
        }
    ]);

    listaPedidos.forEach(pedido => {
        if (pedido.avatar && pedido.avatar.data) {
            pedido.avatar.data = Buffer.from(pedido.avatar.data.buffer, 'base64');
        }
    });

    return res.json(listaPedidos);
}

export {
    registrar,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    listaDJs,
    djSeleccionado, 
    pedido,
    pedidos
}