let DetallesVisitas = (DetalleVisitas) =>{

    var InfoVisitas = DetalleVisitas

    //Informacion empresa
    $("#Nit_VI_2").html(InfoVisitas.NIT_CDV)
    $("#RazonSocial_VI_V2").html(InfoVisitas.Razon_Social)
    $("#Telefono_VI_V2").html(InfoVisitas.Telefono)
    $("#Encargado_VI_V2").html(InfoVisitas.Encargado)
    $("#Correo_VI_V2").html(InfoVisitas.Correo_Empresa)
    $("#Barrio_VI_V2").html(InfoVisitas.Barrio_Empresa)
    $("#Celular_VI_V2").html(InfoVisitas.Celular_Empresa)

    //Informacion citas
    $("#Fecha_Cita_VI_V2").html(InfoVisitas.Fecha_Cita)
    $("#Encargado_Cita_VI_V2").html(InfoVisitas.Encargado_Cita)
    $("#Telefono_Externo_VI_V2").html(InfoVisitas.Ext_Tel_Contacto_Cita)
    $("#Direccion_VI_V2").html(InfoVisitas.Direccion)
    $("#BarrioC_VI_V2").html(InfoVisitas.Nombre_Barrio_Vereda)
    $("#Referencia_VI_V2").html(InfoVisitas.Lugar_Referencia)
    $("#Operador_VI_V2").html(InfoVisitas.Operador_Cita)
    if (InfoVisitas.Id_Estado_Cita == "5") {
        $("#Estado_Cita_VI_V2").html("En reporte")
    } else if(InfoVisitas.Id_Estado_Cita == "7") {
        $("#Estado_Cita_VI_V2").html("Asignada")
    }
}