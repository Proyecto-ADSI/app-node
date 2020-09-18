const ObtenerPerfil = async () =>{
  
    try {
      
      let Response = await fetch("/ObtenerSession")
  
       Response = await Response.json();
  
       let Session = await Response.session

       $("#Img_Perfil").attr("src",`${URL}/Images/Usuarios/${Session.Usuario_Img}`);
       $("#Nombre_Perfil").html(Session.Nombre)
       $("#Rol_Perfil").html(Session.Rol)
       $("#Correo_Perfil").html(Session.Email)

       let Id_Usuario = parseInt(Session.Id_Usuario);

       ObtenerPerfilAPI(Id_Usuario);
        
    } catch (error) {

        if (error) {
            console.log(error)
        }
  
  
    }
}  

let IdUsuario;
let Usuario;

const ObtenerPerfilAPI = async (Id_Usuario) =>{
  
    try {
      
      let Response = await fetch(`${URL}/Usuarios/${Id_Usuario}`)
  
      Response = await Response.json();
  
      let Perfil = await Response.data

      $("#Celular_Perfil").html(Perfil.Celular)
      $("#Tipo_Documento_Perfil").html(Perfil.Tipo_Documento)
      $("#Documento_Perfil").html(Perfil.Documento)
      $("#Sexo_Perfil").html(Perfil.Sexo)
      $("#Turno_Perfil").html(Perfil.Turno)

     IdUsuario = Id_Usuario

     Usuario = Perfil.Usuario


    
       
    } catch (error) {
  
        if(error){
            console.log(error)
        }
  
    }
}  


const CambiarContrasena = () =>{

    let Contra = {
        Id_Usuario:IdUsuario,
        Contrasena: $("#NuevaContra").val()
    }


    swal({
        title: "¿Desea cambiar la contraseña?",
        text: "La contraseña se cambiara por una nueva",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      }, function () {
        setTimeout(function () {

            $.ajax({
                url:  `${URL}/Usuarios/Restablecer `,
                type: 'patch',
                dataType: 'json',
                contentType:'application/json',
                data: JSON.stringify(Contra),
                processData:false,
                success: function(Response){
                   if(Response.data.Ok){
        
                    swal("Perfecto", "Contraseña cambiada exitosamente", "success")

                    $("#ContrasenaAc").val("")
                    $("#NuevaContra").val("")
                    $("#ConfirNuevaContra").val("")
    
                    RemoveSuccessValidate("#ContrasenaAc")
                    RemoveSuccessValidate("#NuevaContra")
                    RemoveSuccessValidate("#ConfirNuevaContra")
        
        
                   }  
                },
                error: function (error){
        
                    swal("Error", "Ha ocurrido un error", "error")
        
                }
            })
          
        }, 2000);
      });
}

const RemoveSuccessValidate = (element) =>{
    $(element).removeClass("form-control-success");
    $(element).parents(".form-group").removeClass("has-success");
  } 

$(function(){
    ObtenerPerfil();

    

    $("#Form_Cambiar_Contraseña").validate({
        submitHandler: function(){
                CambiarContrasena();
        },
        onkeyup: function (element) {
            if (
              element.id == "ContrasenaAc"
            ) {
              return false;
            }
          },
        rules:{
            ContrasenaAc: {
                required:true,
                remote: function(){
                    let ValidarContrasena = {
                      url: `${URL}/Usuarios/Password`,
                      type: "GET",
                      dataType: "json",
                      data: {
                        Usuario: function(){

                            return Usuario
                        },
                        Id_Usuario_Contrasena: function () {    
                            $("#ContrasenaAc").val();
                          
                            return IdUsuario
                            
                         }
                      },
                      beforeSend:function(){
                        $("#ContrasenaAc").addClass("CargandoGif");    
                      },
                      dataFilter: function (Response) {
                        let Contrasena = JSON.parse(Response);
                        if(Contrasena.data.Ok){
                            $("#ContrasenaAc").removeClass("CargandoGif");

                            return '"true"'
                        }
                        else if (Contrasena.data.Ok == false){
                            $("#ContrasenaAc").removeClass("CargandoGif");

                            return '"Contraseña incorrecta"'

                        }
                      },
                    }
                    return ValidarContrasena;
                }
            },
            NuevaContra: {
                required:true,
                minlength:8,
                maxlength:16
            },
            ConfirNuevaContra:{
                required: true,
                equalTo: "#NuevaContra",
            },
            Autorizo:{
                required:true
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