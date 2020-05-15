let ListarBarrioVereda = () =>{ 
    let contador=0;

    $.ajax({
        url: `${URL}/BarriosVeredas`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#TablaBarriosVeredas").empty();

        for(let item of respuesta.data){
            contador++
            $("#TablaBarriosVeredas").append(`
            <tr>
            <td class="MyStyle_Id_Principal_Column">${item.Id_Barrios_Veredas}</td>
            <td>${contador}</td>
            <td>${item.Nombre_Barrio_Vereda}</td>
            <td>${item.SubTipo}</td>
            <td class="text-nowrap">
                    <i class="fa fa-pencil text-inverse m-r-10" id="EditarBarriosVeredas" data-toggle="modal" data-target="#ModificarBarrioVereda" onclick="ObtenerBarriosVereda(${item.Id_Barrios_Veredas})" style="cursor:pointer;"></i>
                     <i class="fa fa-close text-danger" onclick="EliminarBarrioVereda(${item.Id_Barrios_Veredas})" style="cursor:pointer;"></i>
                     <input type="checkbox" class="js-switch" id='BarriosVeredas${item.Id_Barrios_Veredas}'/>
            </td>
        </tr>
        <tr>
            `);

            let Estado_BarriosVeredas = item.Estado;

            var element = Array.prototype.slice.call(
              $("#BarriosVeredas"+item.Id_Barrios_Veredas)
            );
            
            $("#BarriosVeredas"+item.Id_Barrios_Veredas).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',
                className:'switchery SwitchBarrioVereda'   
            });

            if (Estado_BarriosVeredas == 0) {
              s.setPosition(false, true);

          } else if (Estado_BarriosVeredas == 1) {
              s.setPosition(true, true);
          }

    }
            );

        }
       
    }).fail(error =>{
        console.log(error);
    });
}

$(document).on("click", ".SwitchBarrioVereda", function () {

    let fila = $(this).closest("tr");
    let switchElem = fila.find('.js-switch')[0];
    let Id = parseInt(fila.find('td:eq(0)').text());
  
    
  
    // Cambiar Estado Documento
    let Estado;
    if(switchElem.checked){
  
        Estado = 1;
  
    }else{
        Estado = 0;
    } 
  
    $.ajax({
        url: `${URL}/BarriosVeredas/${Id}/${Estado}`,
        type: 'patch',
        datatype: 'json',
        success: function (datos) { 
        },
        error: function (error) {
            console.log(error);
        }
    });
});


ListarSubTipo1 = () => {
    $.ajax({
      url: `${URL}/SubTipo`,
      dataType: "json",
      type: "GET",
    })
      .done((respuesta) => {
        $("#SelectSubTipo1").empty();
        $("#SelectSubTipo1").append(`
  
          <option selected disabled value="">Seleccione un sub tipo</option>
  
              `);
        for (let item of respuesta.data) {

            let Estado_SubTipo = item.Estado;

          $("#SelectSubTipo1").append(`
                  ${Estado_SubTipo == 1 ? `<option value='${item.Id_SubTipo_Barrio_Vereda}'>${item.SubTipo}</option>` : ``}
                `);
        }
      })
      .fail((error) => {
        console.log(error);
      });
}


let ListarMunicipio1 = () => {
    $.ajax({
      url: `${URL}/Municipio`,
      dataType: "json",
      type: "GET",
    }).done((respuesta) => {
        $("#SelectMunicipio1").empty();
        $("#SelectMunicipio1").append(`
  
          <option selected disabled value="">Seleccione un municipio</option>
  
              `);
        for (let item of respuesta.data) {

            let Estado_Municipio = item.Estado;

          $("#SelectMunicipio1").append(`
                  ${Estado_Municipio == 1 ? `<option value='${item.Id_Municipio}'>${item.Nombre_Municipio}</option>` : ``}

                `);
        }
      }).fail((error) => {
        console.log(error);
      });
}

$(document).ready(function(){
    $('#BarriosVeredasTab').click(function(){
        ListarBarrioVereda()
        ListarSubTipo1()
        ListarMunicipio1()
    });
});
