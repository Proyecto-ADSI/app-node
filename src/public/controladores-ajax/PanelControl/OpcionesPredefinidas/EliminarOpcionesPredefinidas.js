EliminarOpcionesPredefinidas = (Id_OP) => {
  swal(
    {
      title: "¿Desea eliminar este registro?",
      text: "El registro será eliminado y no se podrá recuperar!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      closeOnConfirm: false,
      closeOnCancel: true,
      showLoaderOnConfirm: true,
    },
    function () {
      setTimeout(function () {
        $.ajax({
          url: `${URL}/OpcionesPredefinidas/${Id_OP}`,
          type: "delete",
          datatype: "json",
          success: function (res) {
            if (res.data) {
              swal(
                "Eliminado!",
                "¡Registro eliminado correctamente!",
                "success"
              );
              ListarOpcionesPredefinidas();
            }
          },
          error: function (error) {
            swal({
              title: "Error al eliminar.",
              type: "error",
              text: "No se pudo realizar la petición, intente más tarde.",
              showCancelButton: false,
              confirmButtonColor: "#2F6885",
              confirmButtonText: "Cerrar",
              closeOnConfirm: true,
            });
            console.log(error);
          },
        });
      }, 1000);
    }
  );
};
