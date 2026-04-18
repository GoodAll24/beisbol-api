import { jugadorModel } from '../models/jugador.js';

export const jugadorController = {
  getAll: async (req, res) => {
    try {
      const jugadores = await jugadorModel.findAll();
      res.json(jugadores);
    } catch (error) {
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
      res.status(500).json({ error: 'Error al eliminar el jugador' });
    }
  }
};