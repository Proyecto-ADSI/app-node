// Theme color settings
$(document).ready(function () {
  function store(name, val) {
    if (typeof Storage !== "undefined") {
      localStorage.setItem(name, val);
    } else {
      window.alert(
        "Please use a modern browser to properly view this template!"
      );
    }
  }

  $(document).on("change", "#switch_input", function (e) {
    fetch("/CambiarTema", {
      method: "GET",
    })
      .then((res) => res.json())
      .catch((error) => console.log("Error:", error))
      .then((data) => {
        if (data.ok) {
          let input = $(this).children("label").children("input");
          if (input[0].checked) {
            let tema = "Oscuro";
            store("Tema_Aplicacion", tema);
            $("#Tema").attr({ href: "/css/colors/Tema_" + tema + ".css" });
            $("#Style_Tema").attr({ href: "/css/style_" + tema + ".css" });
          }
           else {
            let tema = "Blanco";
            store("Tema_Aplicacion", tema);
        
            $("#Tema").attr({ href: "/css/colors/Tema_" + tema + ".css" });
            $("#Style_Tema").attr({ href: "/css/style_" + tema + ".css" });
          }
        }
      });
  });

  $(document).on("click", ".dropdown-menu", function (e) {
    e.stopPropagation();
  });
});


$(document).ready(function(){

  if (localStorage.Tema_Aplicacion == "Blanco") {    

    let tema = "Blanco";
            
    $("#Tema").attr({ href: "/css/colors/Tema_" + tema + ".css" });
    $("#Style_Tema").attr({ href: "/css/style_" + tema + ".css" });

    }
    else if (localStorage.Tema_Aplicacion == "Oscuro"){

      let tema = "Oscuro";

       $("#switch_input").children("label").children("input").prop("checked");
            
      $("#Tema").attr({ href: "/css/colors/Tema_" + tema + ".css" });
      $("#Style_Tema").attr({ href: "/css/style_" + tema + ".css" });

    }
})