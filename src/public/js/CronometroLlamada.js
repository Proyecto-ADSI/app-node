$(function(){
    minutosLlamada = document.getElementById("txtMinutosL")
    segundosLlamada = document.getElementById("txtSegundosL")
})
let isMarch = false;
let acumularTime = 0;
function iniciarCronometroLlamada() {
    if (isMarch == false) {
        timeInicial = new Date();
        control = setInterval(cronometroLlamada, 10);
        isMarch = true;
    }
}
function cronometroLlamada() {
    timeActual = new Date();
    acumularTime = timeActual - timeInicial;
    acumularTime2 = new Date();
    acumularTime2.setTime(acumularTime);
    ss = acumularTime2.getSeconds();
    mm = acumularTime2.getMinutes();

    if (ss < 10) { ss = "0" + ss; }
    if (mm < 10) { mm = "0" + mm; }
   
    minutosLlamada.innerHTML = mm
    segundosLlamada.innerHTML = ss
}

function detenerCronometroLlamada() {
    if (isMarch == true) {
        clearInterval(control);
        isMarch = false;
    }
}
