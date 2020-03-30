

const express = require("express");

const {verificaToken} = require("../middlewares/autenticacion");
const _ = require("underscore");


let app = express();

let Producto = require("../models/productos");

//=========================
// Obtener productos
//=========================

app.get("/productos",verificaToken,(req,res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    Producto.find({disponible: true})
        .skip(desde)
        .sort("descripcion")    
        .populate("usuario","nombre email")
            .populate("categoria","descripcion")
        .exec((err,productoDB) => {

            if(err){

                return res.status(500).json({

                    ok: false,
                    err

                })
            }

            if(!productoDB){

                return res.status(400).json({

                    ok: false,
                    err: {
                        message: `No se pudo encontrar ningun producto`
                    }

                })

            }

            res.json({
                ok: true,
                producto: productoDB
            })

        })

})

//=========================
// Obtener un producto por id
//=========================

app.get("/productos/:id",verificaToken, (req,res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate("usuario","nombre email")
        .populate("categoria"," nombre")
        .exec((err,productoDB)=> {

        if(err){

            return res.status(500).json({

                ok: false,
                err

            })
        }

        if(!productoDB){

            return res.status(400).json({

                ok: false,
                err: {
                    message: `No se encontro un producto con id ${id}`
                }

            })

        }

        res.json({
            ok: true,
            producto: productoDB
        })

        

    })

})

//=========================
// Buscar productos
//=========================

app.get("/productos/buscar/:termino", verificaToken,(req,res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Producto.find({nombre: regex})
        .populate("categoria","Nombre")
        .exec((err,productos) => {

            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })

            }

            res.json({
                ok: true,
                productos
            })
        })
})



//=========================
// Crear producto
//=========================

app.post("/productos", verificaToken,(req,res) => {

    let body = req.body;

    let producto = new Producto({

        usuario: req.usuario._id,
        nombre: body.nombre,
        categoria: body.categoria,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible

    })

    producto.save((err,productoBD) => {

        if(err){

            return res.status(500).json({

                ok: false,
                err

            })
        }

        res.json({

            ok: true,
            producto: productoBD


        })

    })
})

//=========================
// Actualizar Producto
//=========================

app.put("/productos/:id", verificaToken,(req,res) => {

    let id = req.params.id;
    let body =  _.pick(req.body, [

        "nombre",
        "precioUni",
        "descripcion",
        "disponible", 
        
    ]);

    Producto.findByIdAndUpdate(id,body, {new: true, runValidators: true},(err,productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se encontro un producto con id ${id}`
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

})

//=========================
// Borrar producto
//=========================

app.delete("/productos/:id", verificaToken,(req,res) => {

    let id = req.params.id;
 
    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err,productoBD)=> {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoBD){
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se encontro un producto con id ${id}`
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        })




    })

})

module.exports = app