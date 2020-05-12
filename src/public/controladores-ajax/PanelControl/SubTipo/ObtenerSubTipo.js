Id_SubTipo = null;

let ObtenerSubTipo = (Id_SubTipo_Barrio_Vereda) =>{


    Id_SubTipo = Id_SubTipo_Barrio_Vereda;

  $.ajax({
      url: `${URL}/SubTipo/ObtenerSubTipo/${Id_SubTipo}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtSubTipoEdit").val(respuesta.data.SubTipo);
    
      
  }).fail(error => {
      console.log(error);
  });
}

$(document).ready(function(){
  $('#EditarSubTipo').click(function(){
     ObtenerSubTipo();
  });
});
