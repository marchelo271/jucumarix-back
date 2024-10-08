'use strict'

var express = require('express'); 
var clienteController = require('../controllers/ClienteController'); 

var api = express.Router();
var auth = require('../middlewares/authenticate'); 

api.post('/registro_cliente', clienteController.registro_cliente);
api.post('/login_cliente', clienteController.login_cliente); 

api.get('/listar_clientes_filtro_admin/:tipo/:filtro?',auth.auth, clienteController.listar_clientes_filtro_admin); 
api.post('/registro_cliente_admin', auth.auth,  clienteController.registro_cliente_admin); 
api.get('/obtener_cliente_admin/:id', auth.auth, clienteController.obtener_cliente_admin );
api.put('/actualizar_cliente_admin/:id', auth.auth, clienteController.actualizar_cliente_admin); 
api.delete('/eliminar_cliente_admin/:id', auth.auth, clienteController.eliminar_cliente_admin); 
api.get('/obtener_cliente_guest/:id', auth.auth, clienteController.obtener_cliente_guest); 
api.put('/actualizar_perfil_cliente_guest/:id', auth.auth, clienteController.actualizar_perfil_cliente_guest); 


//**************Contacto  */
api.post('/enviar_mensaje_contacto' ,clienteController.enviar_mensaje_contacto);

//***************Ordenes */
api.get('/obtener_solicitudes_cliente/:id', auth.auth, clienteController.obtener_solicitudes_cliente); 
api.get('/obtener_detalles_solicitudes_cliente/:id', auth.auth, clienteController.obtener_detalles_solicitudes_cliente); 

//***************Revies */
api.post('/emitir_review_producto_cliente', auth.auth, clienteController.emitir_review_producto_cliente); 
api.get('/obtener_review_producto_cliente/:id', clienteController.obtener_review_producto_cliente);
api.get ('/obtener_reviews_cliente/:id', auth.auth, clienteController.obtener_reviews_cliente); 
module.exports = api; 