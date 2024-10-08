'use strict'

var express = require('express'); 
var productoController = require('../controllers/productoController'); 



var api = express.Router();
var auth = require('../middlewares/authenticate'); 
var multiparty = require('connect-multiparty'); 
const path= multiparty({uploadDir:'./uploads/producto'});

// Productos
api.post('/registro_producto_admin',[auth.auth , path] , productoController.registro_producto_admin); 
api.get('/listar_producto_admin/:filtro?', auth.auth, productoController.listar_producto_admin); 
api.get('/obtener_portada/:img', productoController.obtener_portada); 
api.get('/obtener_producto_admin/:id', auth.auth, productoController.obtener_producto_admin); 
api.put('/actualizar_producto_admin/:id', [auth.auth , path], productoController.actualizar_producto_admin ); 
api.delete('/eliminar_producto_admin/:id', auth.auth, productoController.eliminar_producto_admin); 
api.put('/actualizar_producto_variedades_admin/:id', auth.auth, productoController.actualizar_producto_variedades_admin); 
api.put('/agregar_imagen_galeria_admin/:id', [auth.auth , path], productoController.agregar_imagen_galeria_admin); 
api.put('/eliminar_imagen_galeria_admin/:id', auth.auth, productoController.eliminar_imagen_galeria_admin); 


//publicos
api.get('/listar_producto_publico', productoController.listar_producto_publico); 
api.get('/obtener_producto_slug_publico/:slug', productoController.obtener_producto_slug_publico); 
api.get('/listar_productos_nuevos_publico', productoController.listar_productos_nuevos_publico); 
api.get('/obtener_reviews_producto_publico/:id', productoController.obtener_reviews_producto_publico); 

module.exports = api; 