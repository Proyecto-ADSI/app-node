Id_Documentos = null;

let ObtenerDocumento = (Id_Documento) =>{


    Id_Documentos = Id_Documento;

  $.ajax({
      url: `${URL}/Documento/ObtenerDatosDocumento/${Id_Documentos}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtDocumentoEdit").val(respuesta.data.Nombre);
    
      
  }).fail(error => {
      console.log(error);
  });
}

$(document).ready(function(){
  $('#EditarDocumento').click(function(){
      ObtenerDocumento();
  });
});
