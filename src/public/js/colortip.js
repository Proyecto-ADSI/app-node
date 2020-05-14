$(function () {
  // Habilitar los tooltips
    InicializarToltips();
});


let InicializarToltips = () => {
    $("[title]").colorTip({
        color: "black",
        timeout: 50
    });
}