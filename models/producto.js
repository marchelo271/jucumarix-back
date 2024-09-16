'use strict'

var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var productoSchema = Schema({
  titulo:{type: String, required: true},
  slug: {type:String,required:true}, 
  galeria:[{type:Object, required:false}],
  portada:{type: String, required: true},
  precio:{type: String, required: false},
  descripcion:{type: String, required: true},
  contenido:{type: String, required: true},
  mapa:{type: String, required: false},
  Nsolicitudes:{type: Number,default:0 , required: true},
  Npuntos:{type: Number,default:0 , required: true},
  variedades:[{type:Object, required:false}],
  categoria:{type: String, required: true}, 
  titulo_variedades:{type: String, required: false}, 
  estado:{type: String, default:'Edicion', required: true},
  createdAt: {type:Date, default:Date.now, required:true},
  premium: {type: Boolean, default:'true', required:false},
  direccion_neg:{type:String,required:false},
  serv_domicilio:{type:Boolean,default:'false',required:false},
  ciudad:{type:String, required: true },
  telefono:{type:Number, required: false },
  facebook:{type:String, required: false},
  wpp:{type:String, required: false },
  instagram:{type:String, required: false },
  tiktok:{type:String, required: false },
  correo:{type:String, required: false },
  web:{type:String, required: false }
}); 

module.exports = mongoose.model('producto' , productoSchema); 
