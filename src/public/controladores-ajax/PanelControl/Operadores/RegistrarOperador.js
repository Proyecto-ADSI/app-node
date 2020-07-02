var ColorSeleccionado = null;
var pickr = null;

$(function () {
  FormOperadores = $("#FormOperadores").validate({
    submitHandler: function () {
      files = $("#fileImgOperador")[0].files;
      if (files.length == 0) {
        RegistrarOperador("defect.jpg");
      } else {
        CargarImagenOperador();
      }
    },
    rules: {
      txtOperador: {
        required: true,
        SoloAlfanumericos: true,
        maxlength: 45,
      },
      Color: {
        required: true,
      },
      rbtGeneraOferta: {
        required: true,
      },
      txtCorreoOperador: {
        required: true,
        ValidarCorreo: true,
        maxlength: 45,
      },
      txtContrasenaOperador: "required",
      txtConfirmarContrasenaOperador: {
        required: true,
        equalTo: "#txtContrasenaOperador",
      },
    },
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
      if (element[0].id == "Color") {
        error.insertAfter(element.parent(".input-group"));
      } else if (element[0].name == "rbtGeneraOferta") {
        error.insertAfter(element.next().next().next());
      } else {
        error.insertAfter(element);
      }
    },
  });

  pickr = Pickr.create({
    el: ".color-picker",
    theme: "classic", // or 'monolith', or 'nano'

    swatches: [
      "rgba(244, 67, 54, 1)",
      "rgba(233, 30, 99, 0.95)",
      "rgba(156, 39, 176, 0.9)",
      "rgba(103, 58, 183, 0.85)",
      "rgba(63, 81, 181, 0.8)",
      "rgba(33, 150, 243, 0.75)",
      "rgba(3, 169, 244, 0.7)",
      "rgba(0, 188, 212, 0.7)",
      "rgba(0, 150, 136, 0.75)",
      "rgba(76, 175, 80, 0.8)",
      "rgba(139, 195, 74, 0.85)",
      "rgba(205, 220, 57, 0.9)",
      "rgba(255, 235, 59, 0.95)",
      "rgba(255, 193, 7, 1)",
    ],

    components: {
      // Main components
      preview: true,
      opacity: true,
      hue: true,

      // Input / output Options
      interaction: {
        hex: true,
        input: true,
        clear: true,
        save: true,
      },
    },
  });

  pickr.on("change", (color, instance) => {
    ColorSeleccionado = color.toHEXA().toString();
    //   FormOperadores.element("#Color");

    // console.log(pickr.getSelectedColor().toHEXA().toString())

    $("#Color").val(`Hexadecimal: ${ColorSeleccionado}`);
    $("#Color").css("color", ColorSeleccionado);
    $("#Color").css("border-color", ColorSeleccionado);
    $(".pcr-button").css("color", ColorSeleccionado);
  });

  $(".pcr-save").on("click", function () {
    pickr.hide();
  });

  $(".pcr-clear").on("click", function () {
    $("#Color").val("");
    $("#Color").css("border-color", "#ced4da");
    EliminarClasesValidate("#Color");
  });

  $("#Color").focus(function () {
    pickr.show();
    // $("#Color").prop( "disabled", true )
  });

  //  Dropify
  $("#fileImgOperador").dropify({
    messages: {
      default: "Arrastra y suelta una imagen o haz click",
      replace: "Arrastra y suelta o haz click para remplazar",
      remove: "Eliminar",
      error: "Error al intentar cargar la imágen",
    },
    error: {
      imageFormat:
        "El formato de la imagen no está permitidio (Solo se permite: {{ value }}).",
      fileSize: "El tamaño de la imagen es demasiado grande ({{ value }} max).",
      minWidth:
        "El ancho de la imagen es demasiado pequeño  ({{ value }}}px min).",
      maxWidth:
        "El ancho de la imagen es demasiado grande ({{ value }}px max).",
      minHeight:
        "La altura de la imagen es demasiado pequeña ({{ value }}px min).",
      maxHeight:
        "La altura de la imagen es demasiado grande ({{ value }}px max).",
    },
  });

  $("input:radio[name=rbtGeneraOferta]").change(function () {
    let value = parseInt($("input:radio[name=rbtGeneraOferta]:checked").val());
    if (value == 1) {
      $("#txtCorreoOperador").removeAttr("disabled");
      $("#txtContrasenaOperador").removeAttr("disabled");
      $("#txtConfirmarContrasenaOperador").removeAttr("disabled");
    } else {
      $("#txtCorreoOperador").attr("disabled", true);
      $("#txtCorreoOperador").val("");
      EliminarClasesValidate("#txtCorreoOperador");
      EliminarElementosValidate("#txtCorreoOperador-error");

      $("#txtContrasenaOperador").attr("disabled", true);
      $("#txtContrasenaOperador").val("");
      EliminarClasesValidate("#txtContrasenaOperador");
      EliminarElementosValidate("#txtContrasenaOperador-error");

      $("#txtConfirmarContrasenaOperador").attr("disabled", true);
      $("#txtConfirmarContrasenaOperador").val("");
      EliminarClasesValidate("#txtConfirmarContrasenaOperador");
      EliminarElementosValidate("#txtConfirmarContrasenaOperador-error");
    }
  });
});

let RegistrarOperador = (imagen) => {
  let Genera_Oferta = parseInt(
    $("input:radio[name=rbtGeneraOferta]:checked").val()
  );
  let Correo_Operador = null;
  let Contrasena_Operador = null;
  if (Genera_Oferta == 1) {
    Correo_Operador = $("#txtCorreoOperador").val();
    Contrasena_Operador = $("#txtContrasenaOperador").val();
  }
  let datos = {
    Nombre: $("#txtOperador").val(),
    Color: ColorSeleccionado,
    Genera_Oferta: Genera_Oferta,
    Correo_Operador: Correo_Operador,
    Contrasena_Operador: Contrasena_Operador,
    Imagen_Operador: imagen,
    Estado: 1,
  };

  $.ajax({
    url: `${URL}/Operador`,
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(datos),
    processData: false,
  })
    .done((respuesta) => {
      if (respuesta.data.ok) {
        LimpiarFormOperador();
        RecargarDataTableOperadores();
        swal({
          title: "Registro exitoso",
          type: "success",
          confirmButtonClass: "btn-success",
          confirmButtonText: "Ok",
          closeOnConfirm: true,
        });
        $("#tab1_Operadores a").trigger("click");
      } else {
        swal({
          title: "Error",
          text: "Error al registrar",
          type: "error",
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Ok",
          closeOnConfirm: true,
        });
      }
    })
    .fail((error) => {
      swal({
        title: "Error",
        text: "Error al registrar",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
        closeOnConfirm: true,
      });
      console.log(error);
    });
};

let CargarImagenOperador = () => {
  let formData = new FormData();
  let files = null;
  files = $("#fileImgOperador")[0].files[0];
  formData.append("Img_Operador", files);

  $.ajax({
    url: `${URL}/Operador/CargarImagenOperador`,
    type: "post",
    data: formData,
    contentType: false,
    processData: false,
    success: function (res) {
      console.log(res);
      let imagen = res.data.pathArchivo;
      RegistrarOperador(imagen);
    },
    error: function (err) {
      console.log(err);
    },
  });
};

let LimpiarFormOperador = () => {
  $("#txtOperador").val("");
  $("#Color").val("");
  $("#Color").css("border-color", "#ced4da");
  $("input:radio[name=rbtGeneraOferta]:checked").prop("checked", false);
  $("#txtCorreoOperador").attr("disabled", true);
  $("#txtCorreoOperador").val("");
  $("#txtContrasenaOperador").attr("disabled", true);
  $("#txtContrasenaOperador").val("");
  $("#txtConfirmarContrasenaOperador").attr("disabled", true);
  $("#txtConfirmarContrasenaOperador").val("");

  EliminarClasesValidate("#txtOperador", 1);
  EliminarClasesValidate("#Color", 2);
  EliminarClasesValidate("input:radio[name=rbtGeneraOferta]", 1);
  EliminarClasesValidate("#txtCorreoOperador", 1);
  EliminarClasesValidate("#txtContrasenaOperador", 1);
  EliminarClasesValidate("#txtConfirmarContrasenaOperador", 1);

  EliminarElementosValidate("#txtOperador-error");
  EliminarElementosValidate("#Color-error");
  EliminarElementosValidate("#rbtGeneraOferta-error");
  EliminarElementosValidate("#txtCorreoOperador-error");
  EliminarElementosValidate("#txtConfirmarContrasenaOperador-error");
  EliminarElementosValidate("#txtContrasenaOperador-error");
};
