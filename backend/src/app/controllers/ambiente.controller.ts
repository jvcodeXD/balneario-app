import { Request, Response } from 'express'
import { AmbienteService } from '../services'
import { TipoAmbiente } from '../dtos'

const service = new AmbienteService()

export const AmbienteController = {
  create: async (req: Request, res: Response) => {
    try {
      const ambiente = await service.create(req.body)
      res.status(201).json(ambiente)
    } catch (error: any) {
      const msg = error.message.includes('ya existe') ? error.message : 'Error al crear ambiente'
      res.status(400).json({ error: error.message })
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const filtros: any = {}
      if (req.query.tipo) filtros.tipo = req.query.tipo
      if (req.query.estado) filtros.estado = req.query.estado
      if (req.query.nombre) filtros.nombre = req.query.nombre

      const ambientes = await service.getAll(filtros)
      res.json(ambientes)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const ambiente = await service.getById(req.params.id)
      if (!ambiente) {
        res.status(404).json({ error: 'Ambiente no encontrado' })
        return
      }
      res.json(ambiente)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await service.update(req.params.id, req.body)
      if (!updated) {
        res.status(404).json({ error: 'Ambiente no encontrado' })
        return
      }
      res.json(updated)
    } catch (error: any) {
      const msg = error.message.includes('ya existe') ? error.message : 'Error al crear ambiente'
      res.status(400).json({ error: error.message })
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      const result = await service.delete(req.params.id)
      if (!result) {
        res.status(404).json({ error: 'Ambiente no encontrado' })
        return
      }
      res.json({ message: 'Ambiente eliminado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
