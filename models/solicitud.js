'use strict'

var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var SolicitudSchema = Schema({
  cliente:{type: Schema.ObjectId, ref:'cliente' ,required: true},
  num_solicitudes:{type:Number, required: true },
  createdAt: {type:Date, default:Date.now, required:true}
}); 

module.exports = mongoose.model('solicitud' , SolicitudSchema); 
