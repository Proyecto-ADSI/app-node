let ListarSubTipo = () =>{ 
    

    $.ajax({
        url: `${URL}/SubTipo`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#TablaSubTipo").empty();
        contador=0;
        for(let item of respuesta.data){
            contador++
            $("#TablaSubTipo").append(`
            <tr>
            <td class="MyStyle_Id_Principal_Column">${item.Id_SubTipo_Barrio_Vereda}</td>
            <td>${contador}</td>
            <td>${item.SubTipo}</td>
            <td class="text-nowrap">
                    <i class="fa fa-pencil text-inverse m-r-10" id="EditarSubTipo" data-toggle="modal" data-target="#ModificarSubTipo" onclick="ObtenerSubTipo(${item.Id_SubTipo_Barrio_Vereda})" style="cursor:pointer;"></i>
                     <i class="fa fa-close text-danger" style="cursor:pointer;"></i>
                     <input type="checkbox" class="js-switch" id='SubTipo${item.Id_SubTipo_Barrio_Vereda}'/>
            </td>
        </tr>
        <tr>
            `); 
            let Estado_SubTipo = item.Estado;

            var element = Array.prototype.slice.call(
              $("#SubTipo"+item.Id_SubTipo_Barrio_Vereda)
            );
            
            $("#SubTipo"+item.Id_SubTipo_Barrio_Vereda).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',  
                className:'switchery SwitchSubTipo'   
            });

            if (Estado_SubTipo == 0) {
              s.setPosition(false, true);

          } else if (Estado_SubTipo == 1) {
              s.setPosition(true, true);
          }

    }
            );
        }
     
    }).fail(error =>{
        console.log(error);
    });
}

$(document).on("click", ".SwitchSubTipo", function () {

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
        url: `${URL}/SubTipo/${Id}/${Estado}`,
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
    $('#SubTipoTab').click(function(){
        ListarSubTipo();
    });
});
