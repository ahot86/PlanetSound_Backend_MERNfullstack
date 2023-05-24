import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarID from "../helper/generarID.js";

const clienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    token: {
        type: String,
        default: generarID()
    },
    confirmado:{
        type: Boolean,
        default: false
    }
});

clienteSchema.pre('save', async function(next){

    if(!this.isModified("password")){
        return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

clienteSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password);
};

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;