let ListarSexo = () =>{ 
   
    $.ajax({
        url: `${URL}/Sexo`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#TablaSexo").empty();
         contador=0;
        for(let item of respuesta.data){
            contador++
            $("#TablaSexo").append(`
            <tr>
            <td class="MyStyle_Id_Principal_Column">${item.Id_Sexo}</td>
            <td>${contador}</td>
            <td>${item.Nombre}</td>
            <td class="text-nowrap">
                    <i class="fa fa-pencil text-inverse m-r-10" id="EditarSexo" data-toggle="modal" data-target="#ModificarSexo" onclick="ObtenerSexo(${item.Id_Sexo})" style="cursor:pointer;"></i>
                     <i class="fa fa-close text-danger" style="cursor:pointer;"></i>
                     <input type="checkbox" id='${item.Id_Sexo}' class="js-switch"/>
            </td>
        </tr>
        <tr>
            `);
            let Estado_Sexo = item.Estado;

            var element = Array.prototype.slice.call(
              $("#"+item.Id_Sexo)
            );
            
            $("#"+item.Id_Sexo).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',
                className: 'switchery SwitchSexo'

            });

            if (Estado_Sexo == 0) {
              s.setPosition(false, true);

          } else if (Estado_Sexo == 1) {
              s.setPosition(true, true);
          }
        });
      
        }
        
    }).fail(error =>{
        console.log(error);
    });
}
$(document).on("click", ".SwitchSexo ", function () {

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
        url: `${URL}/Sexo/${Id}/${Estado}`,
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
    $('#SexoTab').click(function(){
        ListarSexo();
    });
});




