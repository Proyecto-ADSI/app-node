Id_Barrios_Veredass = null;
Id_SubTipoo1 = null;
Id_Municipioo1 = null;


 ListarSubTipo2 = (Id_SubTipoo1) =>{


    $.ajax({
        url: `${URL}/SubTipo`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#SelectSubTipoEdit1").empty();
        $("#SelectSubTipoEdit1").append(`

        <option selected disabled value="">Seleccione un subtipo</option>

            `);
        for (let item of respuesta.data ) {
           
            let Estado_SubTipo = item.Estado;

             if (item.Id_SubTipo_Barrio_Vereda == Id_SubTipoo1) {
                 var $opcion = $('<option />', {
                    text: `${item.SubTipo}`,
                    value: `${item.Id_SubTipo_Barrio_Vereda}`,
                    selected: true
             })
            }
             else{
                var $opcion = $('<option />', {
                    text: `${item.SubTipo}`,
                    value: `${item.Id_SubTipo_Barrio_Vereda}`
                })
             }

             if (Estado_SubTipo == 1) {
                $('#SelectSubTipoEdit1').append($opcion);
            }
            else if (Estado_SubTipo == 0){
                $('#SelectSubTipoEdit1').append(``);
            }

            }
    }).fail(error =>{
        console.log(error);
    });
}



ListarMunicipio2 = (Id_Municipioo1) =>{


    $.ajax({
        url: `${URL}/Municipio`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#SelectMunicipioEdit1").empty();
        $("#SelectMunicipioEdit1").append(`

        <option selected disabled value="">Seleccione el municipio</option>

            `);
        for (let item of respuesta.data ) {
           
            let Estado_Municipio = item.Estado;

             if (item.Id_Municipio == Id_Municipioo1) {
                 var $opcion = $('<option />', {
                    text: `${item.Nombre_Municipio}`,
                    value: `${item.Id_Municipio}`,
                    selected: true
             })
            }
             else{
                var $opcion = $('<option />', {
                    text: `${item.Nombre_Municipio}`,
                    value: `${item.Id_Municipio}`
                })
             }

             if (Estado_Municipio == 1) {
                $('#SelectMunicipioEdit1').append($opcion);
            }
            else if (Estado_Municipio == 0){
                $('#SelectMunicipioEdit1').append(``);
            }

            }
    }).fail(error =>{
        console.log(error);
    });
}

let ObtenerBarriosVereda = (Id_Barrios_Veredas) =>{


    Id_Barrios_Veredass = Id_Barrios_Veredas;


  $.ajax({
      url: `${URL}/BarriosVeredas/ObtenerBarriosVereda/${Id_Barrios_Veredass}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtCodigoEdit").val(respuesta.data.Codigo);
    $("#TxtBarrioVeredaEdit").val(respuesta.data.Nombre_Barrio_Vereda);
    // $("#SelectSubTipoEdit1").val(respuesta.data.Id_SubTipo_Barrio_Vereda, respuesta.data.SubTipo);
    // $("#SelectMunicipioEdit1").val(respuesta.data.Id_Municipio, respuesta.data.Nombre_Municipio);
    ListarSubTipo2(respuesta.data.Id_SubTipo_Barrio_Vereda);
    ListarMunicipio2(respuesta.data.Id_Municipio);
  
    
      
  }).fail(error => {
      console.log(error);
  });
}

// $(function(){
//     ListarMunicipio2();
//     ListarSubTipo2();
// });

$(document).ready(function(){
    $('#EditarBarriosVeredas').click(function(){
        ObtenerBarriosVereda();
    });
});
