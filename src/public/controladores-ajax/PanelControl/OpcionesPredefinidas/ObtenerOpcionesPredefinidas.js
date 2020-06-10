Id_OP = null;

let ObtenerOpcionesPredefinidas = (Id_OPre) => {
  Id_OP = Id_OPre;
  $.ajax({
    url: `${URL}/OpcionesPredefinidas/ObtenerOpcionesPredefinidas/${Id_OP}`,
    dataType: "JSON",
    type: "get",
    success: function (res) {
      $("#txtOpcionEdit").val(res.data.Opcion);
      $("#txtCategoriaEdit").empty();
      $("#txtCategoriaEdit").append(Categorias);
      let arrayConclusion = $("#txtCategoriaEdit option");
      for (let item of arrayConclusion) {
        let categoria = $(item).val();
        if (categoria == res.data.Categoria) {
          $(item).attr("selected", true);
        } else {
          $(item).removeAttr("selected");
        }
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

$(document).ready(function () {
  $("#EditarOpcionesPredefinidas").click(function () {
    ObtenerOpcionesPredefinidas();
  });
});
