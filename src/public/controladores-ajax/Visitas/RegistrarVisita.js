let Form_Datos_Visita;
let Swipper;
let DataTableServiciosOf;
let ArrayServiciosMo = [];
let ArrayData = [];
let IdNotas = 0;
let IdAclaraciones = 0;
let Cliente;
let ObjetoAjusteRecursos = {};
let Oferta_Visita = {};
let ContadorGrupo = 1;

$(function () {
  Form_Datos_Visita = $("#Form_Datos_Visita").show();

  Form_Datos_Visita.steps({
    headerTag: "h6",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    onInit:function(){
      $("#btnLimpiar_OPVI").on("click", function () {
        Limpiar();
      });
      $("#btnGuardar_OPVI").on("click", function () {
        $("#btnGuardar_OPVI").val() == "0" ? RegistrarSMVI() : Editar()
      });

      $("#AddAclaraciones").on("click", function(){
        AgregarInputsAclaraciones();
      })
      $("#AddNotas").on("click", function(){
        AgregarInputsNotas();
      })

      $("#BtnVerOferta").on("click", function () {
        PrevisualizarOferta(ArrayData);
      });
    },
    onStepChanged: function (event, currentIndex, priorIndex) {
      if (currentIndex == 1) {
        $("#Fecha_CorporativoVI").datepicker({
          language: "es",
          format: "yyyy/mm/dd",
          autoclose: true,
          todayHighlight: true,
        });
      }
      if (currentIndex == 2) {
        Swipper.update();
        DeshabilitarInputs();
        $("#CargoBasico_VI").mask("000,000,000.00", { reverse: true });
        CargarOpcionesPredefinidasVI();
        ListarSMVI();
      }
      if(currentIndex == 3){
        CargarOpcionesPredefinidasInfVI();
        ListarEstadosVI();
      }
    },
    onStepChanging: function (event, currentIndex, newIndex) {
      Form_Datos_Visita.validate().settings.ignore = ":disabled,:hidden";

      if(currentIndex === 2){
           ValidarServiciosRegistrados(ArrayData);

           let EstadoFuncion = ValidarServiciosRegistrados(ArrayData)
           let ValidacionCampos = ValidacionCamposOferta();
           if(EstadoFuncion == false || ValidacionCampos == false){
           
            return false;

           }
           else if (EstadoFuncion == true && ValidacionCampos == true) {

             PrevisualizarOferta(ArrayData)
             return true
           }       
      }  
   
      return Form_Datos_Visita.valid()
    },
    onFinishing: function (event, currentIndex) {
      Form_Datos_Visita.validate()

      return Form_Datos_Visita.valid()
    },
    onFinished: function (event, currentIndex) {
      RegistrarVisita(Cliente,ObjetoAjusteRecursos);
    }

  });

  Form_Datos_Visita.validate({
    errorClass: "form-control-feedback",
    errorElement: "div",
    highlight: function (element) {
      $(element)
        .parents(".form-group")
        .addClass("has-danger")
        .removeClass("has-success");
      $(element)
        .addClass("form-control-danger")
        .removeClass("form-control-success");
    },
    unhighlight: function (element) {
      $(element)
        .parents(".form-group")
        .addClass("has-success")
        .removeClass("has-danger");
      $(element)
        .addClass("form-control-success")
        .removeClass("form-control-danger");
    },
    errorPlacement: function (error, element) {
      error.insertAfter(element.parent(".input-group"));
    },
    onkeyup: function (element) {
      if (
        element.id == "txtNITVI"
      ) {
        return false;
      }
    },
    rules: {
      txtNITVI: {
        required: true,
        ValidarNIT: true,
        minlength: 9,
        maxlength: 11,
        remote: function (element) {
          let Response = {
            url: `${URL}/Visitas/Cliente`,
            type: "GET",
            dataType: "json",
            data: {
              NIT: function () {
                return $("#txtNITVI").val();
              },
            },
            beforeSend: function () {
              $(element).addClass("CargandoGif");
              $("#txtNITVI-error").remove()
            },
            dataFilter: function (Response) {
              var Visitas = JSON.parse(Response);
              if (Visitas.data.ok) {
                $("#txtNITVI").
                
                removeClass("CargandoGif");
                PrecargarOfertas(Visitas);
                return '"true"';
              } 
              else if(Visitas.data.EstadoVisita === false) {

                $("#txtNITVI").removeClass("CargandoGif");
                return '"La visita ya se realizo"'

              }
              else if(Visitas.data.EstadoDBL === false){
                $("#txtNITVI").removeClass("CargandoGif");
                return '"Ya se le presento una oferta a la empresa"'
              }
              else {
                $("#txtNITVI").removeClass("CargandoGif");
                return '"NIT inexistente."';
              }
            },
          };
          return Response;
        },
      },
      txtFechaInicioVI: {
        required: true,
      },
      txtDestinatarioOfertaVI:{
        required:true,
        minlength:2,
        maxlength:80,
        SoloLetras:true
      },
      txtDescripcionVI: {
        required: true,
        minlength: 5,
        maxlength: 200,
      },
      txtNotasVI:{
        required:true,
        minlength:5,
        maxlength:255
      },
      txtAclaracionesVI:{
        required:true,
        minlength:5,
        maxlength:255
      },
      txtSugerenciasVI:{
        required:true
      },
      txtTipoVentaVI:{
        required:true
      },
      txtCalificacionVI:{
        required:true
      },
      txtEstadoVI:{
        required:true
      },
      txtObservacionVI:{
        required:true
      },
      txtSugerenciasVI:{
        required:true
      }
    },
  });
});

let PrecargarOfertas = (Visitas) => {
  let ServiciosMoviles = Visitas.data.DBL.Servicios_Moviles;
  Cliente = Visitas.data.Cliente;

  $("#swipersVI").empty();
  if (ServiciosMoviles.length > 0) {
    $("#swipersVI").append(`
      <div class="swiper-containerVI">
        <div id="Lista_SwipersVI" class="swiper-wrapper"></div>
        <div class="swiper-pagination"></div>
      </div>
    `);

    let contadorID = 0;

    for (let item of ServiciosMoviles) {
      Object.defineProperty(item, "Id", {
        value: uuid.v4(),
        enumerable: true,
      });

      contadorID++;
    
      $("#Lista_SwipersVI").append(`
      <div class="swiper-slide">
        <div class="CardServicios">
            <div id="poster" class="poster">
                <div class="icon"><i class="fa fa-list-alt"></i></div>
            </div>
            <div class="icono_mark">
              <i class="fa fa-bookmark"></i>
            </div>
            <div class="details">
                <div class="titulo">
                    <input name="rbtnCardServicios" type="radio" 
                        class="with-gap" id="cardServicios${contadorID}" 
                        value="${item.Id}">
                    <label id="lblCantidadLineas" for="cardServicios${contadorID}">
                       ${item.Cantidad_Lineas} 
                       ${item.Cantidad_Lineas == 1 ? " línea" : " líneas"}
                    </label>
                </div>
                <div class="info">
                    <div class="row">
                        <div class="col-md-6"> Cargo:</div>
                        <div class="col-md-6">${item.Cargo_Basico}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"> Datos:</div>
                        <div class="col-md-6">${item.Navegacion} GB
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"> Minutos:</div>
                        <div class="col-md-6">${item.Minutos}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"> Mensajes:</div>
                        <div class="col-md-6">${item.Mensajes}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <span class="mensaje_consulta">
                                Consulte tabla de servicios *
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `);

      $(`#cardServicios${contadorID}`).on("change", function () {
        if ($(this).is(":checked")) {
          let IdCheck = $(this).val();

          if (item.Id == IdCheck) {
            HabilitarInputs();
            $("#CantidadLineas_VI").val(item.Cantidad_Lineas);
            $("#btnGuardar_OPVI").val(0)
          }
          
          if (localStorage.getItem("ServiciosMovilesOf")) {

            ObtenerDatosEditar(IdCheck);
          }
        }
      });

      ArrayData.push(item);
    }
  }

  Swipper = new Swiper(".swiper-containerVI", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
    pagination: {
      el: ".swiper-pagination",
    },
  });

  $(`#MinutoTDVI`).on("change", function () {
    if ($(this).is(":checked")) {
      $("#MinutosVI").prop("disabled", true);
      $("#MinutosVI").val("");
    } else {
      $("#MinutosVI").prop("disabled", false);
    }
  });

  $(`#SMSTDVI`).on("change", function () {
    if ($(this).is(":checked")) {
      $("#DetalleSMSVI").prop("disabled", true);
      $("#DetalleSMSVI").val("");
    } else {
      $("#DetalleSMSVI").prop("disabled", false);
    }
  });
};

let CargarOpcionesPredefinidasVI = () => {
  $.ajax({
    url: `${URL}/OpcionesPredefinidas`,
    type: "get",
    datatype: "json",
    success: function (request) {
      $("#MinutosLDIVI").empty();
      $("#ServiciosILVI").empty();
      $("#ServiciosADVI").empty();

      for (let item of request.data) {
        let opcion = $("<option />", {
          text: `${item.Opcion}`,
          value: `${item.Opcion}`,
        });

        if (item.Categoria == "Servicios ilimitados") {
          $("#ServiciosILVI").append(opcion);
        } else if (item.Categoria == "Servicios adicionales") {
          $("#ServiciosADVI").append(opcion);
        } else if (item.Categoria == "País LDI") {
          $("#MinutosLDIVI").append(opcion);
        }
      }

      //  Selects input
      $("#MinutosLDIVI").select2({
        tags: true,
        tokenSeparators: [","],
      });
      $("#ServiciosILVI").select2({
        multiple: true,
        tags: true,
        tokenSeparators: [","],
      });
      $("#ServiciosADVI").select2({
        multiple: true,
        tags: true,
        tokenSeparators: [","],
      });

      $("#MinutosLDIVI").on("change", function () {
        $("#CantidadLDIVI").prop("disabled", false);

        var MinutosLDIvalue = $(this).val();

        if (MinutosLDIvalue.length == []) {
          $("#CantidadLDIVI").prop("disabled", true);
        }
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
};

const CargarOpcionesPredefinidasInfVI = () =>{
  $.ajax({
    url: `${URL}/OpcionesPredefinidas`,
    type: "get",
    datatype: "json",
    success: function (request) {
      $("#SugerenciasVI").empty();
     
      for (let item of request.data) {
        let opcion = $("<option />", {
          text: `${item.Opcion}`,
          value: `${item.Opcion}`,
        });

        if (item.Categoria == "Tipo de venta visitas") {
          $("#txtTipoVentaVI").append(opcion);
        } else if (item.Categoria == "Calificación visita") {
          $("#txtCalificacionVI").append(opcion);
        } else if (item.Categoria == "Visita") {
          $("#SugerenciasVI").append(opcion);
        }
      }

      //  Selects input
      $("#SugerenciasVI").select2({
        tags: true,
        tokenSeparators: [","],
      });
    },
    error: function (error) {
      console.log(error);
    },
  });


 
}

const ListarEstadosVI = () => {
  $.ajax({
    url:`${URL}/Visitas/Estados`,
    type: "get",
    dataType:"json",
    success: function(Resquest){
  

     Resquest.data.forEach(element => {

      let OpcionEstados = $("<option />", {
        text: `${element.Estado_Visita}`,
        value: `${element.Id_Estado_Visita}`,


      });
       

      $("#txtEstadoVI").append(OpcionEstados);

     });



    },
    error: function(error){
       console.log(error)
    }
  })
}

$(document).ready(function () {
  localStorage.removeItem("ServiciosMovilesOf");
});

// Registrar CRUD datatable
const RegistrarSMVI = () => {

  let ServiciosMoVI = {
    Id: $("input[name='rbtnCardServicios']:checked").val(),
    Cantidad_Lineas: $("#CantidadLineas_VI").val(),
    CargoBasicoLN: $("#CargoBasico_VI").val(),
    Navegacion: $("#NavegacionVI").val(),
    MinutosTD: $("#MinutoTDVI").is(":checked")
      ? "Ilimitados"
      : $("#MinutosVI").val(),
    SMSTD: $("#SMSTDVI").is(":checked")
      ? "Ilimitados"
      : $("#DetalleSMSVI").val(),
    MinutosLDI: $("#MinutosLDIVI").val(),
    ServiciosIL: $("#ServiciosILVI").val(),
    ServiciosAD: $("#ServiciosADVI").val(),
    CantidadLDI: $("#CantidadLDIVI").val(),
    Grupo: ContadorGrupo++
  };



  ArrayServiciosMo.push(ServiciosMoVI);

  localStorage.setItem("ServiciosMovilesOf", JSON.stringify(ArrayServiciosMo));

  $(
    `input:radio[name='rbtnCardServicios'][value='${ServiciosMoVI.Id}']`
  )
    .parents(".CardServicios")
    .children(".icono_mark")
    .addClass("show");

    
  $("input:radio[name='rbtnCardServicios']").prop("checked", false);

  
  ListarSMVI();
  Limpiar();
  DeshabilitarInputs();
};

//Crud localStorage listar DataTable
let ListarSMVI = () => {
  DataTableServiciosOf = $("#DataTableOPVI")
    .DataTable({
      destroy: true,
      responsive: true,
      data: JSON.parse(localStorage.getItem("ServiciosMovilesOf")),
      columns: [
        { data: "Cantidad_Lineas" },
        { data: "CargoBasicoLN" },
        { data: "Navegacion" },
        { data: "MinutosTD" },
        { data: "SMSTD" },
        {
          data: "ServiciosIL",
          render: function (data, type, fullData) {
            if (data.length == []) {
              return "N/A";
            }
            let html = "";
            for (let item of data) {
              html =
                html +
                `
                  <div class="label label-table text-center" style="background-color:#00897b">
                  ${item}
                  </div>
                `;
            }
            return html;
          },
        },
        {
          data: "MinutosLDI",
          render: function (data, type, fullData) {
            if (data.length == []) {
              return "N/A";
            }
            let html = "";
            for (let item of data) {
              html =
                html +
                `
                      <div class="label label-table text-center" style="background-color:#00897b">
                      ${item}
                      </div>
                    `;
            }
            return html;
          },
        },
        { data: "CantidadLDI" },
        {
          data: "ServiciosAD",
          render: function (data, type, fullData) {
            if (data.length == []) {
              return "N/A";
            }
            let html = "";
            for (let item of data) {
              html =
                html +
                `
                  <div class="label label-table text-center" style="background-color:#00897b">
                  ${item}
                  </div>
                `;
            }
            return html;
          },
        },
        {
          data: null,
          render: function (data, type, fullData) {
            const NumberRandom = Math.random(1);

            return `
            <button type="button" title='Eliminar' id="EliminarServiciosVI${NumberRandom}" value="${NumberRandom}"
              class="btn btn-danger btn-sm EliminarSM"><i class="fa fa-close"></i>
            </button>
          `;
          },
        },
      ],
      columnDefs: [
        { responsivePriority: 1, targets: 0 },
        { responsivePriority: 2, targets: -1 },
      ],
      language: {
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No se encontraron resultados",
        info:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
        infoFiltered: "(filtrado de un total de _MAX_ registros)",
        sSearch: "Buscar:",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        sProcessing: "Procesando...",
      },
    })
    .columns.adjust()
    .responsive.recalc();
};

//Eliminar datos de localStorage
$(function () {
  $("#DataTableOPVI tbody").on("click", ".EliminarSM", function () {
    let DataServiciosOf = DataTableServiciosOf.row(
      $(this).parents("tr")
    ).data();

    var Id = DataServiciosOf.Id;

    let ObtenerDatos = JSON.parse(localStorage.getItem("ServiciosMovilesOf"));

    let Indexe = ObtenerDatos.findIndex((Busqueda) => Busqueda.Id === Id);

    ObtenerDatos.splice(Indexe, 1);

    ArrayServiciosMo.splice(Indexe,1)

    $(`input:radio[name='rbtnCardServicios'][value='${Id}']`)
      .parents(".CardServicios")
      .children(".icono_mark")
      .removeClass("show");

    localStorage.setItem("ServiciosMovilesOf", JSON.stringify(ObtenerDatos));

    ListarSMVI();
    Limpiar();
  });
});

const ObtenerDatosEditar = (IdCheck) =>{

  if(localStorage.getItem("ServiciosMovilesOf")){

  let ObtenerData = JSON.parse(localStorage.getItem("ServiciosMovilesOf"))

  let Objeto = ObtenerData.find(
    (Busqueda) => Busqueda.Id === IdCheck
  );

  if (Objeto !== undefined) {

     if(Objeto.hasOwnProperty("Id")){
 
      if(Objeto.Id === IdCheck){

        $("#btnGuardar_OPVI").val(1)  


        $("#CargoBasico_VI").val(Objeto.CargoBasicoLN);
        $("#NavegacionVI").val(Objeto.Navegacion);
        $("#CantidadLDIVI").prop("disabled", false);
        $("#CantidadLDIVI").val(Objeto.CantidadLDI);
         
        if(Objeto.MinutosTD === "Ilimitados"){
            $("#MinutoTDVI").prop("checked", true)
            
            if ($("#MinutoTDVI").is(":checked")) {

              $("#MinutosVI").prop("disabled", true);
              $("#MinutosVI").val("");
            }
        }
        else{
          $("#MinutoTDVI").prop("checked", false)
          $("#MinutosVI").prop("disabled", false);
          $("#MinutosVI").val(Objeto.MinutosTD);
        }

        if(Objeto.SMSTD === "Ilimitados"){
          $("#SMSTDVI").prop("checked",true)
          if ($("#SMSTDVI").is(":checked")) {
            
          $("#DetalleSMSVI").prop("disabled", true);
          $("#DetalleSMSVI").val("");

          }
        }
        else{
        $("#SMSTDVI").prop("checked", false)
        $("#DetalleSMSVI").prop("disabled", false);
        $("#DetalleSMSVI").val(Objeto.SMSTD);
        }

        if(Objeto.MinutosLDI.length > 0){       
        $("#MinutosLDIVI").val(Objeto.MinutosLDI).trigger("change")
        }
        if(Objeto.ServiciosAD.length > 0){
          $("#ServiciosADVI").val(Objeto.ServiciosAD).trigger("change")
        }

        if(Objeto.ServiciosIL.length > 0){
          $("#ServiciosILVI").val(Objeto.ServiciosIL).trigger("change")
        }
      }
     }
  }else{
    Limpiar();
  }
}
}

const Editar = () =>{

  let ObtenerDatos = JSON.parse(localStorage.getItem("ServiciosMovilesOf"))
  let IdSelected = $("input[name='rbtnCardServicios']:checked").val()

  let IndexeEditar = ObtenerDatos.findIndex((Busqueda) => Busqueda.Id === IdSelected)

  ObtenerDatos[IndexeEditar].CantidadLDI = $("#CantidadLDIVI").val()
  ObtenerDatos[IndexeEditar].Cantidad_Lineas = $("#CantidadLineas_VI").val()
  ObtenerDatos[IndexeEditar].CargoBasicoLN = $("#CargoBasico_VI").val()
  ObtenerDatos[IndexeEditar].Navegacion = $("#NavegacionVI").val()
  ObtenerDatos[IndexeEditar].MinutosTD =  $("#MinutoTDVI").is(":checked")? "Ilimitados" : $("#MinutosVI").val()
  ObtenerDatos[IndexeEditar].SMSTD = $("#SMSTDVI").is(":checked")? "Ilimitados": $("#DetalleSMSVI").val()
  ObtenerDatos[IndexeEditar].MinutosLDI = $("#MinutosLDIVI").val()
  ObtenerDatos[IndexeEditar].ServiciosIL = $("#ServiciosILVI").val()
  ObtenerDatos[IndexeEditar].ServiciosAD = $("#ServiciosADVI").val()

  localStorage.setItem("ServiciosMovilesOf", JSON.stringify(ObtenerDatos))

  ListarSMVI();
  Limpiar();
  DeshabilitarInputs();

  $("input:radio[name='rbtnCardServicios']").prop("checked", false);
}


const Limpiar = () => {
  $("#CargoBasico_VI").val("");
  $("#NavegacionVI").val("");
  $("#MinutosVI").val("");
  $("#MinutosLDIVI").val(null).trigger("change");
  $("#ServiciosILVI").val(null).trigger("change");
  $("#ServiciosADVI").val(null).trigger("change");
  $("#CantidadLDIVI").val("");

  if ($("#MinutoTDVI").is(":checked")) {
    $("#MinutosVI").prop("disabled", false);
    $("#MinutoTDVI").trigger("click");
  } else {
    $("#MinutosVI").val("");
  }

  if ($("#SMSTDVI").is(":checked")) {
    $("#DetalleSMSVI").prop("disabled", false);
    $("#SMSTDVI").trigger("click");
  } else {
    $("#DetalleSMSVI").val("");
  }
};

const AgregarInputsAclaraciones = () =>{
  IdAclaraciones++
  let CamposMaximos = 10;
  let CamposInicial = 0;

  if(CamposInicial < CamposMaximos){
        $("#listaAclaracionesVI").append(`
        <div class="row form-group">
        <div class="col-md-12">
          <div class="input-group">
              <textarea class="form-control opcionAclaracionesVI" 
                  id="AclaracionesVI${IdAclaraciones}" rows="3"
                  placeholder="Ingrese aclaraciones sobre la oferta"></textarea>
              <div class="input-group-append">
                  <button class="btn btn-danger" type="button" id='EliminarInputs'>
                      <i class="fa fa-minus"></i>
                  </button>
              </div>
          </div>
        </div>
      </div>
      `)
      CamposInicial++
  }

  $("#listaAclaracionesVI").on("click", "#EliminarInputs", function(){
    $(this).parent("div").parent("div").parent("div").parent("div").remove();
    CamposInicial--
  })

  $(`#AclaracionesVI${IdAclaraciones}`).rules("add", {
    minlength:5,
    maxlength: 255,
    required: true,
  });
}

const AgregarInputsNotas = () =>{
  IdNotas++
  let CamposMaximos = 10;
  let CamposInicial = 0;

  if(CamposInicial < CamposMaximos){
        $("#listaNotasVI").append(`
        <div class="row form-group">
        <div class="col-md-12">
          <div class="input-group">
              <textarea class="form-control opcionNotasVI" id='NotasVI${IdNotas}'
                  rows="3"
                  placeholder="Información relevante sobre la oferta"></textarea>
              <div class="input-group-append">
                  <button class="btn btn-danger" type="button" id='EliminarInputsNotas'>
                      <i class="fa fa-minus"></i>
                  </button>
              </div>
          </div>
        </div>
      </div>
      `)
      CamposInicial++
  }

  $("#listaNotasVI").on("click", "#EliminarInputsNotas", function(){
    $(this).parent("div").parent("div").parent("div").parent("div").remove();
    CamposInicial--
  })

  $(`#NotasVI${IdNotas}`).rules("add", {
    minlength:5,
    maxlength: 255,
    required: true,
  });
}




const PrevisualizarOferta = (ArrayData) => {

  let ArrayComparativo = [];
  let ObtenerDatos = JSON.parse(localStorage.getItem("ServiciosMovilesOf"));
  let DatosCliente = ArrayData;

  let ValidacionCampos = ValidacionCamposOferta();


  if(!localStorage.getItem("ServiciosMovilesOf") || ObtenerDatos.length == []){
    $.toast({
      heading: "¡Acción no permitida!",
      text: '<p class="jq-toast-body">No hay registro de servicios moviles</p>',
      position: "top-right",
      loaderBg: "#ff6849",
      icon: "error",
      hideAfter: 3000,
      showHideTransition: "slide",
      stack: 1,
    });
  }
  else if (ValidacionCampos == false) 
  {

    ValidacionCamposOferta();

  }else{

    $("#modalPrevisualizaroferta").modal("show")

    ObtenerDatos.forEach((element) => {

      let ObjetoCliente = DatosCliente.find(
        (Busqueda) => Busqueda.Id == element.Id
      );
  
      if (ObjetoCliente.Id == element.Id) {
        let ObjetoComparativo = {
          ServiciosMoCl: ObjetoCliente,
          ServiciosMoOf: element,
        };
  
        ArrayComparativo.push(ObjetoComparativo);
      }
    });

  }

  let ArrayComparativoFinal = ArrayComparativo;

  
  //HtmlOferta

  //Nombres Destinatario
  let DestinatarioOF = $("#DestinatarioOfertaVI").val()
  $("#nombreClienteVI").html(DestinatarioOF)
  $("#nombreClienteVI1").html(DestinatarioOF)


  //Notas y aclaraciones arrays y html
  let ArrayNotasVI = []
  let ArrayAclaracionesVI = []

  let TextoSuperior = $("#txtMensajeSuperior").val()
  $("#textoSuperiorVI").html(TextoSuperior)

  $(".opcionNotasVI").each(function (index, element, array) {
    ArrayNotasVI.push($(element).val())
  });

  $(".opcionAclaracionesVI").each(function (index, element, array) {
    ArrayAclaracionesVI.push($(element).val())
   });

   Oferta_Visita = {
     Id_Visita: parseInt(Cliente.Id_Visita),
     Id_DBL_Anterior: parseInt(Cliente.Id_DBL),
     NombreCliente: DestinatarioOF,
     TextoSuperior: TextoSuperior == "" ? null : TextoSuperior,
     TipoOferta: 1,
     Notas: ArrayNotasVI,
     Aclaraciones: ArrayAclaracionesVI,
   }

   ObtenerEmpleadoVI().then(Id => {
       Object.defineProperty(Oferta_Visita, 'Id_Usuario',{
         value: parseInt(Id),
         enumerable:true
       })
   })

  if(ArrayNotasVI.length > 0){
    $("#listaNotasModalVI").empty();

    ArrayNotasVI.forEach(element => {
      $("#listaNotasModalVI").append(`<li>${element}</li>`);
    });

  }

  if(ArrayAclaracionesVI.length > 0){
    $("#columnaNotasVI").removeClass("col-md-12");
    $("#columnaNotasVI").addClass("col-md-6");
    $("#columnaAclaracionesVI").remove()

    let AclaracionesElement = "";
    ArrayAclaracionesVI.forEach(element => {
       AclaracionesElement = AclaracionesElement + `<li>${element}</li>`;
    });

    $("#filaAclaraciones_Notas").prepend(`
    <div id="columnaAclaracionesVI" class="col-md-6 colPadre">
      <div class="sectionAclaraciones">
          <h2 class="SubTituloOferta"> <i class="fa fa-warning"></i> Aclaraciones:</h2>
          <ul id="listaAclaraciones">
             ${AclaracionesElement}
          </ul>
      </div>
    </div>
  `);

  }
  else {
    $("#columnaNotasVI").removeClass("col-md-6");
    $("#columnaNotasVI").addClass("col-md-12");
    $("#columnaAclaracionesVI").remove();
  }

  //Contenido dinamico comparativo

  $("#ContenidoDinamicoVI").empty();

  let filas = "";

  //Operadores Cliente y Oferta
  let OperadorCl
  let ColorOperadorCl;
  let OperadorOf;
  let ColorOperadorOf;

 OperadorCl = Cliente.Operador_Actual
 ColorOperadorCl = Cliente.Color_Operador_Actual

 OperadorOf = Cliente.Operador_Cita
 ColorOperadorOf = Cliente.Color_Operador_Cita


 //Conmparativo tabla

 let CantidadTotalLineas = 0;
 let TotalCargoBasicoCl = 0;
 let TotalCargoBasicoOf = 0;
 
 ArrayComparativoFinal.forEach(element => {
    
  let ElementCliente = element.ServiciosMoCl
  let ElementOferta = element.ServiciosMoOf;


  CantidadTotalLineas += parseInt(ElementCliente.Cantidad_Lineas);


  let CargoBasicoForm  = QuitarComas(ElementCliente.Cargo_Basico)
  CargoBasicoForm = parseFloat(CargoBasicoForm)
  let MultiplicacionCargoBasicoCl = CargoBasicoForm * ElementCliente.Cantidad_Lineas
  TotalCargoBasicoCl += MultiplicacionCargoBasicoCl

  let CargoBasicoOfNew = ElementOferta.CargoBasicoLN.slice(0,-3)
  let CargoBasicoFormOf = QuitarComas(CargoBasicoOfNew)
  CargoBasicoFormOf = parseFloat(CargoBasicoFormOf)
  let MultiplicacionCargoBasicoOf = CargoBasicoFormOf * ElementCliente.Cantidad_Lineas
  TotalCargoBasicoOf += MultiplicacionCargoBasicoOf

  let BonosActivacion = 0;
  let CancelacionClausula = 0;

  let ValorNetoCl = TotalCargoBasicoCl * 12;
  let ValorBrutoOf = TotalCargoBasicoOf * 12;
  let ValorBrutoOfBC = ValorBrutoOf - parseFloat(BonosActivacion) - parseFloat(CancelacionClausula);
  let TotalAhorro = ValorNetoCl - ValorBrutoOfBC;
  let ReduccionAnual = (TotalAhorro / ValorNetoCl) * 100;
  ReduccionAnual = Math.round10(ReduccionAnual , -1);
  let ValorMesPromedio = ValorBrutoOfBC / 12;
  let AhorroMensualPromedio = TotalCargoBasicoCl - ValorMesPromedio;


  ObjetoAjusteRecursos = {
    BasicoNetoCl: AgregarComas(TotalCargoBasicoCl),
    BasicoNetoOf: AgregarComas(TotalCargoBasicoOf),
    ValorNetoCl : AgregarComas(ValorNetoCl),
    ValorNetoOf : AgregarComas(ValorBrutoOf),
    ValorBrutoOf: AgregarComas(ValorBrutoOfBC),
    BonosActivacion: AgregarComas(BonosActivacion),
    CancelacionClausula: AgregarComas(CancelacionClausula),
    ValorBrutoOfBC : AgregarComas(ValorBrutoOfBC),
    TotalAhorro : AgregarComas(TotalAhorro),
    ReduccionAnual : AgregarComas(ReduccionAnual),
    ValorMesPromedio : AgregarComas(ValorMesPromedio),
    AhorroMensualPromedio : AgregarComas(AhorroMensualPromedio),
    CantidadTotalLineas: CantidadTotalLineas,
    Valor_Total_Mensual: AgregarComas(TotalCargoBasicoOf)
  }

  let fila = `
  <tr>
    <td>${ElementCliente.Cantidad_Lineas}</td>
    <td>${ElementCliente.Navegacion} GB</td>
    <td>${ElementCliente.Minutos}</td>
    <td>${ElementCliente.Cargo_Basico}</td>
    <td>${ElementOferta.Navegacion} GB</td>
    <td>${ElementOferta.MinutosTD}</td>
    <td>${CargoBasicoOfNew}</td>
  </tr>
`;
filas = filas + fila;

});



  $("#ContenidoDinamicoVI").append(`
      <div class="row">
        <div class="col-md-12">
          <div class="card cardComparativo">
              <div class="card-header titulo_comparativo">
                  Comparativo de servicios móviles
              </div>
              <div class="card-body">
                  <div class="row m-b-20">
                      <div class="col-md-4 text-center">
                          <h1 class="font-weight-bold">${OperadorCl}</h1>
                      </div>
                      <div class="col-md-4 text-center">
                          <h1 class="font-weight-bold">VS</h1>
                      </div>
                      <div class="col-md-4 text-center">
                          <h1 class="font-weight-bold">${OperadorOf}</h1>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-md-12">
                          <div class="table-responsive">
                              <table class="table table-striped">
                                  <thead>
                                      <tr>
                                          <th style="background-color:${ColorOperadorCl}; color:#fff">Líneas</th>
                                          <th style="background-color:${ColorOperadorCl}; color:#fff">Datos</th>
                                          <th style="background-color:${ColorOperadorCl}; color:#fff">Minutos</th>
                                          <th style="background-color:${ColorOperadorCl}; color:#fff">Cargo básico</th>
                                          <th style="background-color:${ColorOperadorOf}; color:#fff">Datos</th>
                                          <th style="background-color:${ColorOperadorOf}; color:#fff">Minutos</th>
                                          <th style="background-color:${ColorOperadorOf}; color:#fff">Cargo básico</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                     ${filas}
                                  </tbody>
                                  <tfoot>
                                      <tr>
                                          <td>
                                              <h5 class="box-title">Total: ${CantidadTotalLineas}</h5>
                                          </td>
                                          <td colspan="2">
                                              <h5 class="font-weight-bold">
                                                  Cargo básico neto:
                                              </h5>
                                          </td>
                                          <td>${AgregarComas(TotalCargoBasicoCl)}</td>
                                          <td colspan="2">
                                              <h5 class="font-weight-bold">
                                                  Cargo básico neto:
                                              </h5>
                                          </td>
                                          <td>${AgregarComas(TotalCargoBasicoOf)}</td>
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
          <div class="card cardAjuste" style="border-color:${ColorOperadorOf} !important;">
              <div class="card-header titulo_ajuste" style="background-color:${ColorOperadorOf};">
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
                                              style="background-color:${ColorOperadorOf};">
                                              Flujo financiero
                                          </th>
                                          <th class="text-center text-white"
                                              style="background-color:${ColorOperadorOf};">
                                              Concepto
                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <td>Total facturación en ${OperadorCl}</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${ObjetoAjusteRecursos.ValorNetoCl}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Cargo básico neto en ${OperadorOf}</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${ObjetoAjusteRecursos.ValorBrutoOfBC}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Bonos de activación</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${ObjetoAjusteRecursos.BonosActivacion}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Cancelación cláusula</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${ObjetoAjusteRecursos.CancelacionClausula}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Total facturación en ${OperadorOf}</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${ObjetoAjusteRecursos.ValorBrutoOfBC}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Reducción anual</td>
                                          <td>
                                              <div class="float-right"> ${ObjetoAjusteRecursos.ReduccionAnual}
                                                <i class="fa fa-percent"></i>
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
                                                ${ObjetoAjusteRecursos.TotalAhorro}
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
                                                    ${ObjetoAjusteRecursos.ValorMesPromedio}
                                              </h3>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Ahorro mensual promedio</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${ObjetoAjusteRecursos.AhorroMensualPromedio}</div>
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
      `);


};

const ValidarServiciosRegistrados = (ArrayData) => {

  let ObtenerDatos = JSON.parse(localStorage.getItem("ServiciosMovilesOf"))

  let NumeroElementosArray = ArrayData.length;


  if(!localStorage.getItem("ServiciosMovilesOf") || ObtenerDatos.length == []){
    $.toast({
      heading: "¡Acción no permitida!",
      text: '<p class="jq-toast-body">No hay registro de servicios moviles</p>',
      position: "top-right",
      loaderBg: "#ff6849",
      icon: "error",
      hideAfter: 3000,
      showHideTransition: "slide",
      stack: 1,
    });

    return false
  }
  else if (ObtenerDatos.length < NumeroElementosArray || ObtenerDatos.length > NumeroElementosArray){

    $.toast({
      heading: "¡Acción no permitida!",
      text: `<p class="jq-toast-body">Registre ${NumeroElementosArray} servicios moviles para la oferta</p>`,
      position: "top-right",
      loaderBg: "#ff6849",
      icon: "error",
      hideAfter: 3000,
      showHideTransition: "slide",
      stack: 1,
    });

    return false;
  }
  else if (ObtenerDatos.length == NumeroElementosArray){

    return true;

  }

}

const ValidacionCamposOferta = () => {
  let AclaracionesValidate;
  let NotasValidate;
  let DestinatarioValidation;

  $(".opcionNotasVI").each(function (index, element, array) {
    NotasValidate = Form_Datos_Visita.validate().element(element)  
  })
  $(".opcionAclaracionesVI").each(function (index, element, array) {
   AclaracionesValidate = Form_Datos_Visita.validate().element(element)  
  })

  DestinatarioValidation =  Form_Datos_Visita.validate().element($("#DestinatarioOfertaVI")) 

 if(AclaracionesValidate == false || NotasValidate == false || DestinatarioValidation == false){

  $.toast({
    heading: "¡Acción no permitida!",
    text: '<p class="jq-toast-body">Algunos campos están erróneos</p>',
    position: "top-right",
    loaderBg: "#ff6849",
    icon: "error",
    hideAfter: 3000,
    showHideTransition: "slide",
    stack: 1,
  });

  return false;
 }
 
 return true;
}


const ObtenerEmpleadoVI = async () =>{

  let Id_User;

  try {
    
    let Response = await fetch("/ObtenerSession")

     Response = await Response.json();

     let Nombre = await Response.session.Nombre

     Id_User = await Response.session.Id_Usuario

     let ElementNombre = document.querySelector("#NombreEmpleadoVI")

     ElementNombre.innerHTML = Nombre
     
  } catch (error) {

    if(error){
      let ErrorName = "No se obtuvo el nombre"

      let ElementNombre = document.querySelector("#NombreEmpleadoVI")

      Id_User = error;
  
      ElementNombre.innerHTML = ErrorName
    }

  }

  return Id_User;

}

const RegistrarVisita = (Cliente,ObjetoAjusteRecursos) =>{

  let switchClausulaVI = $("#switchClausulaVI")
  .children("label")
  .children("input");

  let DBL = {
    Id_Cliente: parseInt(Cliente.Id_Cliente),
    Id_Operador_Oferta: parseInt(Cliente.Id_Operador),
    Cantidad_Total_Lineas: ObjetoAjusteRecursos.CantidadTotalLineas,
    Valor_Total_Mensual: ObjetoAjusteRecursos.Valor_Total_Mensual,
  }

  let Plan_Corporativo = {
    FechaInicio: $("#FechaInicioVI").val(),
    FechaFin: $("#FechaFinVI").val(),
    ClausulaPermanencia: switchClausulaVI[0].checked ? 1 : 0,
    Descripcion: $("#DescripcionVI").val(),
    EstadoPlanCorporativo: 1,
  }

  let Sugerencias_Datos_Visita = $("#SugerenciasVI").val()

  let Datos_Visita = {
    Tipo_Venta:$("#txtTipoVentaVI").val(),
    Calificacion:$("#txtCalificacionVI").val(),
    Id_Estado_Visita:$("#txtEstadoVI").val(),
    Estado_Visita: $("#txtEstadoVI option:selected").text(),
    Observacion_Datos_Visita:$("#txtObservacionVI").val(),
    Sugerencias: Sugerencias_Datos_Visita.join()
  }

  let Visita = {
      Oferta_Visita: Oferta_Visita,
      Datos_Visita: Datos_Visita,
      DBL: DBL,
      PlanCorporativo: Plan_Corporativo,
      Oferta_Visita_ServiciosMoviles: JSON.parse(localStorage.getItem("ServiciosMovilesOf")),
      Ajuste_Recursos: ObjetoAjusteRecursos,
  }

  $.ajax({
      url:`${URL}/Visitas/Registrar`,
      type: 'post',
      dataType: 'json',
      contentType:'application/json',
      data: JSON.stringify(Visita),
      processData:false,
      beforeSend: function(){
        MostrarLoaderGeneral();
      },
      complete: function(){
        OcultarLoaderGeneral();
      },
  }).done( respuesta => {

    if(respuesta.data.ok){   

      swal({
        title: "Registro exitoso.",
        type: "success",
        showCancelButton: false,
        showConfirmButton: false,
      },setTimeout(function () {

        location.href = "/App/Admin/Visitas"

      }),7000)
    }
  }).fail(error =>{
     if(error){
      swal({
        title: "Error al registrar.",
        type: "error",
        showCancelButton: false,
        showConfirmButton: false,
      });

     }
  }) 
}

const DeshabilitarInputs = () => {

$("#CantidadLineas_VI").prop("disabled", true);
$("#CargoBasico_VI").prop("disabled", true);
$("#NavegacionVI").prop("disabled", true);
$("#MinutoTDVI").prop("disabled", true);
$("#MinutosVI").prop("disabled", true);
$("#SMSTDVI").prop("disabled", true);
$("#DetalleSMSVI").prop("disabled", true);
$("#MinutosLDIVI").prop("disabled", true);
$("#ServiciosILVI").prop("disabled", true);
$("#ServiciosADVI").prop("disabled", true);
$("#CantidadLDIVI").prop("disabled", true);
$("#btnLimpiar_OPVI").prop("disabled", true);
$("#btnGuardar_OPVI").prop("disabled", true);

}

const HabilitarInputs = () =>{

  $("#CantidadLineas_VI").prop("disabled", false);
  $("#CargoBasico_VI").prop("disabled", false);
  $("#NavegacionVI").prop("disabled", false);
  $("#MinutoTDVI").prop("disabled", false);
  $("#MinutosVI").prop("disabled", false);
  $("#SMSTDVI").prop("disabled", false);
  $("#DetalleSMSVI").prop("disabled", false);
  $("#MinutosLDIVI").prop("disabled", false);
  $("#ServiciosILVI").prop("disabled", false);
  $("#ServiciosADVI").prop("disabled", false);
  $("#btnLimpiar_OPVI").prop("disabled", false);
  $("#btnGuardar_OPVI").prop("disabled", false);

}

// let EliminarClasesValidate = (elemento) => {
//   $(elemento).removeClass("form-control-success");
//   $(elemento).parent().removeClass("has-success");
//   $(elemento).removeClass("form-control-danger");
//   $(elemento).parent().removeClass("has-danger");
// };

// icono_mark

