'use strict'

var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var DsolicitudSchema = Schema({
  producto:{type: Schema.ObjectId, ref:'producto' ,required: true},
  solicitud:{type: Schema.ObjectId, ref:'solicitud' ,required: true},
  cliente:{type: Schema.ObjectId, ref:'cliente' ,required: true},
  createdAt: {type:Date, default:Date.now, required:true}
}); 

module.exports = mongoose.model('dsolicitud' , DsolicitudSchema); 