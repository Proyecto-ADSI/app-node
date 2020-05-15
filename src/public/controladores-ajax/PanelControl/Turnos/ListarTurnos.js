let ListarTurnos = () =>{ 

    let contador=0;

    $.ajax({
        url: `${URL}/Turnos`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{  
        $("#TablaTurnos").empty();

        for(let item of respuesta.data){
            contador++
            $("#TablaTurnos").append(`
            <tr>
            <td class="MyStyle_Id_Principal_Column">${item.Id_Turno}</td>
            <td>${contador}</td>
            <td>${item.Nombre}</td>
            <td>${item.Inicio}</td>
            <td>${item.Fin}</td>
            <td class="text-nowrap">
                    <i class="fa fa-pencil text-inverse m-r-10" id="EditarTurnos" data-toggle="modal" data-target="#ModificarTurno" onclick="ObtenerTurno(${item.Id_Turno})" style="cursor:pointer;"></i>
                    <i class="fa fa-close text-danger" onclick="EliminarTurnos(${item.Id_Turno})" style="cursor:pointer;"></i>  
                    <input type="checkbox" class="js-switch" id='Turno${item.Id_Turno}'/>
            </td>
        </tr>
        <tr>
        
            ` ); 

            let Estado_Turno = item.Estado;

            var element = Array.prototype.slice.call(
              $("#Turno"+item.Id_Turno)
            );
            
            $("#Turno"+item.Id_Turno).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',  
                className:'switchery SwitchTurno'   
            });

            if (Estado_Turno == 0) {
              s.setPosition(false, true);

          } else if (Estado_Turno == 1) {
              s.setPosition(true, true);
          }

    }
            );
        }



    }).fail(error =>{
        console.log(error);
    });

}

$(document).on("click", ".SwitchTurno", function () {

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
        url: `${URL}/Turnos/${Id}/${Estado}`,
        type: 'patch',
        datatype: 'json',
        success: function (datos) { 
        },
        error: function (error) {
            console.log(error);
        }
    });
  });
  


$(document).ready(function(){
    $('#TurnosTab').click(function(){
        ListarTurnos();
        $('.clockpicker').clockpicker();
    });
});
