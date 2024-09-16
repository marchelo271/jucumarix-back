var Solicitud= require('../models/solicitud');
var Dsolicitud = require ('../models/dsolicitud'); 
var Producto = require ('../models/producto'); 

const registro_solicitud_cliente = async function(req, res) {
  if (req.user) {
      try {
          var data = req.body;
          var detalles = data.detalles;

          var solicitud_last = await Solicitud.find().sort({ createdAt: -1 });
          var num_solicitudes;

          if (solicitud_last.length == 0) {
              num_solicitudes = 1;
          } else {
              num_solicitudes = solicitud_last.length + 1;
          }

          data.num_solicitudes = num_solicitudes;

          // Verifica que data.cliente esté presente
          if (!data.cliente) {
              return res.status(400).send({ message: 'El campo cliente es obligatorio.' });
          }

          let solicitud = await Solicitud.create(data);
          for (const element of detalles) {
              element.solicitud = solicitud._id;
              await Dsolicitud.create(element);

              let element_producto = await Producto.findById({_id: element.producto}); 
              let new_Nsolicitudes = element_producto.Nsolicitudes + 1 ; 
              
              await Producto.findByIdAndUpdate({_id: element.producto}, {
                Nsolicitudes: new_Nsolicitudes
              }); 
          }
         
 

          res.status(200).send({ solicitud: solicitud });
      } catch (error) {
          res.status(500).send({ message: 'Error en el servidor', error });
      }
  } else {
      res.status(500).send({ message: 'NoAccess' });
  }
}


module.exports ={
    registro_solicitud_cliente
}