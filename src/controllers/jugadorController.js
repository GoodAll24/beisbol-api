import { jugadorModel } from '../models/jugador.js';

export const jugadorController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sortBy = req.query.sortBy || 'nombre';
      const sortOrder = req.query.sortOrder || 'asc';

      const allowedSort = ['nombre', 'avg', 'hr', 'rbi', 'activo'];
      if (!allowedSort.includes(sortBy)) {
        return res.status(400).json({ error: 'Campo de ordenamiento inválido' });
      }

      const { data: jugadores, total, totalPages } = await jugadorModel.findAll({
        page,
        limit,
        sortBy,
        sortOrder
      });

      res.json({
        data: jugadores,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener los jugadores' });
    }
  },

  getById: async (req, res) => {
    try {
      const jugador = await jugadorModel.findById(req.params.id);
      if (!jugador) {
        return res.status(404).json({ error: 'Jugador no encontrado' });
      }
      res.json(jugador);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener el jugador' });
    }
  },

  create: async (req, res) => {
    try {
      const { nombre, avg, hr, rbi, activo } = req.body;
      
      if (!nombre || avg === undefined || hr === undefined || rbi === undefined) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      const nuevoJugador = await jugadorModel.create({ nombre, avg, hr, rbi, activo });
      res.status(201).json(nuevoJugador);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al crear el jugador' });
    }
  },

  update: async (req, res) => {
    try {
      const { nombre, avg, hr, rbi, activo } = req.body;

      const existente = await jugadorModel.findById(req.params.id);
      if (!existente) {
        return res.status(404).json({ error: 'Jugador no encontrado' });
      }

      const jugadorActualizado = await jugadorModel.update(req.params.id, {
        nombre, avg, hr, rbi, activo
      });
      res.json(jugadorActualizado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al actualizar el jugador' });
    }
  },

  delete: async (req, res) => {
    try {
      const jugador = await jugadorModel.findById(req.params.id);
      if (!jugador) {
        return res.status(404).json({ error: 'Jugador no encontrado' });
      }

      await jugadorModel.delete(req.params.id);
      res.json({ message: 'Jugador eliminado correctamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar el jugador' });
    }
  }
};