let FormatearCelular = (stringCelular) => {
  // Código postal
  let regex = /("[^"]*"|[^ ]*) /g;
  let arrayStringCodigo = stringCelular.match(regex);
  let codigo = arrayStringCodigo[0];
  // Eliminar +
  codigo = codigo.substring(1);
  // Eliminar espacio final.
  codigo = codigo.trim();
  // Celular
  let regex2 = /3[\d]+$/g;
  let arrayString = stringCelular.match(regex2);
  let celular = arrayString[0];

  let info = {
    codigo: codigo,
    celular: celular,
  };
  return info;
};
