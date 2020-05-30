var ColorSeleccionadoEdit = null

const pickrEdit = Pickr.create({
  el: '.color-pickerEdit',
  theme: 'classic', // or 'monolith', or 'nano'

  swatches: [
      'rgba(244, 67, 54, 1)',
      'rgba(233, 30, 99, 0.95)',
      'rgba(156, 39, 176, 0.9)',
      'rgba(103, 58, 183, 0.85)',
      'rgba(63, 81, 181, 0.8)',
      'rgba(33, 150, 243, 0.75)',
      'rgba(3, 169, 244, 0.7)',
      'rgba(0, 188, 212, 0.7)',
      'rgba(0, 150, 136, 0.75)',
      'rgba(76, 175, 80, 0.8)',
      'rgba(139, 195, 74, 0.85)',
      'rgba(205, 220, 57, 0.9)',
      'rgba(255, 235, 59, 0.95)',
      'rgba(255, 193, 7, 1)'
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
          save: true
      }
  }
});

pickrEdit.on('change', (color,instance) => {
  ColorSeleccionadoEdit = color.toHEXA().toString()

  // console.log(ColorSeleccionado)

  // console.log(pickr.getSelectedColor().toHEXA().toString()) 

  $("#ColorEdit").val(`Hexadecimal: ${ColorSeleccionadoEdit}`);
  $("#ColorEdit").css('color', ColorSeleccionadoEdit)
  $("#ColorEdit").css('border-color', ColorSeleccionadoEdit)
  $(".pcr-button").css('color', ColorSeleccionadoEdit)
  
})

$(".pcr-save").on("click", function(){
  pickrEdit.hide()
})

$(".pcr-clear").on("click", function(){
    $("#ColorEdit").val()
})

$("#ColorEdit").focus(function(){
  pickrEdit.show()
  // $("#Color").prop( "disabled", true )
})



Id_Operadorr = null;

let ObtenerOperador = (Id_Operador) =>{


    Id_Operadorr = Id_Operador;

  $.ajax({
      url: `${URL}/Operador/ObtenerOperador/${Id_Operadorr}`,
      dataType: 'JSON',
      type: 'get'

  }).done(respuesta => {

    $("#TxtOperadorEdit").val(respuesta.data.Nombre_Operador);
    $("#ColorEdit").val(`Hexadecimal:${respuesta.data.Color}`);
    $("#ColorEdit").css('color', respuesta.data.Color)
    $("#ColorEdit").css('border-color', respuesta.data.Color)
    
      
  }).fail(error => {
      console.log(error);
  });
}

$(document).ready(function(){
  $('#EditarOperador').click(function(){
      ObtenerOperador();
  });
});
