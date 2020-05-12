let ListarRazones = () =>{ 
    

    $.ajax({
        url: `${URL}/Razones`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
      
        $("#TablaRazones").empty();
        contador=0;
        for(let item of respuesta.data){
            contador++
            $("#TablaRazones").append(`
                <tr>
                    <td class="MyStyle_Id_Principal_Column">${item.Id_Razon_Calificacion}</td>
                    <td>${contador}</td>
                    <td>${item.Razon}</td>
                    <td>${item.Tipo_Razon}</td>
                    <td class="text-nowrap">
                            <i class="fa fa-pencil text-inverse m-r-10 icon-edit" id="EditarRazones" data-toggle="modal" data-target="#ModificarRazones" onclick="ObtenerRazones(${item.Id_Razon_Calificacion})" style="cursor:pointer;"></i>
                            <i class="fa fa-close text-danger" onclick="EliminarRazones(${item.Id_Razon_Calificacion})" style="cursor:pointer;"></i>
                            
                    </td>
                </tr>
            `);
        }
       
    }).fail(error =>{
        console.log(error);
    });
}
  
$(document).ready(function(){
    $('#RazonesTab').click(function(){
        ListarRazones();
    });
});
