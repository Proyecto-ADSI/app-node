let ListarOpcionesPredefinidas = () => {
  $.ajax({
    url: `${URL}/OpcionesPredefinidas`,
    dataType: "json",
    type: "GET",
  })
    .done((respuesta) => {
      $("#TablaOpcionesPredefinidas").empty();
      contador = 0;
      for (let item of respuesta.data) {
        contador++;
        $("#TablaOpcionesPredefinidas").append(`
                <tr>
                    <td class="MyStyle_Id_Principal_Column">${item.Id_OP}</td>
                    <td>${contador}</td>
                    <td>${item.Opcion}</td>
                    <td>${item.Categoria}</td>
                    <td class="text-nowrap">
                            <i class="fa fa-pencil text-inverse m-r-10 icon-edit" id="EditarOpcionesPredefinidas" data-toggle="modal" data-target="#ModificarOpcionesPredefinidas" onclick="ObtenerOpcionesPredefinidas(${item.Id_OP})" style="cursor:pointer;"></i>
                            <i class="fa fa-close text-danger" onclick="EliminarOpcionesPredefinidas(${item.Id_OP})" style="cursor:pointer;"></i>
                            
                    </td>
                </tr>
            `);
      }
    })
    .fail((error) => {
      console.log(error);
    });
};

$(document).ready(function () {
  $("#OpcionesPredefinidasTab").click(function () {
    Categorias = `
        <option value="Seleccione" selected disabled>
            Seleccione...
        </option>
        <option value="Operador">Operador</option>
        <option value="Llamada">Llamada</option>
        <option value="Visita">Visita</option>
        <option value="País LDI">País LDI</option>
        <option value="Redes Sociales">Redes Sociales</option>
        <option value="Servicios Adicionales">Servicios Adicionales</option>
    `;
    $("#txtCategoria").empty();
    $("#txtCategoria").append(Categorias);
    ListarOpcionesPredefinidas();
  });
});
