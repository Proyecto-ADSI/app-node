const URL = "http://localhost:8081";
const NA = "N/A";

let Redireccionar = (URLRedirect) => {
  fetch("/ObtenerSession", {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => console.log("Error:", error))
    .then((data) => {
      let Id_Rol = parseInt(data.session.Id_Rol);
      switch (Id_Rol) {
        case 1:
          //Administrador
          location.href = `/App/Admin${URLRedirect}`;
          break;
        case 2:
          //Coordinador
          location.href = `/App/Coordinador${URLRedirect}`;
          break;
        case 3:
          //Contact center
          location.href = `/App/ContactCenter${URLRedirect}`;
          break;
        case 4:
          //Asesor Interno
          location.href = `/App/AsesorInterno${URLRedirect}`;
          break;
        case 5:
          //Asesor Externo
          location.href = `/App/AsesorExterno${URLRedirect}`;
          break;
        case 6:
          //Gestor
          location.href = `/App/GestorCliente${URLRedirect}`;
          break;
      }
    });
};

async function ObtenerSession() {
  const response = await fetch("/ObtenerSession");
  const data = await response.json();
  return data;
}

let MostrarLoaderGeneral = () => {
  $("#modal_Loader_General").modal("show");
};

let OcultarLoaderGeneral = () => {
  $("#modal_Loader_General").modal("hide");
};

let MostrarLoaderPuntos = () => {
  $("#card-loading").addClass("show");
};

let OcultarLoaderPuntos = () => {
  $("#card-loading").removeClass("show");
};

let MostrarLoaderLlamada = () => {
  $("#modal_Loader_Llamada").modal("show");
};

let OcultarLoaderLlamada = () => {
  $("#modal_Loader_Llamada").modal("hide");
};

let FormatearFecha = (fecha, tiempo) => {
  let fechaFormateada = null;
  let fechaCitaInput = new Date(fecha);
  let anio = fechaCitaInput.getFullYear();
  let mes = fechaCitaInput.getMonth() + 1;
  let dia = fechaCitaInput.getDate();

  mes > 10 ? (mes = "0" + mes) : (mes = mes);
  dia > 10 ? (dia = "0" + dia) : (dia = dia);

  if (tiempo) {
    let horas = fechaCitaInput.getHours();
    let minutos = fechaCitaInput.getMinutes();

    horas < 10 ? (horas = "0" + horas) : (horas = horas);
    minutos < 10 ? (minutos = "0" + minutos) : (minutos = minutos);

    fechaFormateada = `${anio}-${mes}-${dia} ${horas}:${minutos}:00`;
  } else {
    fechaFormateada = `${anio}-${mes}-${dia}`;
  }

  return fechaFormateada;
};