// Para editar
var Id_Cliente;

CargarDatosModalDetalles = (Informacion) => {

  // Llenar detalles cliente
  Id_Cliente = Informacion.Id_Cliente;
  $("#txtRazon_Social_D").text(Informacion.Razon_Social)
  $("#txtTelefono_D").text(Informacion.Telefono)
  $("#txtNIT_D").text(Informacion.NIT_CDV)
  $("#txtEncargado_D").text(Informacion.Encargado)
  $("#txtExtension_celular_D").text(Informacion.Ext_Tel_Contacto)
  $("#txtPais_D").text(Informacion.Nombre_Pais)
  $("#txtDepartamento_D").text(Informacion.Nombre_Departamento)
  $("#txtMunicipio_D").text(Informacion.Nombre_Municipio)
  $("#txtTipo_D").text(Informacion.SubTipo)
  $("#txtBarrio_Vereda_D").text(Informacion.Nombre_Barrio_Vereda)
  $("#txtDireccion_D").text(Informacion.Direccion)
  $("#txtOperador_tbl_Lineas_D").text(Informacion.Nombre_Operador)
  $("#txtCalificacion_D").text(Informacion.Calificacion)
  $("#txtRazones_D").text(Informacion.Razones)

  // Crear tabla detalle líneas.
  if (Informacion.Detalle_Lineas) {
    $("#Datos_Validacion").css("display", "none");
    $("#Tabla_Detalle_Lineas_D").removeAttr("style");

    let detalleLineas = Informacion.Detalle_Lineas;
    $("#Tbody_detalle_Lineas_D").empty();
    for (let infoLinea of detalleLineas) {
      $("#Tbody_detalle_Lineas_D").append(`

                <tr>
                    <td>${
                      infoLinea.Linea == "0" ? "No registrada" : infoLinea.Linea
                    } </td>
                    <td>${infoLinea.Minutos}</td>
                    <td>${infoLinea.Navegacion}</td>
                    <td>
                    ${
                      infoLinea.Mensajes == "1"
                        ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl1">Mensajes</label>'
                        : ""
                    }
                        
                    ${
                      infoLinea.Redes_Sociales == "1"
                        ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl">Redes</label>'
                        : ""
                    } 
                    
                    ${
                      infoLinea.Llamadas_Inter == "1"
                        ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl1">Llamadas Inter</label>'
                        : ""
                    }
                         
                    ${
                      infoLinea.Roaming == "1"
                        ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl">Roaming</label>'
                        : ""
                    } 
                         
                        
                    </td>
                    <td>
                        <i class="fa fa-dollar"></i>
                        <div class="float-right">${
                          infoLinea.Cargo_Basico
                        }</div> 
                    </td>
                </tr>
            `);
    }
    $("#txtCantidad_Lineas1_D").text(Informacion.Cantidad_Total_Lineas)
    $("#txtValor_Mensual1_D").text(Informacion.Valor_Total_Mensual)

  } else {
    $("#Tabla_Detalle_Lineas").css("display", "none");
    $("#Datos_Validacion").removeAttr("style");
    $("#txtCantidad_Lineas2_D").text(Informacion.Cantidad_Total_Lineas)
    $("#txtValor_Mensual2_D").text(Informacion.Valor_Total_Mensual)
  }

  let Id_Plan_Corporativo = parseInt(Informacion.Id_Plan_Corporativo);
  let Id_Documentos = parseInt(Informacion.Id_Documentos);
  // Validar si tiene plan corporativo.
  if (Id_Plan_Corporativo > 0) {
    $("#Menu_Plan").removeAttr("style");

    let clausula = parseInt(Informacion.Clausula_Permanencia);

    if (clausula == 1) {
      $("#txtClausulaPermanencia_D").text("Si");
    } else {
      $("#txtClausulaPermanencia_D").text("No");
    }

    $("#txtFecha_Inicio_D").text(Informacion.Fecha_Inicio)
    $("#txtFecha_Fin_D").text(Informacion.Fecha_Fin)
    $("#txtDescripcion_D").text(Informacion.Descripcion)

    if (Id_Documentos > 0) {
      $("#Menu_Doc").removeAttr("style");
      $("#linkCedula_D").empty();
      $("#linkCedula_D").append(`
                <a href="/documentos/${Informacion.Cedula_RL}"target="_blank""" class="btn btn-primary">Descargar</a>
            `);
      $("#linkCamara_D").empty();
      $("#linkCamara_D").append(`
                <a href="/documentos/${Informacion.Camara_Comercio}"target="_blank""" class="btn btn-primary">Descargar</a>
            `);
      $("#linkSoporte_D").empty();
      $("#linkSoporte_D").append(`
                <a href="/documentos/${Informacion.Soporte_Ingresos}"target="_blank""" class="btn btn-primary">Descargar</a>
            `);

      if (Informacion.Detalles_Plan_Corporativo != null) {
        $("#ValidacionAnexos_D").empty();
        $("#ValidacionAnexos_D").append(`
            <div class="form-group">
                    <label class="font-weight-bold text-right">
                    Anexos Corporativo
                    </label>
                    <p  class="form-control-static">
                    <a href="/documentos/${Informacion.Detalles_Plan_Corporativo}"target="_blank""" class="btn btn-primary">Descargar</a>
                    </p>
            </div>
        `);
      }

      if (Informacion.Oferta != null) {
        $("#ValidacionOferta_D").empty();
        $("#ValidacionOferta_D").append(`
            <div class="form-group">
                    <label class="font-weight-bold text-right">
                    Oferta
                    </label>
                    <p  class="form-control-static">
                    <a href="/documentos/${Informacion.Oferta}"target="_blank""" class="btn btn-primary">Descargar</a>
                    </p>
            </div>
        `);
      }
    } else {
      $("#Menu_Doc").css("display", "none");
    }

    // Validar que se haya hecho el cambio de corporativo
    // $("#Menu_Comp").removeAttr('style');
  } else {
    $("#Menu_Plan").css("display", "none");
    $("#Menu_Doc").css("display", "none");
    $("#Menu_Comp").css("display", "none");
  }
  // Mostrar Modal con formulario para editar
  $(".ModalDetalles").modal("show");
};

MostrarModalEditar = () => {
  $(".ModalDetalles").modal("hide");
  ObtenerCliente(Id_Cliente, 2);
};
LlamarClienteRegistrado = () => {
  // Valid
};
