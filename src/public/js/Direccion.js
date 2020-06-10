$(function () {
  Direccion = "";
  let tipoVia = "";
  let numero1 = "";
  let letra1 = "";
  let complemento1 = "";
  let numero2 = "";
  let letra2 = "";
  let complemento2 = "";
  let numero3 = "";
  let complemento3 = "";

  $("#FormDireccion").validate({
    submitHandler: function () {
      AgregarDireccionInput();
    },
    ignore: "input[type=hidden]",
    successClass: "text-success",
    errorClass: "form-control-feedback",
    errorElement: "div",
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },
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
    rules: {
      txtTipoVia: "required",
      txtNumero1: {
        required: true,
        SoloNumeros: true,
        minlength: 1,
        maxlength: 10,
      },
      txtNumero2: {
        required: true,
        SoloNumeros: true,
        minlength: 1,
        maxlength: 10,
      },
      txtNumero3: {
        required: true,
        SoloNumeros: true,
        minlength: 1,
        maxlength: 10,
      },
    },
  });

  $("#txtTipoVia").change(function () {
    tipoVia = $("#txtTipoVia").val();
    PrevisualizarDireccion();
  });

  $("#txtNumero1").change(function () {
    numero1 = $("#txtNumero1").val();
    PrevisualizarDireccion();
  });

  $("#txtLetra1").change(function () {
    letra1 = $("#txtLetra1 option:selected").val();
    PrevisualizarDireccion();
  });

  $("#txtComplemento1").change(function () {
    complemento1 = $("#txtComplemento1 option:selected").val();
    PrevisualizarDireccion();
  });

  $("#txtNumero2").change(function () {
    numero2 = "# " + $("#txtNumero2").val();
    PrevisualizarDireccion();
  });

  $("#txtLetra2").change(function () {
    letra2 = $("#txtLetra2 option:selected").val();
    PrevisualizarDireccion();
  });

  $("#txtComplemento2").change(function () {
    complemento2 = $("#txtComplemento2 option:selected").val();
    PrevisualizarDireccion();
  });

  $("#txtNumero3").change(function () {
    numero3 = "- " + $("#txtNumero3").val();
    PrevisualizarDireccion();
  });

  $("#txtComplemento3").change(function () {
    complemento3 = $("#txtComplemento3").val();
    PrevisualizarDireccion();
  });

  let PrevisualizarDireccion = () => {
    Direccion =
      tipoVia +
      " " +
      numero1 +
      " " +
      letra1 +
      " " +
      complemento1 +
      " " +
      numero2 +
      " " +
      letra2 +
      " " +
      complemento2 +
      " " +
      numero3 +
      " " +
      complemento3;

    Direccion = Direccion.trim();
    $("#txtDireccionIngresada").val(Direccion);
  };

  let AgregarDireccionInput = () => {
    if (typeof ValDireccionCita != "undefined") {
      if (ValDireccionCita) {
        $("#txtDireccion_Cita").val(Direccion);
        $("#txtDireccion_Cita").trigger("change");
      } else {
        $("#txtDireccion").val(Direccion);
      }
    } else {
      $("#txtDireccion").val(Direccion);
    }

    LimpiarModalDireccion();
    $("#modalDireccion").modal("hide");
  };

  let LimpiarModalDireccion = () => {
    LlenarSelectTipoVia();
    $("#txtNumero1").val("");
    LlenarSelectLetra("#txtLetra1");
    LlenarComplemento("#txtComplemento1");
    $("#txtNumero2").val("");
    LlenarSelectLetra("#txtLetra2");
    LlenarComplemento("#txtComplemento1");
    $("#txtNumero3").val("");
    $("#txtComplemento3").val("");
    $("#txtDireccionIngresada").val("");
    Direccion = "";
    tipoVia = "";
    numero1 = "";
    letra1 = "";
    complemento1 = "";
    numero2 = "";
    letra2 = "";
    complemento2 = "";
    numero3 = "";
    complemento3 = "";
  };

  let LlenarSelectTipoVia = () => {
    let datos = ["Calle", "Carrera", "Circular", "Diagonal", "Transversal"];
    $("#txtTipoVia").empty();
    $("#txtTipoVia").prepend("<option selected disabled >Selecciona</option>");
    for (let i = 0; i < datos.length; i++) {
      let opcion = $("<option />", {
        text: `${datos[i]}`,
        value: `${datos[i]}`,
      });
      $("#txtTipoVia").append(opcion);
    }
  };

  let LlenarSelectLetra = (selector) => {
    let datos = [
      "A",
      "AA",
      "B",
      "BB",
      "C",
      "CC",
      "D",
      "DD",
      "E",
      "EE",
      "F",
      "FF",
      "G",
      "GG",
      "H",
      "HH",
    ];
    $(selector).empty();
    $(selector).prepend("<option selected disabled >Selecciona</option>");
    for (let i = 0; i < datos.length; i++) {
      let opcion = $("<option />", {
        text: `${datos[i]}`,
        value: `${datos[i]}`,
      });
      $(selector).append(opcion);
    }
  };

  let LlenarComplemento = (selector) => {
    let datos = ["Este", "Norte", "Oeste", "Sur"];
    $(selector).empty();
    $(selector).prepend("<option selected disabled >Selecciona</option>");
    for (let i = 0; i < datos.length; i++) {
      let opcion = $("<option />", {
        text: `${datos[i]}`,
        value: `${datos[i]}`,
      });
      $(selector).append(opcion);
    }
  };
});
