const URL = "http://localhost:8081";

let Redireccionar = (URLRedirect) => {
  fetch("/ObtenerSession", {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => console.log("Error:", error))
    .then((data) => {
      console.log(data);
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



