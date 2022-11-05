import express, { Router } from 'express'
import { KnexDatabase } from '../database'
import apiCreator from './api'
import { ProcessingConfigurator } from './types'

export function router<VendorElement, VendorState, VendorAction>(db: KnexDatabase, configurator: ProcessingConfigurator<VendorElement, VendorState, VendorAction>): Router {

  const router = express.Router()
  const api = apiCreator(db)

  router.get('/',
    async (req, res) => {
      return res.send(await api.process.getAll())
    }
  )

  router.get('/:id',
    async (req, res) => {
      return res.send(await api.process.get(parseInt(req.params.id)))
    }
  )

  router.post('/',
    async (req, res) => {
      const system = configurator(req)
      const { files, config } = req.body
      const names = files.map(f => f.name)
      const process = await system.createProcess(
        `Uploading files ${names.join(', ')}`,
        files,
        { ...res.locals.server.configDefaults, ...config }
      )
      if (process.canRun()) {
        await process.run()
      }
      return res.send(await api.process.get(process.id))
    })

  router.post('/:id',
    async (req, res) => {
      const system = configurator(req)
      const { id } = req.params
      const process = await system.loadProcess(parseInt(id))
      await process.input(req.body)
      if (process.canRun()) {
        await process.run()
      }
      res.sendStatus(204)
    }
  )

  router.get('/:id/step/:number',
    async (req, res) => {
      return res.send(await api.process.getStep(parseInt(req.params.id), parseInt(req.params.number)))
    }
  )

  return router
}
