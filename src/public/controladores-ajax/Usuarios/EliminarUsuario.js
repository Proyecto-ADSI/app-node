Eliminarusuario = (Id_usuario) => {
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
    function (isConfirm) {
      if (isConfirm) {
        $.ajax({
          url: `${URL}/Usuarios/${Id_usuario}`,
          type: "delete",
          datatype: "json",
          success: function (datos) {
            if (datos.data.Eliminar) {
              MostarMensajeEliminado();
            } else {
              swal({
                title: "Error al eliminar.",
                type: "error",
                text:
                  "No se puede eliminar el usuario, debido a que está asociado a un registro de llamada o visita externa.",
                showCancelButton: false,
                confirmButtonColor: "#2F6885",
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
      }
    }
  );
};

MostarMensajeEliminado = () => {
  RecargarDataTable();
  swal("Registro eliminado!", "Se ha eliminado el usuario.", "success");
};
