
var config = require('../models/config'); 
var fs = require('fs'); 
var path = require('path');

const obtener_config_admin = async function (req , res) {
   if(req.user){
       if(req.user.role == 'gerente'){
          
         let reg = await config.findById({_id: "654e6824e6880da59ee4beff"})
      
         res.status(200).send({data: reg}); 
        }
          else {
         res.status(500).send({message:'NoAccess'});
       }
    } else {
     res.status(500).send({message:'NoAccess'});
    }
}



const actualizar_config_admin = async function (req , res) {
    if(req.user){
        if(req.user.role == 'gerente'){
          
         let data = req.body; 

         if(req.files){
             // si hay imagen 
            
          var img_path = req.files.logo.path; 
          var name = img_path.split('/')
          var logo_name = name[2];
         
          let reg = await config.findByIdAndUpdate({_id:"654e6824e6880da59ee4beff"},
          {
             servicios: JSON.parse(data.servicios),
             titulo: data.titulo,
             serie : data.serie,
             logo: logo_name,
             corrrelativo: data.correlativo
          });

          fs.stat('./uploads/configuraciones/'+reg.logo, function(err){
            if(!err){
               fs.unlink('./uploads/configuraciones/'+reg.logo ,(err)=>{
                  if(err)  throw err ; 
  
               })
             }
             
            });
           
            res.status(200).send({data: reg});

         }else{

             let reg = await config.findByIdAndUpdate({_id:"654e6824e6880da59ee4beff"},
            {
               servicios: data.servicios,
               titulo: data.titulo,
               serie : data.serie,
               corrrelativo: data.correlativo
            }); 

            res.status(200).send({data: reg}); 

         }

          
         
        }else {
          res.status(500).send({message:'NoAccess'});
        }
     } else {
      res.status(500).send({message:'NoAccess'});
     }
}

const obtener_logo = async function(req, res) {
   var img = req.params['img']; 
   
   fs.stat('./uploads/configuraciones/'+img, function(err){
      if(!err){
         let path_img = './uploads/configuraciones/'+img; 
         res.status(200).sendFile(path.resolve(path_img))
      }
        else {
          let path_img = './uploads/default.jpg'; 
          res.status(200).sendFile(path.resolve(path_img))
        }
   })
}

const obtener_config_publico = async function (req , res) {
   
   let reg = await config.findById({_id: "654e6824e6880da59ee4beff"})
      
   res.status(200).send({data: reg}); 
}

const agregar_servicio = async function (req, res){
   if(req.user){
      if(req.user.role == 'gerente'){
       
       let id = "654e6824e6880da59ee4beff"
       let data = req.body; 
     
       var img_path = req.files.icono.path; 
       var name = img_path.split('/')
       var imagen_name = name[2];
 
       let reg = await config.findByIdAndUpdate ({_id: id}, {
         $push: { servicios:{
             titulo: data.titulo,
             categoria:data.categoria,
             icono: imagen_name, 
             _id: data._id
          }}
       })
        
       res.status(200).send({data: reg}); 
     
      }else {
        res.status(500).send({message:'NoAccess'});
      }
   } else {
    res.status(500).send({message:'NoAccess'});
   }
 
}

const eliminar_servicio = async function (req, res){
   if (req.user){
     if (req.user.role == 'gerente') {
        
       var id =  "654e6824e6880da59ee4beff";
       let data = req.body; 
 
       let reg = await config.findByIdAndUpdate ({_id: id}, { $pull :{servicios:{
         titulo: data.titulo,
         _id: data._id,
         categoria:data.categoria

     }}}) 
 
       fs.stat('./uploads/configuraciones/'+data.icono, function(err){
         if(!err){
            fs.unlink('./uploads/configuraciones/'+data.icono ,(err)=>{
               if(err)  throw err ; 
 
            })
          }
           else {
           
           }
         });
       
       res.status(200).send({data:reg}); 
        
     
     }else {
       res.status(500).send({message:'NoAccess'});
     }
   } else {
     res.status(500).send({message:'NoAccess'});
   }
 
 }

 const obtener_icono_servicio = async function(req, res) {
   var icono = req.params['icono']; 
   
   fs.stat('./uploads/configuraciones/'+icono, function(err){
      if(!err){
         let path_icono = './uploads/configuraciones/'+icono; 
         res.status(200).sendFile(path.resolve(path_icono))
      }
        else {
          let path_icono = './uploads/default.jpg'; 
          res.status(200).sendFile(path.resolve(path_icono))
        }
   })
}

const listar_servicios_nuevos_publico = async function(req, res) {
   try {
     // Encuentra el documento de configuración
     let configDoc = await config.findById("654e6824e6880da59ee4beff");
 
     if (configDoc && configDoc.servicios) {
       // Ordena los servicios por la propiedad 'createdAt' y limita a 8 resultados
       let serviciosOrdenados = configDoc.servicios.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
       res.status(200).send({ data: serviciosOrdenados });
     } else {
       res.status(404).send({ message: 'Configuración no encontrada o sin servicios' });
     }
   } catch (error) {
     console.error(error);
     res.status(500).send({ message: 'Error al listar los servicios' });
   }
 }
 


module.exports = {
    actualizar_config_admin,
    obtener_config_admin, 
    obtener_logo,
    obtener_config_publico,
    agregar_servicio,
    eliminar_servicio,
    obtener_icono_servicio,
    listar_servicios_nuevos_publico
}