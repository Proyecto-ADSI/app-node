var room = 1;

function education_fields() {

    room++;
    var objTo = document.getElementById('education_fields')
    var divtest = document.createElement("div");
    divtest.setAttribute("class", "form-group removeclass" + room);
    var rdiv = 'removeclass' + room;
    divtest.innerHTML = '<div class="form-group row"><label for="example-text-input" class="col-md-3 col-form-label">Título</label><div class="col-md-9"><div class="input-group"> <input class="form-control" type="text" value="" id="example-text-input" placeholder="Ingresa el título"><div class="input-group-append"><button class="btn btn-danger" type="button" onclick="remove_education_fields(' + room + ');"> <i class="fa fa-minus"></i> </button></div></div></div></div><div class="row"> <label for="example-text-input" class="col-md-3 col-form-label">Descripción</label><div class="col-9 nopadding"><input type="text" class="form-control" id="Schoolname" name="Schoolname[]" value=""placeholder="Ingresa un nuevo principio"></div></div>'
    objTo.appendChild(divtest)
}

function remove_education_fields(rid) {
    $('.removeclass' + rid).remove();
}