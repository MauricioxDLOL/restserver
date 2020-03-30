
const express = require("express");

let {verificaToken} = require("../middlewares/autenticacion");
let {verificaRol} = require("../middlewares/verificaRol");
let app = express();

let Categoria = require("../models/categoria")

// ===========================
// Mostrar todas las categorias
// ===========================


app.get("/categoria",verificaToken, (req,res) => {

    Categoria.find()
        .sort("descripcion")
        .populate("usuario","nombre email")
        .exec((err,categoriaDB) => {

            if(err){
                return res.json({
                    ok:false,
                    err
                })
            }

            if(!categoriaDB){

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `No se pudieron imprimir los datos`
                    }
                })
    
            }

            res.json({
                ok: true,
                categoriaDB
            })

        })

})

// ===========================
// Mostrar una categoria por ID
// ===========================


app.get("/categoria/:id", verificaToken,(req,res) => {

    let id = req.params.id;

    Categoria.findById(id, (err,categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){

            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se encontro la categoria con id: ${id}`
                }
            })

        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})


// ===========================
// Crear nueva categoria
// ===========================


app.post("/categoria",[verificaToken],(req,res) => {

    let body = req.body;

    let categoria = new Categoria({

        descripcion: body.descripcion,
        usuario: req.usuario._id

    })

    categoria.save((err,categoriaDB) => {

        if(err){
            return res.status(400).json({
                ok:false,
                err: {
                    message: "No se pudo guardar los datos"
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })


    })

})

// ===========================
// Actualizar las categorias
// ===========================


app.put("/categoria/:id", verificaToken,(req,res) => {

    let id = req.params.id
    let descripcion = req.body.descripcion;

    Categoria.findByIdAndUpdate(id,{descripcion}, {new: true, runValidators: true}, (err,categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){

            return res.status(400).json({
                ok: false,
                err: {

                    message: "No se pudo actualizar los datos"
                }
            })

        }
        

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })



})

// ===========================
// Borrar una categoria
// ===========================


//solo admin puede borrar categorias
app.delete("/categoria/:id",[verificaToken,verificaRol], (req,res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err,categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){

            return res.status(400).json({
                ok: false,
                err: {
                    message: `La categoria con id ${id} no existe`
                }
            })

        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

module.exports = app;