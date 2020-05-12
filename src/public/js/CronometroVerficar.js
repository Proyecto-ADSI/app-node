
let minutosVerificar = document.getElementById("txtMinutosV")
let segundosVerificar = document.getElementById("txtSegundosV")
let isMarchV = false;
let acumularTimeV = 0;
function iniciarCronometroVerificar() {
    if (isMarchV == false) {
        timeInicial = new Date();
        control = setInterval(cronometroVerificar, 10);
        isMarchV = true;
    }
}
function cronometroVerificar() {
    timeActual = new Date();
    acumularTimeV = timeActual - timeInicial;
    acumularTimeV2 = new Date();
    acumularTimeV2.setTime(acumularTimeV);
    ss = acumularTimeV2.getSeconds();
    mm = acumularTimeV2.getMinutes();

    if (ss < 10) { ss = "0" + ss; }
    if (mm < 10) { mm = "0" + mm; }
   
    minutosVerificar.innerHTML = mm
    segundosVerificar.innerHTML = ss
}

function detenerCronometroVerificar() {
    if (isMarchV == true) {
        clearInterval(control);
        isMarchV = false;
    }
}
