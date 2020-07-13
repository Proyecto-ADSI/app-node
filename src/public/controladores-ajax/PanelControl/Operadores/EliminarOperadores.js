EliminarOperador = (Id_Operador) => {
  swal(
    {
      title: "¿Desea eliminar este operador?",
      text: "El perador será eliminado y no se podrá recuperar.",
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
          url: `${URL}/Operador/${Id_Operador}`,
          type: "delete",
          datatype: "json",
          success: function (datos) {
            if (datos.data.Eliminar) {
              RecargarDataTableOperadores();
              swal(
                "Eliminado!",
                "Operador eliminado correctamente.",
                "success"
              );
            } else {
              swal({
                title: "Error al eliminar.",
                type: "error",
                text:
                  "No se puede eliminar el operador, debido a que está asociado a registros, puede inhabilitarlo.",
                showCancelButton: false,
                confirmButtonColor: "#1976d2",
                confirmButtonText: "Cerrar",
                closeOnConfirm: true,
              });
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
