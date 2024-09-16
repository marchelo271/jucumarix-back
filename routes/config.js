'use strict'

var express = require('express'); 
var configController = require('../controllers/configController'); 
var api = express.Router();
var auth = require('../middlewares/authenticate'); 
var multiparty = require('connect-multiparty'); 
const path= multiparty({uploadDir:'./uploads/configuraciones'});

api.put('/actualizar_config_admin/:id', [auth.auth, path], configController.actualizar_config_admin); 
api.get('/obtener_config_admin', auth.auth, configController.obtener_config_admin); 
api.get('/obtener_logo/:img',configController.obtener_logo ); 
api.get('/obtener_icono_servicio/:icono', configController.obtener_icono_servicio); 
api.get('/obtener_config_publico', configController.obtener_config_publico); 
api.put('/agregar_servicio/:id', [auth.auth, path], configController.agregar_servicio); 
api.put('/eliminar_servicio', auth.auth, configController.eliminar_servicio); 
api.get('/listar_servicios_nuevos_publico', configController.listar_servicios_nuevos_publico); 

module.exports = api; 