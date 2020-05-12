
// Para editar
var Id_Cliente;

CargarDatosModalDetalles = (datos) => {

    Informacion = datos.data;

    // Llenar detalles cliente
    Id_Cliente = Informacion.Id_Cliente;
    document.getElementById("txtRazon_Social").innerHTML = Informacion.Razon_Social;
    document.getElementById("txtTelefono").innerHTML = Informacion.Telefono;
    document.getElementById("txtNIT").innerHTML = Informacion.NIT_CDV;
    document.getElementById("txtEncargado").innerHTML = Informacion.Encargado;
    document.getElementById("txtExtension_celular").innerHTML = Informacion.Ext_Tel_Contacto;

    document.getElementById("txtPais").innerHTML = Informacion.Nombre_Pais;
    document.getElementById("txtDepartamento").innerHTML = Informacion.Nombre_Departamento;
    document.getElementById("txtMunicipio").innerHTML = Informacion.Nombre_Municipio;
    document.getElementById("txtTipo").innerHTML = Informacion.SubTipo;
    document.getElementById("txtBarrio_Vereda").innerHTML = Informacion.Nombre_Barrio_Vereda;
    document.getElementById("txtDireccion").innerHTML = Informacion.Direccion;
    
    document.getElementById("txtOperador_tbl_Lineas").innerHTML = Informacion.Nombre_Operador;
    document.getElementById("txtCalificacion").innerHTML = Informacion.Calificacion;
    document.getElementById("txtRazones").innerHTML = Informacion.Razones;

    if(Informacion.Detalle_Lineas){
        
        $("#Datos_Validacion").css("display","none");
        $("#Tabla_Detalle_Lineas").removeAttr('style');

        let detalleLineas = Informacion.Detalle_Lineas;
        $("#Tbody_detalle_Lineas").empty();
        for(let infoLinea of detalleLineas){
            
            $("#Tbody_detalle_Lineas").append(`

                <tr>
                    <td>${infoLinea.Linea == "0" ? 'No registrada' : infoLinea.Linea} </td>
                    <td>${infoLinea.Minutos}</td>
                    <td>${infoLinea.Navegacion}</td>
                    <td>
                    ${infoLinea.Mensajes == "1" ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl1">Mensajes</label>' : ""}
                        
                    ${infoLinea.Redes_Sociales == "1" ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl">Redes</label>' : ""} 
                    
                    ${infoLinea.Llamadas_Inter == "1" ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl1">Llamadas Inter</label>': ""}
                         
                    ${infoLinea.Roaming == "1" ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl">Roaming</label>': ""} 
                         
                        
                    </td>
                    <td>
                        <i class="fa fa-dollar"></i>
                        <div class="float-right">${infoLinea.Cargo_Basico}</div> 
                    </td>
                </tr>
            `);
        }
        document.getElementById("txtCantidad_Lineas1").innerHTML = Informacion.Cantidad_Total_Lineas;
        document.getElementById("txtValor_Mensual1").innerHTML = Informacion.Valor_Total_Mensual;
    }else{

        $("#Tabla_Detalle_Lineas").css("display","none");
        $("#Datos_Validacion").removeAttr('style');
        document.getElementById("txtCantidad_Lineas2").innerHTML = Informacion.Cantidad_Total_Lineas;
        document.getElementById("txtValor_Mensual2").innerHTML = Informacion.Valor_Total_Mensual;
    }
    
    let Id_Plan_Corporativo = parseInt(Informacion.Id_Plan_Corporativo);

    if(Id_Plan_Corporativo > 0 ){

        $("#Menu_Plan").removeAttr('style');
        $("#Menu_Doc").removeAttr('style');
        $("#Menu_Comp").removeAttr('style');


        let clausula = parseInt(Informacion.Clausula_Permanencia);
        
        if(clausula == 1){
            $('#switch_input_clausula input').trigger('click');
        }

        document.getElementById("txtFecha_Inicio").innerHTML = Informacion.Fecha_Inicio;
        document.getElementById("txtFecha_Fin").innerHTML = Informacion.Fecha_Fin;
        document.getElementById("txtDescripcion").innerHTML = Informacion.Descripcion;

    }else{

        $("#Menu_Plan").css("display","none");
        $("#Menu_Doc").css("display","none");
        $("#Menu_Comp").css("display","none");
    }
   // Mostrar Modal con formulario para editar
   $('.ModalDetalles').modal('show');

}

MostrarModalEditar = () =>{
    $('.ModalDetalles').modal('hide');
    ObtenerCliente(Id_Cliente,2);
}
