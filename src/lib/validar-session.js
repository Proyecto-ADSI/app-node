module.exports = {
    usuarioLogeado (req, res, next) {
        // if (req.session.datos_usuario && req.cookies.user_sid){
        //     return next();
        // }
        // return res.redirect('/Login');

        return next();
    },
    redireccionarUsuario(req,res,next){
        // if(req.session.datos_usuario && req.cookies.user_sid){
        //     let Id_Rol = parseInt(req.session.datos_usuario.Id_Rol);
        //     switch (Id_Rol) {
        //         case 1:
        //             return res.redirect('/App/Admin');
        //         case 2:
        //             return res.redirect('/App/Coordinador');
        //         case 3:
        //             return res.redirect('/App/Contact');
        //         case 4:
        //             return res.redirect('/App/AsesorInterno');
        //         case 5:
        //             return res.redirect('/App/AsesorExterno');
        //         case 6:
        //             return res.redirect('/App/GestorCliente');
        //     }
        // }else{
        //     return next();
        // }

        return next();
    }
};