var Llamada_Precargada = false;

let InicializarFormNP = () => {
  stepPlanCorp = form.steps("getStep", 2);
  stepCita = form.steps("getStep", 3);
  stepAT = form.steps("getStep", 4);
  stepFinLlamada = form.steps("getStep", 5);
  stepProgramarFecha = form.steps("getStep", 6);
  stepDiseñarOferta = form.steps("getStep", 7);
  form.steps("remove", 2);
  form.steps("remove", 2);
  form.steps("remove", 2);
  form.steps("remove", 3);
  form.steps("remove", 3);

  // Inicializar selects del formulario
  CargarDatosUbicacion();
  CargarOpcionesPredefinidas();
  CargarOperadores();
  CargarCalificaciones();
};
