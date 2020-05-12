let ListarDocumento = () => {
  let contador = 0;

  $.ajax({
    url: `${URL}/Documento`,
    dataType: "json",
    type: "GET",
  })
    .done((respuesta) => {
      $("#TablaDocumento").empty();

      for (let item of respuesta.data) {
        contador++;

        $("#TablaDocumento").append(`
            <tr>
            <td class="MyStyle_Id_Principal_Column">${item.Id_Documento}</td>
            <td>${contador}</td>
            <td>${item.Nombre}</td>
            <td class="text-nowrap">
                    <i class="fa fa-pencil text-inverse m-r-10" id="EditarDocumento" data-toggle="modal" data-target="#ModificarDocumento" onclick="ObtenerDocumento(${item.Id_Documento})" style="cursor:pointer;"></i>
                    <i class="fa fa-close text-danger" onclick="EliminarDocumento(${item.Id_Documento})" style="cursor:pointer;"></i>  
                    <input type="checkbox"  id='Documento${item.Id_Documento}' class="js-switch"/>
            </td>
        </tr>
        <tr>
        
            `);
            
            let Estado_Documento = item.Estado_Documento;

            var element = Array.prototype.slice.call(
              $("#Documento"+item.Id_Documento)
            );
            
            $("#Documento"+item.Id_Documento).each(function () {
      
              let s = new Switchery($(this)[0],{
                color: '#26c6da',
                secondaryColor: '#f62d51',
                size: 'small',
                className:'switchery SwitchDocumento'     
            });

            if (Estado_Documento == 0) {
              s.setPosition(false, true);

          } else if (Estado_Documento == 1) {
              s.setPosition(true, true);
          }
        });
      }
    })
    .fail((error) => {
      console.log(error);
    });
};

$(document).on("click", ".SwitchDocumento ", function () {

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
      url: `${URL}/Documento/${Id}/${Estado}`,
      type: 'patch',
      datatype: 'json',
      success: function (datos) { 
      },
      error: function (error) {
          console.log(error);
      }
  });
});

$(document).ready(function () {
  $("#DocumentosTab").click(function () {
    ListarDocumento();
  });
});
