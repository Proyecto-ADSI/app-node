Id_Operadorr = null;

let ObtenerOperador = (Id_Operador) =>{


    Id_Operadorr = Id_Operador;

  $.ajax({
      url: `${URL}/Operador/ObtenerOperador/${Id_Operadorr}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtOperadorEdit").val(respuesta.data.Nombre_Operador);
    
      
  }).fail(error => {
      console.log(error);
  });
}

$(document).ready(function(){
  $('#EditarOperador').click(function(){
      ObtenerOperador();
  });
});
