'use strict'

var admin = require ('../models/admin'); 
var Review = require ('../models/review'); 
var Contacto = require ('../models/contacto'); 
var Solicitud = require ('../models/solicitud'); 
var Dsolicitud = require ('../models/dsolicitud'); 
var bcrypt = require ('bcrypt'); 
var jwt = require ('../helpers/jwt');
const saltRounds = 10;

const registro_admin = async function(req,res){
    var data = req.body;  
    var admin_arr = [];

    admin_arr = await admin.find({email: data.email}); 

        if(admin_arr.length == 0 ){
          //el registro
        // 
         if(data.password){
             bcrypt.hash(data.password,saltRounds, async function(err, hash){
                if(hash){
                  data.password = hash; 
                  var reg = await admin.create(data); 
                  res.status(200).send({data:reg, message:'El administrador se creo correctamente'});
                }else {
                  res.status(200).send({message: 'Error server'});
                }
             })  
         } else {
            res.status(200).send({message: 'No hay una contraseña'});           
         }
        
        }
        else{
          res.status(200).send({message: 'El correo ya existe en la base de datos', data: undefined})
        }
}

const login_admin = async function (req, res){
    var data = req.body; 
    var admin_arr = [];
    
    admin_arr = await admin.find({email:data.email}); 
       if(admin_arr.length ==0){
            res.status(200).send({message:'no se encontro ningun administrador con ese correo', data: undefined}); 
       } else{
         //LOGIN porque si existe el usuario
         let user = admin_arr[0];
         bcrypt.compare(data.password, user.password, async function(error, check){
              if(check){
               res.status(200).send({data:user,
            token:jwt.createToken(user)}); 
              } else {
               res.status(200).send({message:'la contraseña no coincide', data:undefined});
              }
         });
       }
} 

// Mensajes 
const obtener_mensajes_admin = async function (req , res) {
  if(req.user){
      if(req.user.role == 'gerente'){
         
        let reg = await Contacto.find().sort({createdAt: -1}); 
     
        res.status(200).send({data: reg}); 
       }
         else {
        res.status(500).send({message:'NoAccess'});
      }
   } else {
    res.status(500).send({message:'NoAccess'});
   }
} 

const cerrar_mensaje_admin = async function (req , res) {
  if(req.user){
      if(req.user.role == 'gerente'){
         
        let id= req.params['id']; 
       
        let reg = await Contacto.findByIdAndUpdate({_id:id},{estado:'Cerrado'}); 
     
        res.status(200).send({data: reg}); 
       }
         else {
        res.status(500).send({message:'NoAccess'});
      }
   } else {
    res.status(500).send({message:'NoAccess'});
   }
}

const eliminar_mensaje_admin = async function (req , res) {
  if(req.user){
      if(req.user.role == 'gerente'){
         
        let id= req.params['id']; 
       
        let reg = await Contacto.findByIdAndRemove({_id:id}); 
     
        res.status(200).send({message:'El mensaje se elimino correctamente', data: reg}); 
       }
         else {
        res.status(500).send({message:'NoAccess'});
      }
   } else {
    res.status(500).send({message:'NoAccess'});
   }
}


// Administradores
const listar_todos_admin_filtro = async function(req , res){
    
  if(req.user){
    if(req.user.role=='gerente'){
      let tipo = req.params['tipo'];
      let filtro = req.params['filtro'];
      
      if(tipo== null || tipo =='null'){
        let reg = await admin.find(); 
        res.status(200).send({data:reg});
      } else {
         if(tipo == 'apellidos'){
            let reg = await admin.find({apellidos: new RegExp(filtro, 'i')});
            res.status(200).send({data:reg});
    
         }else if(tipo == 'correo'){
          let reg = await admin.find({email: new RegExp(filtro, 'i')});
          res.status(200).send({data:reg});
         }
      }
    }else{
      res.status(500).send({message:'NoAccess'});
    }
  }else{
    res.status(500).send({message:'NoAccess'});
  }
}

const eliminar_administrador = async function (req, res){
  if (req.user){
    if (req.user.role == 'gerente') {
       
      var id = req.params['id']; 

      let reg = await admin.findByIdAndRemove({_id:id}); 
      res.status(200).send({message:'se elimino al administrador', data:reg}); 
    
    }else {
      res.status(500).send({message:'NoAccess'});
    }
  } else {
    res.status(500).send({message:'NoAccess'});
  }
}

const obtener_admin = async function (req, res ){
  if (req.user){
    if (req.user.role == 'gerente') {
       
      var id = req.params['id']; 
     
     try {
      var reg = await admin.findById({_id:id}); 
      res.status(200).send({data: reg });
     } catch (error) {
      res.status(200).send({data: undefined });
     } 

    }else {
      res.status(500).send({message:'NoAccess'});
    }
  } else {
    res.status(500).send({message:'NoAccess'});
  }
}

const actualizar_admin = async function(req, res ){
  if (req.user){
    if (req.user.role == 'gerente') {
       
      var id = req.params['id']; 
      var data = req.body;

       var reg = await admin.findByIdAndUpdate({_id:id},{
         nombre: data.nombre,
         apellidos: data.apellidos, 
         email: data.email, 
         password: data.password, 
         telefono: data.telefono, 
         rol: data.rol,
         ci: data.ci
        })
        res.status(200).send({message:'La info del admin se actualizo correctamente', data: reg}); 

    }else {
      res.status(500).send({message:'NoAccess'});
    }
  } else {
    res.status(500).send({message:'NoAccess'});
  }

}

//**********Solicitudes */

const obtener_solicitudes_admin = async function (req , res) {
  if(req.user){
      if(req.user.role == 'gerente'){
         
        let solicitudes = []; 
        let desde= req.params['desde']; 
        let hasta= req.params['hasta']; 
       
        if(desde =='undefined' && hasta == 'undefined'){
          solicitudes = await Solicitud.find().populate('cliente').sort({createdAt: -1});
          res.status(200).send({data:solicitudes}); 
        } else {
           let tt_desde = Date.parse(new Date(desde+'T00:00:00'))/1000; 
           let tt_hasta = Date.parse(new Date(hasta+'T00:00:00'))/1000; 
          
           let tem_solicitudes = await Solicitud.find().populate('cliente').sort({createdAt: -1});
            for (var item of tem_solicitudes) {
               var tt_created =  Date.parse(new Date(item.createdAt))/1000; 
               if(tt_created >= tt_desde && tt_created <= tt_hasta){
                   solicitudes.push(item);
               }
            }
             res.status(200).send({data:solicitudes}); 
        }
        
       }
         else {
        res.status(500).send({message:'NoAccess'});
      }
   } else {
    res.status(500).send({message:'NoAccess'});
   }
}

const eliminar_solicitud_admin = async function (req, res){
  if (req.user){
    if (req.user.role == 'gerente') {
       
      var id = req.params['id']; 

      let detalles = await Dsolicitud.findOneAndRemove({solicitud:id})
      let reg = await Solicitud.findByIdAndRemove({_id:id}); 
      res.status(200).send({message:'se elimino la solicitud con exito', data:reg, detalles:detalles}); 
    
    }else {
      res.status(500).send({message:'NoAccess'});
    }
  } else {
    res.status(500).send({message:'NoAccess'});
  }
}

//**********reseñas */
const eliminar_review = async function (req, res){
  if (req.user){
    if (req.user.role == 'gerente') {
       
      var id = req.params['id']; 

      let reg = await Review.findByIdAndRemove({_id:id}); 
      res.status(200).send({message:'se elimino la reseña con exito', data:reg}); 
    
    }else {
      res.status(500).send({message:'NoAccess'});
    }
  } else {
    res.status(500).send({message:'NoAccess'});
  }
}


module.exports = {
   registro_admin, 
   login_admin,
   obtener_mensajes_admin,
   cerrar_mensaje_admin,
   eliminar_mensaje_admin,
   obtener_solicitudes_admin,
   listar_todos_admin_filtro,
   eliminar_administrador,
   obtener_admin,
   actualizar_admin,
   eliminar_review,
   eliminar_solicitud_admin
}