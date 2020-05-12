Id_Turnos = null;

let ObtenerTurno = (Id_Turno) =>{


    Id_Turnos = Id_Turno;

  $.ajax({
      url: `${URL}/Turnos/ObtenerTurnos/${Id_Turnos}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtTurnoEdit").val(respuesta.data.Nombre);
    $("#InicioEdit").val(respuesta.data.Inicio);
    $("#FinEdit").val(respuesta.data.Fin);
    
      
  }).fail(error => {
      console.log(error);
  });
}

$(document).ready(function(){
  $('#EditarTurnos').click(function(){
      ObtenerTurno();
  });
});
