CargarDatosModalDetalles = (Informacion) => {
  $("#txtRazon_Social_D").text(Informacion.Razon_Social);

  let telefono = Informacion.Telefono;
  if (Informacion.Extension !== null) {
    telefono = telefono + "  Ext " + Informacion.Extension;
  }
  $("#txtTelefono_D").text(telefono);
  $("#txtNIT_D").text(Informacion.NIT_CDV);
  $("#txtEncargado_D").text(Informacion.Encargado);
  $("#txtCorreo_D").text(Informacion.Correo);
  $("#txtCelular_D").text(Informacion.Celular);
  $("#txtPais_D").text(Informacion.Nombre_Pais);
  $("#txtDepartamento_D").text(Informacion.Nombre_Departamento);
  $("#txtMunicipio_D").text(Informacion.Nombre_Municipio);
  $("#txtTipo_D").text(Informacion.SubTipo);
  $("#txtBarrio_Vereda_D").text(Informacion.Nombre_Barrio_Vereda);
  $("#txtDireccion_D").text(Informacion.Direccion);
  $("#txtUsuario_D").text(Informacion.Usuario);
  $("#txtPersonaResponde_D").text(Informacion.Persona_Responde);
  $("#txtFechaLlamada_D").text(Informacion.Fecha_Llamada);
  $("#txtDuracionLlamada_D").text(Informacion.Duracion_Llamada);
  $("#txtHabeasData_D").text(Informacion.Info_Habeas_Data);
  $("#txtEstado_D").text(Informacion.Estado_Llamada);
  $("#txtObservacion_D").text(Informacion.Observacion);

  // Mostrar Modal con formulario para editar
  $(".ModalDetalles").modal("show");
};
