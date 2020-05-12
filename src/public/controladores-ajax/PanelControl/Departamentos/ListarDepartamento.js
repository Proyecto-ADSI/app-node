let ListarDepartamento = () =>{ 
   

    $.ajax({
        url: `${URL}/Departamento`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#TablaDepartamento").empty();
         contador=0;
        for(let item of respuesta.data){
            contador++
            $("#TablaDepartamento").append(`
            <tr>
            <td class="MyStyle_Id_Principal_Column">${item.Id_Departamento}</td>
            <td>${contador}</td>
            <td>${item.Nombre_Departamento}</td>
            <td class="text-nowrap">
                    <i class="fa fa-pencil text-inverse m-r-10" data-toggle="modal" data-target="#ModificarDepartamento" id="EditarDepartamento" onclick="ObtenerDepartamento(${item.Id_Departamento})" style="cursor:pointer;"></i>
                     <i class="fa fa-close text-danger" style="cursor:pointer;"></i>
                     <input type="checkbox" class="js-switch" id='Departamento${item.Id_Departamento}'/>
            </td>
        </tr>
        <tr>
            `);
            let Estado_Departamento = item.Estado_Departamento;

            var element = Array.prototype.slice.call(
              $("#Departamento"+item.Id_Departamento)
            );
            
            $("#Departamento"+item.Id_Departamento).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',
                className:'switchery SwitchDepartamento'     
            });

            if (Estado_Departamento == 0) {
              s.setPosition(false, true);

          } else if (Estado_Departamento == 1) {
              s.setPosition(true, true);
          }

    }
            );
}
        
    }).fail(error =>{   
        console.log(error);
    });
}


$(document).on("click", ".SwitchDepartamento ", function () {

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
        url: `${URL}/Departamento/${Id}/${Estado}`,
        type: 'patch',
        datatype: 'json',
        success: function (datos) { 
        },
        error: function (error) {
            console.log(error);
        }
    });
  });
  


ListarPais1 = () =>{


    $.ajax({
        url: `${URL}/Pais`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#SelectPais").empty();
        $("#SelectPais").append(`

        <option selected disabled value="">Seleccione el país</option>

            `);
        for(let item of respuesta.data){

            let Estado_Pais = item.Estado; 

            $("#SelectPais").append(`
               ${Estado_Pais == 1 ? `<option value='${item.Id_Pais}'>${item.Nombre_Pais}</option>` : 
               ``}
               `);
        }
    }).fail(error =>{
        console.log(error);
    });
}








$(document).ready(function(){
    $('#DepartamentosTab').click(function(){
        ListarDepartamento();
        ListarPais1();
    });
});
