import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarID from "../helper/generarID.js";

const djsSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    yearsExp: {
        type: Number,
        default: null
    },
    descripcion: {
        type: String,
        default: null
    },
    avatar: {
        data: Buffer,
        contentType: String 
    },
    token: {
        type: String,
        default: generarID()    
    }, 
    confirmado: {
        type: Boolean,
        default: false
    }
});

djsSchema.pre('save', async function(next) {
    if(!this.isModified("password")){
        return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

djsSchema.methods.comprobrarPassword = async function (passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password);
};

const Djs = mongoose.model('Djs', djsSchema);

export default Djs;