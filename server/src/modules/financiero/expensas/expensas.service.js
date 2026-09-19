const prisma = require('../../../config/prisma')

async function generar({ inmuebleId, periodo, fechaVencimiento }) {
  const inmueble = await prisma.inmueble.findUnique({
    where: { id: inmuebleId },
    include: { tipoInmueble: true }
  })

  if (!inmueble) {
    throw Object.assign(new Error('Inmueble no encontrado'), { status: 404 })
  }

  if (!inmueble.activo) {
    throw Object.assign(new Error('El inmueble esta inactivo, no se puede generar expensa'), {
      status: 409
    })
  }

  try {
    return await prisma.expensa.create({
      data: {
        inmuebleId,
        periodo,
        montoTotal: inmueble.tipoInmueble.montoBase,
        fechaVencimiento: new Date(fechaVencimiento)
      },
      include: { inmueble: { include: { tipoInmueble: true } } }
    })
  } catch (err) {
    if (err.code === 'P2002') {
      throw Object.assign(
        new Error(
          `Ya existe una expensa para el inmueble ${inmueble.codigo} en el periodo ${periodo}`
        ),
        { status: 409 }
      )
    }
    throw err
  }
}

async function listar() {
  return prisma.expensa.findMany({
    include: {
      inmueble: { include: { tipoInmueble: true } },
      pagos: true
    },
    orderBy: { fechaVencimiento: 'desc' }
  })
}

module.exports = { generar, listar }
