
$(function(){ 
    CalendarId = document.getElementById('Calendar');
    Calendar = new FullCalendar.Calendar(CalendarId, {  
    initialView: 'dayGridMonth',
    themeSystem: 'standart',
    locale:'es',
    weekNumbers: true,
    navLinks: true,
    dayMaxEvents: 1,
    eventLimit: 1, // for all non-TimeGrid views

    headerToolbar: {
        left: 'prevYear,prev,next,nextYear today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
    views: {
        dayGrid: {
            eventTimeFormat: {
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: true,
                // meridiem: true,
                hour12: true
            },
        },
        timeGrid: {
          // options apply to timeGridWeek and timeGridDay views
         eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }
        },
        week: {
          
        },
        day: {
          
        }
      },


      eventClick: function(info) {
        $("#ModalEvents").modal('show')
        var eventObj = info.event;
        var eventData = info.event.extendedProps;

    
        //Información visitas
        $("#User").attr("src",`${URL}/Images/Usuarios/${eventData.Imagen}`);
        $("#Name").html(eventData.Nombre)
        $("#UserName").html(eventData.Usuario)
        $("#Email_Ase").html(eventData.Email_Ase)
        $("#Rol_Event").html(eventData.Rol)
        $("#Tipo_Visita").html(eventData.Tipo_Visita)
        $("#Informacion_Asesor").html(eventData.Observacion)
        $("#Operador_Cita").html(eventData.Operador_Cita)

        //Informacion Empresa
        $("#ImgOpAc").attr("src",`${URL}/Images/Usuarios/${eventData.ImgOperador_Ac}`);
        $("#Razon_Social").html(eventData.Razon_Social)
        $("#Telefono_Empresa").html(eventData.Telefono_Empresa)
        $("#Barrio_Empresa").html(eventData.Barrio_Vereda)
        $("#Operador_Empresa").html(eventData.Operador_Actual)
        // $("#Operador_Empresa").css({"color":eventData.Color_OP_Ac})
        $("#Correo_Empresa").html(eventData.Correo_Empresa)
        $("#Celular_Empresa").html(eventData.Celular_Empresa)
        $("#Encargado_Empresa").html(eventData.Encargado_Empresa)
        $("#Correo_Operador_Empresa").html(eventData.Correo_OP_Empresa)

        //Informacion cita
        $("#ImgOpC").attr("src",`${URL}/Images/Usuarios/${eventData.ImgOperador_C}`);
        $("#Encargado_Cita_V").html(eventData.Encargado_Cita)
        $("#Tel_Ex_C").html(eventData.Es_Tel_Cita)
        $("#Fecha_Cita_V").html(eventData.Fecha_Cita)
        $("#Operador_C_V").html(eventData.Correo_OP_Cita)
        $("#Direccion_V").html(eventData.Direccion)
        $("#Lugar_R_V").html(eventData.Lugar_Referencia)
        $("#Operador_V").html(eventData.Operador_Cita)
        if (eventData.Estado_Cita =="5") {
          $("#Estado_Cita_V").html("En reporte")
        } else if(eventData.Estado_Cita =="7") {
          $("#Estado_Cita_V").html("Asignada")
        }
        $("#Barrio_C_V").html(eventData.Barrio_Cita)
    }
 
    });

    ListarVisitas = () =>{ 
    $.ajax({
        url:`${URL}/Citas/Visitas`,
        dataType:'json',
        type:'GET',
    }).done(respuesta =>{ 
      $("#List-Operadores").empty();
      $("#List-Operadores").append(
           
        `<div class="card-title m-t-10">
        <h4>Operadores</h4>
        </div> `
                      
                      );

        // let MinutosAdd = new Date(respuesta.data.TiempoFin.Duracion_Cita)
        // let MinutosAdd = respuesta.data.TiempoFin.Duracion_Cita

        respuesta.data.OperadoresCitas.forEach(element => {
          $("#List-Operadores").append(
           
            `<div class="MyStyle_Calentar_List">
            <i class="fa fa-circle" style='color:${element.Color};'></i> ${element.Operador_Cita}
            </div> `
                          
                          );
        });

        respuesta.data.VisitasSinFin.forEach(element => {

            if (element.Tipo_Visita == 0) {
                Calendar.addEvent({
                    id: element.Id_Visita,
                    title: element.Razon_Social,
                    start: element.Fecha_Cita,
                    allDay: false,
                    color: element.Color,
                    className: ["event", "Interno_Event"],
                    extendedProps: {
                        Imagen: element.Imagen,
                        Usuario: element.Usuario,
                        Email_Ase: element.Email,
                        Rol: element.Rol,
                        Tipo_Visita : "Interna",
                        Nombre: element.Nombre,
                        Direccion: element.Direccion,
                        Observacion: element.Observacion,
                        Operador_Cita: element.Operador_Cita,
                        Razon_Social: element.Razon_Social,
                        NIT : element.NIT_CDV,
                        Encargado_Empresa:element.Encargado,
                        Operador_Actual: element.Operador_Actual,
                        Correo_Empresa : element.Correo_Empresa,
                        Telefono_Empresa: element.Telefono,
                        Celular_Empresa : element.Celular_Empresa,
                        Barrio_Vereda : element.Barrio_Empresa,
                        Correo_OP_Empresa : element.Correo_OP_Actual,
                        Encargado_Cita : element.Encargado_Cita,
                        Es_Tel_Cita : element.Ext_Tel_Contacto_Cita,
                        Fecha_Cita : element.Fecha_Cita,
                        Direccion : element.Direccion,
                        Barrio_Cita: element.Nombre_Barrio_Vereda,
                        Lugar_Referencia: element.Lugar_Referencia,
                        Operador_Cita: element.Operador_Cita,
                        Correo_OP_Cita: element.Correo_Operador,
                        Estado_Cita : element.Id_Estado_Cita,
                        ImgOperador_C : element.Imagen_OP_Cita,
                        ImgOperador_Ac: element.Imagen_OP_Actual,
                        Color_OP_Ac: element.Color_OP_Actual,
                        Color_OP_C : element.Color
                      },
                })
            } else if(element.Tipo_Visita == 1){
                Calendar.addEvent({
                    id: element.Id_Visita,
                    title: element.Razon_Social,
                    start: element.Fecha_Cita,
                    allDay: false,
                    color: element.Color,
                    className: ["event", "Externo_Event"],
                    extendedProps: {
                        Imagen: element.Imagen,
                        Usuario: element.Usuario,
                        Email_Ase: element.Email,
                        Rol: element.Rol,
                        Tipo_Visita : "Externa",
                        Nombre: element.Nombre,
                        Direccion: element.Direccion,
                        Observacion: element.Observacion,
                        Operador_Cita: element.Operador_Cita,
                        Razon_Social: element.Razon_Social,
                        NIT : element.NIT_CDV,
                        Encargado_Empresa:element.Encargado,
                        Operador_Actual: element.Operador_Actual,
                        Correo_Empresa : element.Correo_Empresa,
                        Telefono_Empresa: element.Telefono,
                        Celular_Empresa : element.Celular_Empresa,
                        Barrio_Vereda : element.Barrio_Empresa,
                        Correo_OP_Empresa : element.Correo_OP_Actual,
                        Encargado_Cita : element.Encargado_Cita,
                        Es_Tel_Cita : element.Ext_Tel_Contacto_Cita,
                        Fecha_Cita : element.Fecha_Cita,
                        Direccion : element.Direccion,
                        Barrio_Cita: element.Nombre_Barrio_Vereda,
                        Lugar_Referencia: element.Lugar_Referencia,
                        Operador_Cita: element.Operador_Cita,
                        Correo_OP_Cita: element.Correo_Operador,
                        Estado_Cita : element.Id_Estado_Cita,
                        ImgOperador_C : element.Imagen_OP_Cita,
                        ImgOperador_Ac: element.Imagen_OP_Actual,
                        Color_OP_Ac: element.Color_OP_Actual,
                        Color_OP_C : element.Color
                      },
                })
            }
        });
    })
  }
    Calendar.render();
    ListarVisitas()      
})
