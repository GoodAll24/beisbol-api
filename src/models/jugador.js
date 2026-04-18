import prisma from '../config/db.js';

export const jugadorModel = {
  findAll: async () => {
    return await prisma.jugador.findMany({
      orderBy: { id: 'asc' }
    });
  },

  findById: async (id) => {
    return await prisma.jugador.findUnique({
      where: { id: parseInt(id) }
    });
  },

  create: async (data) => {
    return await prisma.jugador.create({
      data: {
        nombre: data.nombre,
        avg: parseFloat(data.avg),
        hr: parseInt(data.hr),
        rbi: parseInt(data.rbi),
        activo: data.activo === 'true' || data.activo === true
      }
    });
  },

  update: async (id, data) => {
    return await prisma.jugador.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.nombre && { nombre: data.nombre }),
        ...(data.avg !== undefined && { avg: parseFloat(data.avg) }),
        ...(data.hr !== undefined && { hr: parseInt(data.hr) }),
        ...(data.rbi !== undefined && { rbi: parseInt(data.rbi) }),
        ...(data.activo !== undefined && { activo: data.activo === 'true' || data.activo === true })
      }
    });
  },

  delete: async (id) => {
    return await prisma.jugador.delete({
      where: { id: parseInt(id) }
    });
  }
};