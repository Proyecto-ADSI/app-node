let ListarCalificacion = () =>{ 
    

    $.ajax({
        url: `${URL}/Calificaciones`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
      
        $("#TablaCalificacion").empty();
        contador=0;
        for(let item of respuesta.data){
            contador++
            $("#TablaCalificacion").append(`
                <tr>
                    <td class="MyStyle_Id_Principal_Column">${item.Id_Calificacion_Operador}</td>
                    <td>${contador}</td>
                    <td>${item.Calificacion}</td>
                    <td class="text-nowrap">
                            <i class="fa fa-pencil text-inverse m-r-10 icon-edit" id="EditarCalificacion" data-toggle="modal" data-target="#ModificarCalificacion" onclick="ObtenerCalificacion(${item.Id_Calificacion_Operador})" style="cursor:pointer;"></i>
                            <i class="fa fa-close text-danger" onclick="EliminarCalificacion(${item.Id_Calificacion_Operador})" style="cursor:pointer;"></i>
                            <input type="checkbox" class="js-switch" id='Calificacion${item.Id_Calificacion_Operador}'/>
                    </td>
                </tr>
            `);
            
            let Estado_Calificacion = item.Estado_Calificacion;

            var element = Array.prototype.slice.call(
              $("#Calificacion"+item.Id_Calificacion_Operador)
            );
            
            $("#Calificacion"+item.Id_Calificacion_Operador).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',  
                className:'switchery SwitchCalificacion'   
                });

                if (Estado_Calificacion == 0) {
                s.setPosition(false, true);
                } else if (Estado_Calificacion == 1) {
                s.setPosition(true, true);
                }

            });
        }
       
    }).fail(error =>{
        console.log(error);
    });
}

$(document).on("click", ".SwitchCalificacion", function () {

    let fila = $(this).closest("tr");
    let switchElem = fila.find('.js-switch')[0];
    let Id = parseInt(fila.find('td:eq(0)').text());
  
    let Estado;
    if(switchElem.checked){
        Estado = 1;
    }else{
        Estado = 0;
    } 
  
    $.ajax({
        url: `${URL}/Calificaciones/${Id}/${Estado}`,
        type: 'patch',
        datatype: 'json',
        success: function (datos) {
           
        },
        error: function (error) {
            console.log(error)
        }
    });
  });
  
$(document).ready(function(){
    $('#CalificacionesTab').click(function(){
        ListarCalificacion();
    });
});
