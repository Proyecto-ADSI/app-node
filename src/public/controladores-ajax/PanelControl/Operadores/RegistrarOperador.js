var ColorSeleccionado = null

const pickr = Pickr.create({
    el: '.color-picker',
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

  pickr.on('change', (color,instance) => {
    ColorSeleccionado = color.toHEXA().toString()
  
    // console.log(ColorSeleccionado)
  
    // console.log(pickr.getSelectedColor().toHEXA().toString()) 
  
    $("#Color").val(`Hexadecimal: ${ColorSeleccionado}`);
    $("#Color").css('color', ColorSeleccionado)
    $("#Color").css('border-color', ColorSeleccionado)
    $(".pcr-button").css('color', ColorSeleccionado)
    
  })

  $(".pcr-save").on("click", function(){
    pickr.hide()
  })

  $(".pcr-clear").on("click", function(){
      $("#Color").val('')
      $("#Color").css('border-color', '#ced4da')
  })

  $("#Color").focus(function(){
    pickr.show()
    // $("#Color").prop( "disabled", true )
})


let RegistrarOperador = () => {

    let datos = {
        Nombre: $("#TxtOperador").val(),
        Color: ColorSeleccionado,
        Estado: parseInt(1),
     
    };

    $.ajax({
        url: `${URL}/Operador`,
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal({
                title: "Felicidades",
                text: "Operador registrado correctamente",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "Ok",
              },
              function(){
                ListarOperador();
              });
        }else{
            swal({
                title: "Error",
                text: "Error al registrar",
                type: "error",
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Ok",
              },
              function(){
                location.href = "/App/Administrador/Panel Control/Panel.html";
              });    
        }
    }).fail(error => {
        swal({
            title: "Error",
            text: "Error al registrar",
            type: "error",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ok",
          },
          function(){
            location.href = "/App/Administrador/Panel Control/Panel.html";
          }); 
    });
}
$(function (){



     $("#FormOperador").validate({
        submitHandler: function(){
                RegistrarOperador();
                $("#TxtOperador").val("");
                $("#Color").val("");
                $("#Color").css('border-color','#ced4da')
                $("#FormOperador .form-group").removeClass("has-success")
                $("#FormOperador .form-control").removeClass("form-control-sucess")
        },
        rules:{
            Operador: {
                required:true,
                SoloAlfanumericos:true,
                minlength:2,
                maxlength:45
            }
        },
        errorClass: "form-control-feedback",
        errorElement: "div",
        highlight: function (element) {
            $(element).parents(".form-group").addClass("has-danger").removeClass("has-success");
            $(element).addClass("form-control-danger").removeClass("form-control-success");
        },
        unhighlight: function (element) {

            $(element).parents(".form-group").addClass("has-success").removeClass("has-danger");
            $(element).addClass("form-control-success").removeClass("form-control-danger");
        },
        errorPlacement: function (error, element) {
                error.insertAfter(element.parent(".input-group"));
            
        }
        
    });

})