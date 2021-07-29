const router = require('express').Router();
const { sequelize } = require('../config/db');

const { getLast5Days,
    getTipoCambio,
    setFecha,
    setFechaNow,
    setHoraActual,
    especialFormat
} = require('../controllers/tipoCambioCtrl');
const TIPOCAMBIO = require('../models/T_cambio');

require('../config/db');


// Obtener tipo de cambio
router.get('/dolares/:id', async (req, res) => {

    const fechaAnterior = getLast5Days(req.params.id);
    const formatoYYMMDD = setFecha(fechaAnterior[0]);
    const convertToDate = new Date(formatoYYMMDD);
    const diaSemana = convertToDate.getDay(); // Obtener dia de semana
    let fechaActual = ""; // 5=sabado y 6=domingo en local 0=domingo y 6=sabado en web
    let arregloFechas = "";
    let fecha = "";

    // Buscar en la BD si es sabado, domingo o dia de la semana
    if (diaSemana === 6) {
        fechaActual = fechaAnterior[1];
    } else if (diaSemana === 0) {
        fechaActual = fechaAnterior[2];
    } else {
        fechaActual = fechaAnterior[0]
    }

    const tipoCambioDB = await TIPOCAMBIO.findOne({
        attributes: ['FEC_CMB', 'TIP_CMB', 'TIP_CMBC'],
        where: {
            FEC_CMB: setFecha(fechaActual)
        }
    });

    // Si no está en DB, hacer la búsqueda
    if (!tipoCambioDB) {
   
        // Si la fecha anterior a la ingresada es domingo,
        // hacer la busqueda desde el dia sabado.
        if (diaSemana === 0) {            
            fechaActual = fechaAnterior[1];
            fecha = especialFormat(fechaActual);
            arregloFechas = getLast5Days(fecha);
        } else {
            fecha = (req.params.id).toString();
            arregloFechas = getLast5Days(fecha);
        }

        // if (diaSemana2 === 0 || diaSemana2 === 6) {
        //     fecha = especialFormat(fechaActual);
        //     console.log('segundo', fecha);
        //     arregloFechas = getLast5Days(fecha);
        //     console.log('tercero', arregloFechas);
        // } else {
        //     fecha = (req.params.id).toString();
        //     arregloFechas = getLast5Days(fecha);
        // }

        if (!arregloFechas) {
            return res.status(400).json({
                message: 'Fecha no encontrada'
            });
        }

        // Obtener el tipo de cambio
        const tipoCambio = await getTipoCambio(arregloFechas);
        if (!tipoCambio) {
            return res.status(400).json({
                error: 'Tipo de cambio no encontrado'
            });
        }

        // Validar que esta fecha no exista en la base de datos
        const validarNuevaFecha = await TIPOCAMBIO.findOne({
            where: {
                FEC_CMB: setFecha(tipoCambio.fecha)
            }
        });

        // Si no existe, guardar el tipo de cambio en la BD
        if (!validarNuevaFecha) {
            const fechaFormatoDB = setFecha(tipoCambio.fecha);
            const fechaHoyFormatDB = setFechaNow(new Date());
            const horaFormatDB = setHoraActual(new Date());
           
            const guardarFechaDB = await sequelize.query(`INSERT INTO T_cambio VALUES (
                '${fechaFormatoDB}',
                ${tipoCambio.venta},
                ${tipoCambio.compra},
                'SUPERVISOR',
                '${fechaHoyFormatDB}',
                '${horaFormatDB}',
                0,0
            )`);
        }
        return res.json({
            FEC_CMB: setFecha(tipoCambio.fecha),
            TIP_CMB: Number(tipoCambio.venta),
            TIP_CMBC: Number(tipoCambio.compra),
        });
    }
    res.json(tipoCambioDB); // devuelve si está en la base de datos
})


module.exports = router;