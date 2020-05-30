let ListarOperador = () =>{ 
    

    $.ajax({
        url: `${URL}/Operador`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#TablaOperador").empty();
        contador=0;
        for(let item of respuesta.data){

            contador++
            $("#TablaOperador").append(`
            <tr>
            <td class="MyStyle_Id_Principal_Column">${item.Id_Operador}</td>
            <td>${contador}</td>
            <td>${item.Nombre_Operador}</td>
            <td> <i class="fa fa-spin fa-circle-o-notch" id="Circulo" style="color:${item.Color}; font-size:22px;"></i></td>
            <td class="text-nowrap">
                    <i class="fa fa-pencil text-inverse m-r-10 icon-edit" id="EditarOperador" data-toggle="modal" data-target="#ModificarOperador" onclick="ObtenerOperador(${item.Id_Operador})" style="cursor:pointer;"></i>
                     <i class="fa fa-close text-danger" onclick="EliminarOperador(${item.Id_Operador})" style="cursor:pointer;"></i>
                     <input type="checkbox" class="js-switch" id='Operador${item.Id_Operador}'/>
            </td>
        </tr>
        <tr>
            `);

        
            let Estado_Operador = item.Estado_Operador;

            var element = Array.prototype.slice.call(
              $("#Operador"+item.Id_Operador)
            );
            
            $("#Operador"+item.Id_Operador).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',  
                className:'switchery SwitchOperador'   
            });

            if (Estado_Operador == 0) {
              s.setPosition(false, true);

          } else if (Estado_Operador == 1) {
              s.setPosition(true, true);
          }

    }
            );
        }
       
    }).fail(error =>{
        console.log(error);
    });
}

$(document).on("click", ".SwitchOperador", function () {

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
        url: `${URL}/Operador/${Id}/${Estado}`,
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
    $('#OperadoresTab').click(function(){
        ListarOperador();
    });
});
