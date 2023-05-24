import express from "express";
import { 
        registrar, 
        confirmar, 
        autenticar,         
        perfil,
        lista,
        actualizarPerfil,
        aceptar
} from "../controllers/djsController.js";
import checkAuth from "../middleware/authMiddleware.js";
import uploadImg from "../middleware/upload.js";

const router = express.Router();


router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.get('/perfil', checkAuth, perfil);
router.get('/lista', checkAuth, lista)
router.put('/actualizar', checkAuth, uploadImg.single('avatar'), actualizarPerfil);
router.put('/aceptado/:id', checkAuth, aceptar);

export default router;