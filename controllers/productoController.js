'use strict'

const { log } = require('console');
var Producto = require ('../models/producto'); 
var Review = require ('../models/review');
var fs = require('fs'); 
var path= require('path'); 


const registro_producto_admin = async function(req,res){
   if(req.user){
      if(req.user.role == 'gerente'){
         let data = req.body; 
        
         var img_path = req.files.portada.path; 
         var name = img_path.split('/')
         var portada_name = name[2];

         data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,''); 
         data.portada = portada_name; 
         let reg = await Producto.create(data); 

        res.status(200).send({data: reg}); 
      }else {
        res.status(500).send({message:'NoAccess'});
      }
   } else {
    res.status(500).send({message:'NoAccess'});
   }

}

const listar_producto_admin = async function(req, res) {
   if(req.user){
      if(req.user.role == 'gerente'){
        
        var filtro= req.params['filtro'];
        let reg = await Producto.find({titulo: new RegExp(filtro, 'i')})
        res.status(200).send({data: reg}); 
        
      }else {
        res.status(500).send({message:'NoAccess'});
      }
   } else {
    res.status(500).send({message:'NoAccess'});
   }

}

const obtener_portada = async function(req, res) {
     var img = req.params['img']; 
     
     fs.stat('./uploads/producto/'+img, function(err){
        if(!err){
           let path_img = './uploads/producto/'+img; 
           res.status(200).sendFile(path.resolve(path_img))
        }
          else {
            let path_img = './uploads/default.jpg'; 
            res.status(200).sendFile(path.resolve(path_img))
          }
     })
}

const obtener_producto_admin = async function (req, res ){
   if (req.user){
     if (req.user.role == 'gerente') {
        
       var id = req.params['id']; 
      
      try {
       var reg = await Producto.findById({_id:id}); 
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
 
 const actualizar_producto_admin = async function(req,res){
  if(req.user){
     if(req.user.role == 'gerente'){
      
      let id = req.params['id'];
      let data = req.body; 
     
       
        if (req.files){
          // si hay imagen 
          var img_path = req.files.portada.path; 
          var name = img_path.split('/')
          var portada_name = name[2]; 
          
          let reg = await Producto.findByIdAndUpdate({_id:id} , {
            titulo:data.titulo, 
            mapa:data.mapa,
            precio: data.precio, 
            categoria: data.categoria, 
            serv_domicilio:data.serv_domicilio, 
            premium:data.premium,
            ciudad: data.ciudad, 
            telefono: data.telefono,
            wpp:data.wpp, 
            facebook:data.facebook,
            instagram: data.instagram, 
            tiktok: data.tiktok, 
            correo: data.correo,
            web: data.web,
            direccion_neg:data.direccion_neg,
            descripcion: data.descripcion,
            contenido:data.contenido,
            portada: portada_name
         }); 

         fs.stat('./uploads/producto/'+reg.portada, function(err){
          if(!err){
             fs.unlink('./uploads/producto/'+reg.portada ,(err)=>{
                if(err)  throw err ; 

             })
           }
            else {
            
            }
          })

         res.status(200).send({data: reg}); 

        }else {
           // no hay imagen 
          let reg = await Producto.findByIdAndUpdate({_id:id} , {
             titulo:data.titulo, 
             stock:data.stock,
             precio: data.precio, 
             categoria: data.categoria, 
             serv_domicilio:data.serv_domicilio, 
             premium:data.premium,
             ciudad: data.ciudad, 
             telefono: data.telefono,
             wpp:data.wpp, 
             facebook:data.facebook,
             instagram: data.instagram, 
             tiktok: data.tiktok, 
             correo: data.correo,
             web:data.web, 
             direccion_neg:data.direccion_neg,
             descripcion:data.descripcion,
             contenido:data.contenido  
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

const eliminar_producto_admin = async function (req, res){
  if (req.user){
    if (req.user.role == 'gerente') {
       
      var id = req.params['id']; 

      let reg = await Producto.findByIdAndRemove({_id:id}); 

      fs.stat('./uploads/producto/'+reg.portada, function(err){
        if(!err){
           fs.unlink('./uploads/producto/'+reg.portada ,(err)=>{
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





const actualizar_producto_variedades_admin = async function(req,res){
  if(req.user){
     if(req.user.role == 'gerente'){
      
      let id = req.params['id'];
      let data = req.body; 
     
      let reg = await Producto.findByIdAndUpdate({_id:id} , {
        variedades:  data.variedades ,
        titulo_variedades: data.titulo_variedades
     }); 
     res.status(200).send({data: reg}); 
       

     }else {
       res.status(500).send({message:'NoAccess'});
     }
  } else {
   res.status(500).send({message:'NoAccess'});
  }

}

const agregar_imagen_galeria_admin = async function(req,res){
  if(req.user){
     if(req.user.role == 'gerente'){
      
      let id = req.params['id'];
      let data = req.body; 
    
      var img_path = req.files.imagen.path; 
      var name = img_path.split('/')
      var imagen_name = name[2];

      let reg = await Producto.findByIdAndUpdate ({_id: id}, {
        $push: { galeria:{
            imagen: imagen_name, 
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


const eliminar_imagen_galeria_admin = async function(req,res){
  if(req.user){
     if(req.user.role == 'gerente'){
      
      let id = req.params['id'];
      let data = req.body; 
    
      
      let reg = await Producto.findByIdAndUpdate ({_id: id}, { $pull :{galeria:{
          _id: data._id
      }}})
      
      fs.stat('./uploads/producto/' + data.imagen, function(err) {
        if (!err) {
          fs.unlink('./uploads/producto/' + data.imagen, (err) => {
            if (err) throw err;
            // File deleted successfully, now you can send the response
            res.status(200).send({ data: reg });
          });
        } else {
          // Handle the error when checking file existence
          console.error(err);
          res.status(500).send({ message: 'Error checking file existence' });
        }
      });
     
    
    
     }else {
       res.status(500).send({message:'NoAccess'});
     }
  } else {
   res.status(500).send({message:'NoAccess'});
  }

}

//----------------Metodos publicos  ----------- 

const listar_producto_publico = async function(req, res) {
  const categoria = req.query['categoria'];
  const ciudad = req.query['ciudad'];

 

  let query = {};

  if (categoria) {
    query.categoria = new RegExp(categoria, 'i');
  }

  if (ciudad) {
    query.ciudad = new RegExp(ciudad, 'i');
  }

  
  
  try {
    let reg = await Producto.find(query).sort({ createdAt: -1 });
    res.status(200).send({ data: reg });
    
  } catch (error) {
    res.status(500).send({ message: 'Error en la solicitud', error: error.message });
  }
}



const obtener_producto_slug_publico = async function(req, res) {
         
  var slug= req.params['slug'];

  let reg = await Producto.findOne({slug: slug})
  res.status(200).send({data: reg}); 
}

const listar_producto_recomendado_publico = async function(req, res) {
         
  var categoria= req.params['categoria'];

  let reg = await Producto.find({categoria: categoria}).sort({createdAt: -1 }).limit(8); 
  res.status(200).send({data: reg}); 
} 

const listar_productos_nuevos_publico = async function(req, res) {
         
   let reg = await Producto.find().sort({createdAt: -1 }).limit(8); 
  res.status(200).send({data: reg}); 

}

const listar_productos_masvendidos_publico = async function(req, res) {
         
  let reg = await Producto.find().sort({Nsolicitudes: -1 }).limit(8); 
 res.status(200).send({data: reg}); 
}



const obtener_reviews_producto_publico = async function(req, res) {
         
 let id = req.params['id']; 

 let reviews = await Review.find({producto:id}).populate('cliente').sort({createdAt: -1});
 res.status(200).send({data: reviews}); 

}

module.exports = {
   registro_producto_admin,
   listar_producto_admin, 
   obtener_portada, 
   obtener_producto_admin, 
   actualizar_producto_admin, 
   eliminar_producto_admin,
   actualizar_producto_variedades_admin,
   agregar_imagen_galeria_admin,
   eliminar_imagen_galeria_admin,
   listar_producto_publico,
   obtener_producto_slug_publico,
   listar_producto_recomendado_publico, 
   listar_productos_nuevos_publico,
   listar_productos_masvendidos_publico,
   obtener_reviews_producto_publico
 }