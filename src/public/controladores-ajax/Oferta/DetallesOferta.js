CargarDatosModalDetalles = (Informacion) => {
  $("#tabEmpresa a").trigger("click");
  $("#tabDetalleServicios a").trigger("click");
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

  if (Informacion.Id_AT != null) {
    $("#txtOperador_D").text(Informacion.Nombre_Operador_O);
    let texto = "";
    if (Informacion.Medio_Envio == 1) {
      texto = "Correo";
    } else if (Informacion.Medio_Envio == 2) {
      texto = "WhatsApp";
    } else {
      texto = "Correo y WhatsApp";
    }
    $("#txtMedioEnvio_D").text(texto);
    $("#txtTiempoDO_D").text(Informacion.Tiempo_Post_Llamada);
  } else {
  }

  $("#txtOperador2_D").text(Informacion.Nombre_Operador_O);
  $("#txtNombreCliente_D").text(Informacion.Nombre_Cliente);

  // DETALLE OFERTA (SERVICIOS)
  $("#ContenidoOferta").empty();

  if (Informacion.Tipo_Oferta == "1") {
    $("#txtTipoOferta_D").text("Estándar");
    if (!$("#ContenidoOferta").hasClass("row")) {
      $("#ContenidoOferta").addClass("row");
    }
    $("#ContenidoOferta").append(
      `
        <div class="col-md-12">
          <div class="swiper-container swiper-oferta">
              <div id="lista_swipersOferta" class="swiper-wrapper"></div>
              <div class="swiper-pagination"></div>
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
          </div>
        </div>
      `
    );
    $("#lista_swipersOferta").empty();
    let Contador_Propuestas = 0;
    for (let item of Informacion.Oferta) {
      let Minutos_LDI = NA;
      let arrayMinutosLDI = getArrayString(item.Minutos_LDI);
      if (arrayMinutosLDI.length > 0) {
        Minutos_LDI = getStringMinutosLDI(arrayMinutosLDI, item.Cantidad_LDI);
      }
      let ServiciosIlimitados = NA;
      let arrayServiciosI = getArrayString(item.Servicios_Ilimitados);
      if (arrayServiciosI.length > 0) {
        ServiciosIlimitados = getItemsLabel(
          arrayServiciosI,
          Informacion.Color_O
        );
      }
      let ServiciosAdicionales = NA;
      let arrayServiciosA = getArrayString(item.Servicios_Adicionales);
      if (arrayServiciosI.length > 0) {
        ServiciosAdicionales = getItemsLabel(
          arrayServiciosA,
          Informacion.Color_O
        );
      }

      Contador_Propuestas++;
      $("#lista_swipersOferta").append(
        `
        <div class="swiper-slide">
          <div class="cardPropuesta cardOferta">
              <div class="col-md-12 colPropuesta">
                  <div class="card">
                      <div class="card-header" style="background-color:${Informacion.Color_O}; color:#fff">
                          <h4 class="tituloPropuesta">Propuesta
                              ${Contador_Propuestas}</h4>
                      </div>
                      <div class="card-body">
                          <table id="TablaPropuesta" class="table table-striped">
                              <thead>
                                  <tr>
                                      <th class="colum1Titulo" style="background-color:${Informacion.Color_O}; color:#fff">
                                          Item</th>
                                      <th style="background-color:${Informacion.Color_O}; color:#fff">
                                          Cantidad</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                      <td class="columna1">
                                          Cantidad mínima de
                                          líneas</td>
                                      <td class="columna2">
                                          ${item.Cantidad_Lineas}
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="columna1">
                                          Minutos a todo destino
                                      </td>
                                      <td class="columna2">
                                          ${item.Minutos}</td>
                                  </tr>
                                  <tr>
                                      <td class="columna1">Datos
                                      </td>
                                      <td class="columna2">
                                          <h3 class="text-danger font-weight-bold text-uppercase">
                                              ${item.Navegacion}
                                              GB
                                          </h3>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="tdPadre">
                                          <div class="columna1 divHijo">
                                              Minutos LDI
                                          </div>
                                      </td>
                                      <td class="columna2">
                                          ${Minutos_LDI}
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="columna1"> SMS
                                          todo destino</td>
                                      <td class="columna2">
                                          ${item.Mensajes}</td>
                                  </tr>
                                  <tr>
                                      <td class="tdPadre">
                                          <div class="columna1 divHijo">
                                              Servicios ilimitados
                                          </div>
                                      </td>
                                      <td class="columna2">
                                          ${ServiciosIlimitados}
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="tdPadre">
                                          <div class="columna1 divHijo">
                                              Servicios
                                              adicionales
                                          </div>
                                      </td>
                                      <td class="columna2">
                                          ${ServiciosAdicionales}
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="columna1">
                                          Cargo básico por línea
                                      </td>
                                      <td class="columna2">
                                          <i class="fa fa-dollar text-danger"></i>
                                          <h3 class="float-right text-danger font-weight-bold text-uppercase">
                                              ${item.Cargo_Basico}
                                          </h3>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        `
      );
    }
    swipersOferta = new Swiper(".swiper-container", {
      pagination: {
        el: ".swiper-pagination",
        type: "fraction",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  } else {
    $("#txtTipoOferta_D").text("Personalizada");
    $("#ContenidoOferta").removeClass("row");
    let cantidadLineasOferta = parseInt(
      Informacion.DBLOferta.Cantidad_Total_Lineas
    );
    let arrayComparativo = [];
    for (let i = 0; i < cantidadLineasOferta; i++) {
      let comparativo = {
        servicioCliente: Informacion.DBLCliente.Servicios_Moviles[i],
        servicioOferta: Informacion.DBLOferta.Servicios_Moviles[i],
      };

      arrayComparativo.push(comparativo);
    }

    let filas = "";

    for (let itemComp of arrayComparativo) {
      let fila = `
        <tr>
          <td>${itemComp.servicioCliente.Linea}</td>
          <td>${itemComp.servicioCliente.Navegacion} GB</td>
          <td>${itemComp.servicioCliente.Minutos}</td>
          <td>${itemComp.servicioCliente.Cargo_Basico}</td>
          <td>${itemComp.servicioOferta.Navegacion} GB</td>
          <td>${itemComp.servicioOferta.Minutos}</td>
          <td>${itemComp.servicioOferta.Cargo_Basico}</td>
        </tr>
      `;
      filas = filas + fila;
    }

    $("#ContenidoOferta").append(`
      <div class="container p-t-30 ">
        <div class="row">
          <div class="col-md-12">
            <div class="card cardComparativo">
                <div class="card-header titulo_comparativo">
                    Comparativo de servicios móviles
                </div>
                <div class="card-body">
                    <div class="row m-b-20">
                        <div class="col-md-4 text-center">
                            <h1 class="font-weight-bold">${Informacion.DBLCliente.Nombre_Operador}</h1>
                        </div>
                        <div class="col-md-4 text-center">
                            <h1 class="font-weight-bold">VS</h1>
                        </div>
                        <div class="col-md-4 text-center">
                            <h1 class="font-weight-bold">${Informacion.DBLOferta.Nombre_Operador}</h1>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style="background-color:${Informacion.DBLCliente.Color}; color:#fff">Línea</th>
                                            <th style="background-color:${Informacion.DBLCliente.Color}; color:#fff">Datos</th>
                                            <th style="background-color:${Informacion.DBLCliente.Color}; color:#fff">Minutos</th>
                                            <th style="background-color:${Informacion.DBLCliente.Color}; color:#fff">Cargo básico</th>
                                            <th style="background-color:${Informacion.DBLOferta.Color}; color:#fff">Datos</th>
                                            <th style="background-color:${Informacion.DBLOferta.Color}; color:#fff">Minutos</th>
                                            <th style="background-color:${Informacion.DBLOferta.Color}; color:#fff">Cargo básico</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                      ${filas}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td>
                                                <h5 class="box-title">Total:  ${cantidadLineasOferta}</h5>
                                            </td>
                                            <td colspan="2">
                                                <h5 class="font-weight-bold">
                                                    Cargo básico neto:
                                                </h5>
                                            </td>
                                            <td>${Informacion.DBLCliente.Valor_Total_Mensual}</td>
                                            <td colspan="2">
                                                <h5 class="font-weight-bold">
                                                    Cargo básico neto:
                                                </h5>
                                            </td>
                                            <td>${Informacion.DBLOferta.Valor_Total_Mensual}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-10 colAjuste">
              <div class="card cardAjuste" style="border-color: ${Informacion.DBLOferta.Color} !important;">
                  <div class="card-header titulo_ajuste" style="background-color:${Informacion.DBLOferta.Color};">
                      Propuesta ajustada a recursos
                  </div>
                  <div class="card-body">
                      <div class="row">
                          <div class="col-md-12">
                              <div class="table-responsive">
                                  <table class="table table-striped">
                                      <thead>
                                          <tr>
                                              <th class="text-center text-white"
                                                  style="background-color:${Informacion.DBLOferta.Color};">
                                                  Flujo financiero
                                              </th>
                                              <th class="text-center text-white"
                                                  style="background-color:${Informacion.DBLOferta.Color};">
                                                  Concepto
                                              </th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr>
                                              <td>Total facturación en ${Informacion.DBLCliente.Nombre_Operador}</td>
                                              <td>
                                                  <i class="fa fa-dollar"></i>
                                                  <div class="float-right">${Informacion.Comparativo.Valor_Neto_Operador1}</div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>Cargo básico neto en ${Informacion.DBLOferta.Nombre_Operador}</td>
                                              <td>
                                                  <i class="fa fa-dollar"></i>
                                                  <div class="float-right">${Informacion.Comparativo.Valor_Bruto_Operador2}</div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>Bonos de activación</td>
                                              <td>
                                                  <i class="fa fa-dollar"></i>
                                                  <div class="float-right">${Informacion.Comparativo.Bono_Activacion}</div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>Cancelación cláusula</td>
                                              <td>
                                                  <i class="fa fa-dollar"></i>
                                                  <div class="float-right">0</div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>Total facturación en ${Informacion.DBLOferta.Nombre_Operador}</td>
                                              <td>
                                                  <i class="fa fa-dollar"></i>
                                                  <div class="float-right">${Informacion.Comparativo.Valor_Neto_Operador2}</div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>Reducción anual</td>
                                              <td>
                                                  <div class="float-right">
                                                    ${Informacion.Comparativo.Reduccion_Anual} <i class="fa fa-percent"></i>
                                                  </div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <h5 class="text-danger font-weight-bold"> Total ahorro </h5>
                                              </td>
                                              <td>
                                                  <i class="fa fa-dollar text-danger"></i>
                                                  <h5 class="float-right text-danger font-weight-bold">
                                                    ${Informacion.Comparativo.Total_Ahorro}
                                                  </h5>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <h3 class="text-danger font-weight-bold text-uppercase">
                                                      Valor mes promedio
                                                  </h3>
                                              </td>
                                              <td>
                                                  <i class="fa fa-dollar text-danger"></i>
                                                  <h3
                                                      class="float-right text-danger font-weight-bold text-uppercase">
                                                      ${Informacion.Comparativo.Valor_Mes_Promedio}
                                                  </h3>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>Ahorro mensual promedio</td>
                                              <td>
                                                  <i class="fa fa-dollar"></i>
                                                  <div class="float-right"> ${Informacion.Comparativo.Ahorro_Mensual_Promedio}</div>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    `);
  }

  // TEXTOS
  let textos = Informacion.Textos;
  $("#ContenidoTextos").empty();

  // ACLARACIONES
  if (textos.Aclaraciones.length > 0) {
    let aclaraciones = "";
    for (let aclaracionItem of textos.Aclaraciones) {
      aclaraciones = aclaraciones + `<li>${aclaracionItem.Aclaracion}</li>`;
    }

    $("#ContenidoTextos").append(`
      <div class="row">
        <div class="col-md-12">
          <label class="font-weight-bold text-right">
            Aclaraciones:
          </label>
          <ul>
            ${aclaraciones}
          </ul>
        </div>
      </div>
    `);
  } else {
    $("#ContenidoTextos").append(
      `
      <div class="row">
        <div class="col-md-12">
          <label class="font-weight-bold text-right">
            Aclaraciones:
          </label>
          <h5 class="text-center font-weight-bold"><i class="fa fa-warning"></i>
            No hay aclaraciones registradas. 
          </h5>
        </div>
      </div>
    `
    );
  }

  // NOTAS
  if (textos.Notas.length > 0) {
    let notas = "";
    for (let notaItem of textos.Notas) {
      notas = notas + `<li>${notaItem.Nota}</li>`;
    }

    $("#ContenidoTextos").append(`
      <div class="row">
        <div class="col-md-12">
          <label class="font-weight-bold text-right">
            Notas:
          </label>
          <ul>
            ${notas}
          </ul>
        </div>
      </div>
    `);
  } else {
    $("#ContenidoTextos").append(
      `
      <div class="row">
        <div class="col-md-12">
          <label class="font-weight-bold text-right">
            Notas:
          </label>
          <h5 class="text-center font-weight-bold"><i class="fa fa-warning"></i>
            No hay notas registradas. 
          </h5>
        </div>
      </div>
    `
    );
  }

  // Mostrar Modal con formulario para editar
  $(".ModalDetalles").modal("show");
};
