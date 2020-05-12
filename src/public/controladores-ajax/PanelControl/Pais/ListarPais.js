let ListarPais = () =>{ 
   

    $.ajax({
        url: `${URL}/Pais`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#TablaPais").empty();
         contador=0;
        for(let item of respuesta.data){
            contador++
            $("#TablaPais").append(`
            <tr>
            <td class="MyStyle_Id_Principal_Column">${item.Id_Pais}</td>
            <td>${contador}</td>
            <td>${item.Nombre_Pais}</td>
            <td class="text-nowrap">
                    <i class="fa fa-pencil text-inverse m-r-10" id="EditarPais" data-toggle="modal" data-target="#ModificarPais" onclick="ObtenerPais(${item.Id_Pais})" style="cursor:pointer;"></i>
                     <i class="fa fa-close text-danger" style="cursor:pointer;"></i>
                     <input type="checkbox" class="js-switch" id='Pais${item.Id_Pais}'/>
            </td>
        </tr>
        <tr>
            `);

            let Estado_Pais = item.Estado;

            var element = Array.prototype.slice.call(
              $("#Pais"+item.Id_Pais)
            );
            
            $("#Pais"+item.Id_Pais).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',
                className: 'switchery SwitchPais'    
            });

            if (Estado_Pais == 0) {
              s.setPosition(false, true);

          } else if (Estado_Pais == 1) {
              s.setPosition(true, true);
          }
        });
        }
        
    }).fail(error =>{
        console.log(error);
    });
}

$(document).on("click", ".SwitchPais ", function () {

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
        url: `${URL}/Pais/${Id}/${Estado}`,
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
    $('#PaisTab').click(function(){
        ListarPais();
    });
});
