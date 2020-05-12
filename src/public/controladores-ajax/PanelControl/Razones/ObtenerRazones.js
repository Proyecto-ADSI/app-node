Id_Razones_Operador = null;

let ObtenerRazones = (Id_Razones) =>{

    Id_Razones_Operador = Id_Razones;

  $.ajax({
      url: `${URL}/Razones/ObtenerRazones/${Id_Razones_Operador}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtRazonesEdit").val(respuesta.data.Razon);
    
    let arrayConclusion =  $('#txtTipo_RazonEdit option')

    for(let item of arrayConclusion){
        
        let tipo = $(item).val()

        if(tipo == respuesta.data.Tipo_Razon ){
            $(item).attr("selected",true)
        }else{
          $(item).removeAttr("selected")
        }
    }
      
  }).fail(error => {
      console.log(error);
  })
}

$(document).ready(function(){
  $('#EditarRazones').click(function(){
    ObtenerRazones();
  })
})
