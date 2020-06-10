// Validaciones adiconales (Personalizadas)
$.validator.addMethod(
  "SoloLetras",
  function (value, element) {
    return this.optional(element) || /^[A-Za-z ñáéíóúÁÉÍÓÚ]+$/i.test(value);
  },
  "Solo se permiten caracteres alfabéticos"
);

$.validator.addMethod(
  "SoloAlfanumericos",
  function (value, element) {
    return this.optional(element) || /^[\w \s ñáéíóúÁÉÍÓÚüÜ., ]+$/.test(value);
  },
  "No se permiten caracteres especiales"
);

$.validator.addMethod(
  "SoloNumeros",
  function (value, element) {
    return this.optional(element) || /^[\d]+$/.test(value);
  },
  "Ingrese un número válido"
);

$.validator.addMethod(
  "ValidarCelular",
  function (value, element) {
    return this.optional(element) || /^3[\d]+$/.test(value);
  },
  "Ingrese un número de célular válido"
);

$.validator.addMethod(
  "SoloHoras",
  function (value, element) {
    return this.optional(element) || /^[\d:]+$/.test(value);
  },
  "Ingrese una hora valida"
);

$.validator.addMethod(
  "SoloNumeros2",
  function (value, element) {
    return this.optional(element) || /^[1-9]\d*/.test(value);
  },
  "Ingrese una valor válido."
);

$.validator.addMethod(
  "NumeroMovil",
  function (value, element) {
    return this.optional(element) || /^3[\d]+$/.test(value);
  },
  "Ingrese un número de celular válido"
);

$.validator.addMethod(
  "ValidarCorreo",
  function (value, element) {
    return (
      this.optional(element) ||
      /[A-Za-zñáéíóúÁÉÍÓÚ\d]+@[A-Za-zñáéíóúÁÉÍÓÚ]+\.[a-z]{2,4}/.test(value)
    );
  },
  "Ingrese un correo electrónico válido"
);

$.validator.addMethod(
  "ValidarNIT",
  function (value, element) {
    return (
      this.optional(element) ||
      /(^[\d]+$)/.test(value) ||
      /(^[\d]+[-]+[\d]$)/.test(value)
    );
  },
  "Ingrese un NIT válido"
);

$.validator.addMethod(
  "ValidarCantidadLineas",
  function (value, element) {
    let boolValiacion = true;
    let id_linea = $(element).attr("id_linea");
    let DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));

    if (typeof id_linea !== "undefined") {
      for (let linea of DetalleLineas) {
        if (linea.id == id_linea) {
          console.log(parseInt(linea.cantidadLineas));
          if (value < parseInt(linea.cantidadLineas)) {
            boolValiacion = false;
          }
        }
      }
    }

    return boolValiacion;
  },
  "No se puede disminuir la cantidad, consulte el detalle."
);

// $.validator.addMethod("ValidarDirecion", function(value,element){
//     return this.optional(element) || /^[\w]+[#\s][\w]{2,5}[-\s][\d]{2,5}$/.test(value);
// },"Ingrese una Dirección válida");
