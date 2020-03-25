
let verificaRol = (req,res,next) => {

    let usuarioRole = req.usuario;

    if(usuarioRole.role !== "ADMIN_ROLE"){

        return res.json({

            ok: false,
            err: {
                message: "Usuario no valido"
            }

        })

        
    }

    next();

}

module.exports = {
    verificaRol
}