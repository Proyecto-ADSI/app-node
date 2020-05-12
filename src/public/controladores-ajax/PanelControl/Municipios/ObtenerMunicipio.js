Id_Municipios = null;
Id_Departamentoo1 = null;


 ListarDepartamento2 = (Id_Departamentoo1) =>{


    $.ajax({
        url: `${URL}/Departamento`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#SelectDepartamentoEdit").empty();
        $("#SelectDepartamentoEdit").append(`

        <option selected disabled value="">Seleccione el departamento</option>

            `);
        for (let item of respuesta.data ) {
           
            let Estado_Departamento = item.Estado_Departamento;

             if (item.Id_Departamento == Id_Departamentoo1) {
                 var $opcion = $('<option />', {
                    text: `${item.Nombre_Departamento}`,
                    value: `${item.Id_Departamento}`,
                    selected: true
             })
            }
             else{
                var $opcion = $('<option />', {
                    text: `${item.Nombre_Departamento}`,
                    value: `${item.Id_Departamento}`
                })
             }

             if (Estado_Departamento == 1) {
                $('#SelectDepartamentoEdit').append($opcion);
            }
            else if (Estado_Departamento == 0){
                $('#SelectDepartamentoEdit').append(``);
            }

            }


    }).fail(error =>{
        console.log(error);
    });
}


let ObtenerMunicipio = (Id_Municipio) =>{


    Id_Municipios = Id_Municipio;


  $.ajax({
      url: `${URL}/Municipio/ObtenerMunicipio/${Id_Municipios}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtMunicipioEdit").val(respuesta.data.Nombre_Municipio);
    // $("#SelectDepartamentoEdit").val(respuesta.data.Id_Departamento, respuesta.data.Nombre_Departamento);

    ListarDepartamento2(respuesta.data.Id_Departamento);
    
      
  }).fail(error => {
      console.log(error);
  });
}



$(document).ready(function(){
    $('#EditarMunicipio').click(function(){
       ObtenerMunicipio();
    });
});
