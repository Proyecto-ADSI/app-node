var pickrEdit = null;
var ColorSeleccionadoEdit = null;
var drDestroy = null;

$(function () {
  $("#FormOperadorEdit").validate({
    submitHandler: function () {
      files = $("#fileImgOperador_Editar")[0].files;
      if (files.length == 0) {
        EditarOperador(false, null);
      } else {
        CargarImagenOperadorEditar();
      }
    },
    rules: {
      txtOperador_Editar: {
        required: true,
        SoloAlfanumericos: true,
        maxlength: 45,
      },
      Color_Editar: {
        required: true,
      },
      rbtGeneraOferta_Editar: {
        required: true,
      },
      txtCorreoOperador_Editar: {
        required: true,
        ValidarCorreo: true,
        maxlength: 45,
      },
      txtContrasenaOperador_Editar: "required",
      txtConfirmarContrasenaOperador_Editar: {
        required: true,
        equalTo: "#txtContrasenaOperador_Editar",
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
      if (element[0].id == "Color_Editar") {
        error.insertAfter(element.parent(".input-group"));
      } else if (element[0].name == "rbtGeneraOferta_Editar") {
        error.insertAfter(element.next().next().next());
      } else {
        error.insertAfter(element);
      }
    },
  });

  pickrEdit = Pickr.create({
    el: ".color-pickerEdit",
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

  pickrEdit.on("change", (color, instance) => {
    ColorSeleccionadoEdit = color.toHEXA().toString();
    $("#Color_Editar").val(`Hexadecimal: ${ColorSeleccionadoEdit}`);
    $("#Color_Editar").css("color", ColorSeleccionadoEdit);
    $("#Color_Editar").css("border-color", ColorSeleccionadoEdit);
    $(".pcr-button").css("color", ColorSeleccionadoEdit);
  });

  $(".pcr-save").on("click", function () {
    pickrEdit.hide();
  });

  $(".pcr-clear").on("click", function () {
    $("#Color_Editar").val("");
    $("#Color_Editar").css("border-color", "#ced4da");
    EliminarClasesValidate("#Color_Editar");
  });

  $("#Color_Editar").focus(function () {
    pickrEdit.show();
    // $("#Color").prop( "disabled", true )
  });

  $("input:radio[name=rbtGeneraOferta_Editar]").change(function () {
    let value = parseInt(
      $("input:radio[name=rbtGeneraOferta_Editar]:checked").val()
    );
    if (value == 1) {
      ManipularInputs(true);
    } else {
      ManipularInputs(false);

      $("#txtCorreoOperador_Editar").val("");
      EliminarClasesValidate("#txtCorreoOperador_Editar", 1);
      EliminarElementosValidate("#txtCorreoOperador_Editar-error");
      ManipularContrasenas();
    }
  });

  $("#checkbox_contrasena").click(function () {
    if ($(this).is(":checked")) {
      $("#txtContrasenaOperador_Editar").removeAttr("disabled");
      $("#txtConfirmarContrasenaOperador_Editar").removeAttr("disabled");
    } else {
      $("#txtContrasenaOperador_Editar").attr("disabled", true);
      $("#txtContrasenaOperador_Editar").val("");
      $("#txtConfirmarContrasenaOperador_Editar").attr("disabled", true);
      $("#txtConfirmarContrasenaOperador_Editar").val("");
      ManipularContrasenas();
    }
  });
});

let CargarModalEditarOperadores = (data) => {
  Id_Operador = data.Id_Operador;
  $("#txtOperador_Editar").val(data.Nombre_Operador);
  $("#Color_Editar").val(`Hexadecimal:${data.Color}`);
  $("#Color_Editar").css("color", data.Color);
  ColorSeleccionadoEdit = data.Color;
  $("#Color_Editar").css("border-color", data.Color);

  if (data.Genera_Oferta == "Si") {
    $("#rbtVal1_Editar").prop("checked", true);
    $("#txtCorreoOperador_Editar").val(data.Correo_Operador);
    ManipularInputs(true);
  } else {
    $("#rbtVal2_Editar").prop("checked", true);
    $("#txtCorreoOperador_Editar").val("");
    ManipularInputs(false);
  }

  $("#ValImagenEditar .dropify-wrapper").remove();

  $("#ValImagenEditar").append(`
    <input type="file" id="fileImgOperador_Editar"
    name="fileImgOperador_Editar" data-height="300"
    data-allowed-file-extensions="png jpeg jpg" data-default-file= />
  `);

  $("#fileImgOperador_Editar").attr(
    "data-default-file",
    `${URL}/Images/Usuarios/` + data.Imagen_Operador
  );

  $("#fileImgOperador_Editar").dropify({
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

  $("#ModificarOperador").modal("show");
};

let CargarImagenOperadorEditar = () => {
  let formData = new FormData();
  let files = null;
  files = $("#fileImgOperador_Editar")[0].files[0];
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
      EditarOperador(true, imagen);
    },
    error: function (err) {
      console.log(err);
    },
  });
};

let EditarOperador = (editarImg, imagen) => {
  let Genera_Oferta = parseInt(
    $("input:radio[name=rbtGeneraOferta_Editar]:checked").val()
  );
  let Correo_Operador = null;
  let editarContrasena = false;
  let Contrasena_Operador = null;
  if (Genera_Oferta == 1) {
    Correo_Operador = $("#txtCorreoOperador_Editar").val();
    if ($("#checkbox_contrasena").is(":checked")) {
      editarContrasena = true;
      Contrasena_Operador = $("#txtContrasenaOperador_Editar").val();
    }
  }

  let datos = {
    Id_Operador: Id_Operador,
    Nombre: $("#txtOperador_Editar").val(),
    Color: ColorSeleccionadoEdit,
    Genera_Oferta: Genera_Oferta,
    Correo_Operador: Correo_Operador,
    Editar_Contrasena: editarContrasena,
    Contrasena_Operador: Contrasena_Operador,
    Editar_Img: editarImg,
    Imagen_Operador: imagen,
    Estado: 1,
  };

  $.ajax({
    url: `${URL}/Operador`,
    dataType: "json",
    type: "put",
    contentType: "application/json",
    data: JSON.stringify(datos),
    processData: false,
    success: function (res) {
      if (res.data.ok) {
        RecargarDataTableOperadores();
        $("#ModificarOperador").modal("hide");
        swal("Excelente", "Operador modificado correctamente", "success");
        LimpiarFormOperadorEditar();
      } else {
        swal(
          "Error al modificar",
          "Ha ocurrido un error al modificar, intenta de nuevo",
          "error"
        );
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let ManipularInputs = (habilitar) => {
  if (habilitar) {
    $("#txtCorreoOperador_Editar").removeAttr("disabled");
    $("#checkbox_contrasena").removeAttr("disabled");
  } else {
    $("#txtCorreoOperador_Editar").attr("disabled", true);
    if ($("#checkbox_contrasena").is(":checked")) {
      $("#checkbox_contrasena").trigger("click");
    }
    $("#checkbox_contrasena").attr("disabled", true);
  }
};

let ManipularContrasenas = () => {
  $("#txtContrasenaOperador_Editar").val("");
  EliminarClasesValidate("#txtContrasenaOperador_Editar", 1);
  EliminarElementosValidate("#txtContrasenaOperador_Editar-error");

  $("#txtConfirmarContrasenaOperador_Editar").val("");
  EliminarClasesValidate("#txtConfirmarContrasenaOperador_Editar", 1);
  EliminarElementosValidate("#txtConfirmarContrasenaOperador_Editar-error");
};

let LimpiarFormOperadorEditar = () => {
  $("#txtOperador_Editar").val("");
  $("#Color_Editar").val("");
  $("#Color_Editar").css("border-color", "#ced4da");
  $("input:radio[name=rbtGeneraOferta_Editar]:checked").prop("checked", false);
  $("#txtCorreoOperador_Editar").attr("disabled", true);
  $("#txtCorreoOperador_Editar").val("");
  $("#txtContrasenaOperador_Editar").attr("disabled", true);
  $("#txtContrasenaOperador_Editar").val("");
  $("#txtConfirmarContrasenaOperador_Editar").attr("disabled", true);
  $("#txtConfirmarContrasenaOperador_Editar").val("");
  if ($("#checkbox_contrasena").is(":checked")) {
    $("#checkbox_contrasena").trigger("click");
  }
  EliminarClasesValidate("#txtOperador_Editar", 1);
  EliminarClasesValidate("#Color_Editar", 2);
  EliminarClasesValidate("input:radio[name=rbtGeneraOferta_Editar]", 1);
  EliminarClasesValidate("#txtCorreoOperador_Editar", 1);
  EliminarClasesValidate("#txtContrasenaOperador_Editar", 1);
  EliminarClasesValidate("#txtConfirmarContrasenaOperador_Editar", 1);

  EliminarElementosValidate("#txtOperador_Editar-error");
  EliminarElementosValidate("#Color_Editar-error");
  EliminarElementosValidate("#rbtGeneraOferta_Editar-error");
  EliminarElementosValidate("#txtCorreoOperador_Editar-error");
  EliminarElementosValidate("#txtConfirmarContrasenaOperador_Editar-error");
};
