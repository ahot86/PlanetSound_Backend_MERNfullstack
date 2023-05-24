import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Creando la Carpeta para el archivo ', file.originalname);
        const dir = './img_upload';
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir, {recursive: true});
        }
        console.log('CARPETA CREADA');

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

const imgFilter = (req, file, cb) =>{

    if(file.mimetype != "image/jpeg"){
        req.fileValidationError = "Solo puede subir archivos de tipo .JPEG";
        return cb(null, false, req.fileValidationError);
    }

    cb(null, true);
};

export default multer({
    storage: storage,
    fileFilter: imgFilter
});