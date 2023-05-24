import mongoose from "mongoose";

const pedidoSchema = mongoose.Schema({    
    evento: String,
    fecha: {
        type: Date,
        default: Date.now()
    },
    musica: String,
    duracion: Number,
    aceptado: {
        type: Boolean,
        default: false
    },
    dj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Djs'
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
    }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;