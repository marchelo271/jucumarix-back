'use strict'

var express = require('express'); 
var solicitudController = require('../controllers/solicitudController'); 

var api = express.Router();
var auth = require('../middlewares/authenticate'); 

api.post('/registro_solicitud_cliente', auth.auth, solicitudController.registro_solicitud_cliente); 


module.exports = api; 