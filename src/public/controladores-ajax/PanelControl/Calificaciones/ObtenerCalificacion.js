Id_Calificacion_Operador = null;

let ObtenerCalificacion = (Id_Calificacion) =>{


    Id_Calificacion_Operador = Id_Calificacion;

  $.ajax({
      url: `${URL}/Calificaciones/ObtenerCalificacion/${Id_Calificacion_Operador}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtCalificacionEdit").val(respuesta.data.Calificacion);
    
      
  }).fail(error => {
      console.log(error);
  });
}

$(document).ready(function(){
  $('#EditarCalificacion').click(function(){
    ObtenerCalificacion();
  });
});
