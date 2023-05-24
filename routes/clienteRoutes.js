import express from "express";
import {registrar, 
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
} from "../controllers/clienteController.js";
import checkAuthCliente from "../middleware/authMiddlewareCliente.js";

const router = express.Router();

router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', checkAuthCliente, perfil);
router.get('/lista-djs', checkAuthCliente, listaDJs);
router.route('/pedido/:dj').get(checkAuthCliente, djSeleccionado).post(checkAuthCliente, pedido);
router.get('/pedidos', checkAuthCliente, pedidos);


export default router;