let DetallesCitass = (DetallesCitas) =>{
    
     let DataCi = DetallesCitas


    //Datos del cliente(Directorio)
    $("#Nit-Citas").html(DataCi.NIT_CDV)
    $("#RazonSocial-Citas").html(DataCi.Razon_Social)
    $("#Telefono-Citas").html(DataCi.Telefono)
    //Datos llamada
    $("#DueñoEmpresa-Citas").html(DataCi.Persona_Responde)

    let Fecha =  new Date(DataCi.Fecha_Llamada)
    let Mes = Fecha.getMonth()+1
    let Dia = Fecha.getDate()
    let Año = Fecha.getFullYear()
    let Fecha1 = Dia + "/" +"0"+Mes + "/" + Año;

    $("#FechaLlamada-Citas").html(Fecha1)

    let Hora = new Date(DataCi.Fecha_Llamada)

    let Hora1 = Hora.getHours()
    let Minutos = Hora.getMinutes()

    let HoraReal = Hora1 + ":" + Minutos 

    if(Minutos == 0){
             
     let Hora2 = Hora1 + ":" +"0"+Minutos
     $("#HoraLlamada-Cita").html(Hora2)   

    }
    else{
        $("#HoraLlamada-Cita").html(HoraReal) 
    }
   
    if (DataCi.Info_Habeas_Data == 1) {
        $("#InfoHabeas-Citas").html("Sí")
    } else if(DataCi.Info_Habeas_Data == 0){
        $("#InfoHabeas-Citas").html("No")
    }
    $("#EstadoLlamada-Citas").html(DataCi.Estado_Llamada)
    if (DataCi.Observacion == "") {
        $("#ObservacionLlamada-Citas").html("N/A")
    } else {
        $("#ObservacionLlamada-Citas").html(DataCi.Observacion)
    }
 



    //Datos cita
    let FechaCitas =  new Date(DataCi.Fecha_Cita)
    let Mess = FechaCitas.getMonth()+1
    let Diaa = FechaCitas.getDate()
    let Añoo = FechaCitas.getFullYear()

    let FechaCita = Diaa + "/" +"0"+Mess + "/" + Añoo;

    $("#Fecha-Citass").html(FechaCita)

    let HoraCitas = new Date(DataCi.Fecha_Cita)

    let Horaa1 = HoraCitas.getHours()
    let Minutooss = HoraCitas.getMinutes()

    let HoraCitaReal = Horaa1 + ":" + Minutooss 

    if(Minutooss == 0){
             
     let Horaa2 = Horaa1 + ":" +"0"+Minutooss
     $("#Hora-Cita").html(Horaa2)   

    }
    else{
        $("#Hora-Cita").html(HoraCitaReal) 
    }

    $("#Departamento-Cita").html(DataCi.Nombre_Departamento)
    $("#Municipio-Cita").html(DataCi.Nombre_Municipio)
    $("#Barrio-Cita").html(DataCi.Nombre_Barrio_Vereda)
    $("#Direccion-Cita").html(DataCi.Direccion_Cita)


    // Datosvisita
    $("#Fecha-Visita").html(DataCi.Fecha_Visita)
    $("#TipoVenta-Citas").html(DataCi.Tipo_Venta)
    $("#Asesor-Cita").html(DataCi.Nombre_Asesor)

    if(DataCi.Estados_Visita == "N/A"){
        $("#EstadoVisita-Citas").html("N/A")
    }
    else if (DataCi.Estados_Visita == 1) {
        $("#EstadoVisita-Citas").html("Sin realizar")
    } else if(DataCi.Estados_Visita == 2) {
        $("#EstadoVisita-Citas").html("En negociación")
    }
    else if(DataCi.Estados_Visita == 3){
        $("#EstadoVisita-Citas").html("Efectiva")
    }
    else if(DataCi.Estados_Visita == 4){
        $("#EstadoVisita-Citas").html("No efectiva")
    }
    else if(DataCi.Estados_Visita == 5){
        $("#EstadoVisita-Citas").html("Cancelada")
    }


    //Novedades
    if (DataCi.Id_Novedad == 'N/A') {
        $("#Novedades-TabPane").css({"display":"none"})
        $("#NovedadesLi").css({"display":"none"})
    } else {
        $("#Novedades-TabPane").css({"display":"block"})
        $("#NovedadesLi").css({"display":"block"})

        $("#Fecha-Novedad").html(DataCi.Fecha_Novedad)
        if (DataCi.Estado_Novedad == 12) {
            $("#Estado-Novedad").html("Inválida")
        } else if(DataCi.Estado_Novedad == 16){
            $("#Estado-Novedad").html("Reagendada")
        }else if(DataCi.Estado_Novedad == 14){
            $("#Estado-Novedad").html("Cancelada")
        }
        $("#Descripcion-Novedad").html(DataCi.Descripcion_Novedad)
    }
}
