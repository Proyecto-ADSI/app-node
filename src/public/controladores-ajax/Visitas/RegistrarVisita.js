Form_Datos_Visita = null;
$(function () {
  Form_Datos_Visita = $("#Form_Datos_Visita").show();

  Form_Datos_Visita.steps({
    headerTag: "h6",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',

});
})