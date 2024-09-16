'use strict'

var express = require('express'); 
var AdminController = require('../controllers/AdminController'); 
var auth = require('../middlewares/authenticate'); 

var api = express.Router();

api.post('/registro_admin', AdminController.registro_admin);
api.post('/login_admin',AdminController.login_admin); 
api.get('/obtener_mensajes_admin', auth.auth , AdminController.obtener_mensajes_admin); 
api.put('/cerrar_mensaje_admin/:id', auth.auth, AdminController.cerrar_mensaje_admin);
api.delete('/eliminar_mensaje_admin/:id', auth.auth, AdminController.eliminar_mensaje_admin); 
api.get('/listar_todos_admin_filtro/:tipo/:filtro?', auth.auth, AdminController.listar_todos_admin_filtro);
api.delete('/eliminar_administrador/:id', auth.auth, AdminController.eliminar_administrador); 
api.get('/obtener_admin/:id', auth.auth, AdminController.obtener_admin); 
api.put('/actualizar_admin/:id', auth.auth, AdminController.actualizar_admin);   

//************* Solicitudes**************** */
api.get('/obtener_solicitudes_admin/:desde?/:hasta?', auth.auth, AdminController.obtener_solicitudes_admin ); 
api.delete('/eliminar_solicitud_admin/:id', auth.auth, AdminController.eliminar_solicitud_admin);

//************* reseña**************** */
api.delete('/eliminar_review/:id', auth.auth, AdminController.eliminar_review); 

module.exports = api; 