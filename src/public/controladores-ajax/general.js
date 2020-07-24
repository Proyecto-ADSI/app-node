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

let getArrayString = (string) => {
  let regex = /("[^"]*"|[^,]*),/g;
  let arrayString = string.match(regex);

  let arrayStringFormatiado = [];

  for (let string of arrayString) {
    if (string !== ",") {
      let nuevoString = string.trim();
      nuevoString = nuevoString.replace(/,/g, "");
      arrayStringFormatiado.push(nuevoString);
    }
  }

  return arrayStringFormatiado;
};

let getStringMinutosLDI = (arrayMinutos, cantidadLDI) => {
  let Paises_MLDI = "";
  for (let itemMinutos of arrayMinutos) {
    if (Paises_MLDI == "") {
      Paises_MLDI = itemMinutos;
    } else {
      Paises_MLDI = Paises_MLDI + ", " + itemMinutos;
    }
  }
  let Minutos_LDI = Paises_MLDI + " (" + cantidadLDI + " min)";
  return Minutos_LDI;
};

let getItemsLabel = (arrayItems,color) =>{
  let divLista = "";
  for (let item of arrayItems) {
    let div = `
    <div class="label label-table text-center" style="background-color:${color}; color:#fff">
        ${item}
    </div>`;
    divLista = divLista + div;
  }
  return divLista;
}