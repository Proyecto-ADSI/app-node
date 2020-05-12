Id_Paiss = null;

let ObtenerPais = (Id_Pais) =>{


    Id_Paiss = Id_Pais;

  $.ajax({
      url: `${URL}/Pais/ObtenerPais/${Id_Paiss}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtPaisEdit").val(respuesta.data.Nombre_Pais);
    
      
  }).fail(error => {
      console.log(error);
  });
}

$(document).ready(function(){
  $('#EditarPais').click(function(){
      ObtenerPais();
  });
});
