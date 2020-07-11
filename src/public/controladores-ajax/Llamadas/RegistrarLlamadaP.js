var Llamada_Precargada = true;

let InicializarFormP = () => {
  ObtenerSession().then((data) => {
    let Id_Usuario = parseInt(data.session.Id_Usuario);
    $.ajax({
      url: `${URL}/Llamadas/Precargar/${Id_Usuario}`,
      type: "get",
      datatype: "json",
      success: function (res) {
        console.log(res);
        if (res.data.ok) {
          // Inicializar selects del formulario
          stepPlanCorp = form.steps("getStep", 2);
          stepCita = form.steps("getStep", 3);
          stepAT = form.steps("getStep", 4);
          stepFinLlamada = form.steps("getStep", 5);
          stepProgramarFecha = form.steps("getStep", 6);
          stepDiseñarOferta = form.steps("getStep", 7);
          form.steps("remove", 2);
          form.steps("remove", 2);
          form.steps("remove", 2);
          form.steps("remove", 3);
          form.steps("remove", 3);

          // CargarOpcionesPredefinidas();
          // CargarOperadores();
          // CargarCalificaciones();

          Informacion = res.data.info;
          Id_Cliente = Informacion.Id_Cliente;
          Id_DBL = Informacion.Id_DBL;
          Razon_Social = Informacion.Razon_Social.toLowerCase();
          Telefono = Informacion.Telefono;
          NIT_CDV = Informacion.NIT_CDV;

          if (typeof Informacion.Id_Plan_Corporativo !== "undefined") {
            Id_Plan_Corporativo = parseInt(Informacion.Id_Plan_Corporativo);
          } else {
            Id_Plan_Corporativo = 0;
          }

          // Información de contacto.
          $("#txtRazonSocial").val(Informacion.Razon_Social);
          $("#txtTelefono").val(Telefono);
          let Extension = obtenerValueValidado(Informacion.Extension);
          $("#txtExtension").val(Extension);
          let NIT_CDV_Validado = obtenerValueValidado(NIT_CDV);
          $("#txtNIT").val(NIT_CDV_Validado);
          let Encargado = obtenerValueValidado(Informacion.Encargado);
          $("#txtEncargado").val(Encargado);
          let Correo = obtenerValueValidado(Informacion.Correo);
          $("#txtCorreo").val(Correo);

          // Card empresa precargada
          $("#spnEmpresaP").text(Informacion.Razon_Social);
          $("#spnTelefonoP").text(Informacion.Telefono);
          $("#spnNITP").text(Informacion.NIT_CDV);
          $("#spnOPeradorP").text(Informacion.Nombre_Operador);
          $("#spnCorporativoP").text("Corporativo: " + Informacion.Corporativo);
          $("#spnLineasP").text(Informacion.Cantidad_Total_Lineas + " líneas");
          $("#DetalleEmpresaPrecargada").removeAttr("style");

          $("#btnClientePrecargado").click(function () {
            $("#Info_Registrado").attr("style", "display:none");
            $("#titulo_modal_detalle").empty();
            $("#titulo_modal_detalle").append(`
              <i class="fa fa-list-alt"></i>  Detalles cliente precargado
            `);
            CargarDatosModalDetalles(Informacion);
          });

          // Ubicación.
          let ubicacion = {
            Id_Pais: Informacion.Id_Pais,
            Id_Departamento: Informacion.Id_Departamento,
            Id_Municipio: Informacion.Id_Municipio,
            Id_SubTipo_Barrio_Vereda: Informacion.Id_SubTipo_Barrio_Vereda,
            Id_Barrios_Veredas: Informacion.Id_Barrios_Veredas,
          };

          CargarDatosUbicacion(ubicacion);

          // setTimeout(function () {
          //   let DatosUbicacion = JSON.parse(
          //     sessionStorage.getItem("DatosUbicacion")
          //   );

          //   CargarPaises(DatosUbicacion.Paises, false, Informacion.Id_Pais);
          //   CargarDepartamentos(
          //     DatosUbicacion.Departamentos,
          //     false,
          //     Informacion.Id_Departamento
          //   );
          //   CargarMunicipios(
          //     DatosUbicacion.Municipios,
          //     false,
          //     Informacion.Id_Municipio
          //   );
          //   CargarSubTipos(
          //     DatosUbicacion.Subtipos,
          //     false,
          //     Informacion.Id_SubTipo_Barrio_Vereda
          //   );
          //   CargarBarrios_Veredas(
          //     DatosUbicacion.Barrios_Veredas,
          //     false,
          //     Informacion.Id_Barrios_Veredas
          //   );
          // }, 2000);

          let Direccion = obtenerValueValidado(Informacion.Direccion);
          $("#txtDireccion").val(Direccion);

          // Datos básicos líneas.
          CargarOperadores(Informacion.Id_Operador);
          CargarCalificaciones(Informacion.Id_Calificacion_Operador);
          let arrayRazones = getArrayString(Informacion.Razones);
          if (arrayRazones.length > 0) {
            CargarOpcionesPredefinidas(arrayRazones);
          } else {
            CargarOpcionesPredefinidas();
          }

          // Servicios fijos
          if (Informacion.Servicios_Fijos) {
            let serviciosBD = Informacion.Servicios_Fijos;

            let serviciosFijos = {
              pagina: false,
              correo: false,
              ip: false,
              dominio: false,
              telefonia: false,
              television: false,
              id_linea_fija: parseInt(
                Informacion.Servicios_Fijos.Id_Linea_Fija
              ),
            };

            if (serviciosBD.Pagina_Web == "1") {
              serviciosFijos.pagina = true;
            }
            if (serviciosBD.Correo_Electronico == "1") {
              serviciosFijos.correo = true;
            }
            if (serviciosBD.IP_Fija == "1") {
              serviciosFijos.ip = true;
            }
            if (serviciosBD.Dominio == "1") {
              serviciosFijos.dominio = true;
            }
            if (serviciosBD.Telefonia == "1") {
              serviciosFijos.telefonia = true;
            }
            if (serviciosBD.Television == "1") {
              serviciosFijos.television = true;
            }
            localStorage.ServiciosFijos = JSON.stringify(serviciosFijos);

            Listar_CheckearServiciosFijos();
          }

          // Convertir Servicios Móviles BD a JSON localStorage
          if (typeof Informacion.Servicios_Moviles !== "undefined") {
            let ArrayLineasGrupo = [];
            for (let lineaBD of Informacion.Servicios_Moviles) {
              if (ArrayLineasGrupo.length > 0) {
                let control = false;
                // Comprobar si el grupo ya está agregado.
                for (let linea of ArrayLineasGrupo) {
                  if (linea.grupo === lineaBD.Grupo) {
                    linea.cantidadLineas += 1;
                    linea.id_lineas.push(lineaBD.Id_Linea_Movil);
                    linea.NumerosLineas.push(lineaBD.Linea);

                    control = true;
                  }
                }
                if (!control) {
                  let linea = CrearLineaSession(lineaBD);
                  ArrayLineasGrupo.push(linea);
                }
              } else {
                let linea = CrearLineaSession(lineaBD);
                ArrayLineasGrupo.push(linea);
              }
            }
            localStorage.ServiciosMoviles = JSON.stringify(ArrayLineasGrupo);
            ListarDetalleLineas();
          }
          // Plan Corporativo
          CargarInformacionPlan = () => {
            $("#Fecha_Corporativo #txtFecha_inicio").datepicker(
              "setDate",
              FormatearFecha(Informacion.Fecha_Inicio)
            );
            $("#Fecha_Corporativo #txtFecha_fin").datepicker(
              "setDate",
              FormatearFecha(Informacion.Fecha_Fin)
            );
          };
          if (parseInt(Informacion.Id_Plan_Corporativo) > 0) {
            $(".switch_corporativo").trigger("click");
          }

          if (parseInt(Informacion.Clausula_Permanencia) == 1) {
            $("#switchClausula")
              .children("label")
              .children("span")
              .trigger("click");
          }
          let Descripcion = obtenerValueValidado(Informacion.Descripcion);
          $("#txtDescripcion").val(Descripcion);
        } else {
          location.href = Redireccionar("/Noticias");
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
};

let CrearLineaSession = (lineaBD) => {
  let serviciosIlimitados = getArrayString(lineaBD.Servicios_Ilimitados);
  let minutosLDI = getArrayString(lineaBD.Minutos_LDI);
  let serviciosAdicionales = getArrayString(lineaBD.Servicios_Adicionales);

  if (lineaBD.Navegacion == NA) {
    lineaBD.Navegacion = "";
  }
  if (lineaBD.Minutos == NA) {
    lineaBD.Minutos = "";
  }
  if (lineaBD.Mensajes == NA) {
    lineaBD.Mensajes = "";
  }
  if (lineaBD.Cantidad_LDI == NA) {
    lineaBD.Cantidad_LDI = "";
  }
  let arrayId = [lineaBD.Id_Linea_Movil];
  let arrayNumeros = [lineaBD.Linea];
  let linea = {
    id: uuid.v4(),
    grupo: lineaBD.Grupo,
    id_lineas: arrayId,
    NumerosLineas: arrayNumeros,
    cantidadLineas: 1,
    cargoBasicoMensual: lineaBD.Cargo_Basico,
    navegacion: lineaBD.Navegacion,
    minutos: lineaBD.Minutos,
    mensajes: lineaBD.Mensajes,
    serviciosIlimitados: serviciosIlimitados,
    minutosLDI: minutosLDI,
    cantidadLDI: lineaBD.Cantidad_LDI,
    serviciosAdicionales: serviciosAdicionales,
  };

  return linea;
};

let obtenerValueValidado = (value) => {
  let valueValidado = value;
  if (value === NA) {
    valueValidado = "";
  }
  return valueValidado;
};
