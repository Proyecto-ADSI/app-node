let ListarMunicipio = () =>{ 
   

    $.ajax({
        url: `${URL}/Municipio`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#TablaMunicipio").empty();
         contador=0;
        for(let item of respuesta.data){
            contador++
            $("#TablaMunicipio").append(`
            <tr>
            <td class="MyStyle_Id_Principal_Column">${item.Id_Municipio}</td>
            <td>${contador}</td>
            <td>${item.Nombre_Municipio}</td>
            <td class="text-nowrap">
                    <i class="fa fa-pencil text-inverse m-r-10" id="EditarMunicipio" data-toggle="modal" data-target="#ModificarMunicipio" onclick="ObtenerMunicipio(${item.Id_Municipio})" style="cursor:pointer;"></i>
                     <i class="fa fa-close text-danger" style="cursor:pointer;"></i>
                     <input type="checkbox" class="js-switch" id='Municipio${item.Id_Municipio}'/>
            </td>
        </tr>
        <tr>
            `);
            let Estado_Municipio = item.Estado;

            var element = Array.prototype.slice.call(
              $("#Municipio"+item.Id_Municipio)
            );
            
            $("#Municipio"+item.Id_Municipio).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',
                className: 'switchery SwitchMunicipio'
            });

            if (Estado_Municipio == 0) {
              s.setPosition(false, true);

          } else if (Estado_Municipio == 1) {
              s.setPosition(true, true);
          }

    }
            );
        }
      
    }).fail(error =>{
        console.log(error);
    });
}


let ListarDepartamento1 = () =>{


    $.ajax({
        url: `${URL}/Departamento`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#SelectDepartamento").empty();
        $("#SelectDepartamento").append(`

        <option selected disabled value="">Seleccione un departamento</option>

            `);
        for(let item of respuesta.data){

            let Estado_Departamento1 = item.Estado_Departamento;

            $("#SelectDepartamento").append(`
                ${Estado_Departamento1 == 1 ? `<option value='${item.Id_Departamento}'>${item.Nombre_Departamento}</option>` : ``}
              `);
        }
    }).fail(error =>{
        console.log(error);
    });
}


$(document).on("click", ".SwitchMunicipio ", function () {

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
        url: `${URL}/Municipio/${Id}/${Estado}`,
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
    $('#MunicipioTab').click(function(){
        ListarMunicipio();
        ListarDepartamento1();
    });
});
