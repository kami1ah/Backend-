const Goat = require('../models/Goat');

const index = async (req, res) => {
  try {
    const goatsData = await Goat.getAll()
    res.status(200).send({ data: goatsData })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const show = async (req, res) => {
  try {
    const goatId = parseInt(req.params.id)
    const selectedGoat = await Goat.findById(goatId)
    res.status(200).send({ data: selectedGoat })
  } catch (error) {
    res.status(404).send({ error: error.message })
  }
}

const create = async (req, res) => {
  try {
    const data = req.body
    const newGoat = await Goat.create(data)
    res.status(201).send({ data: newGoat })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const update = async (req, res) => {
  try {
    const goatToUpdate = await Goat.findById(parseInt(req.params.id))
    req.body.age ||= goatToUpdate.age
    req.body.name ||= goatToUpdate.name
    const updatedGoat = await goatToUpdate.update(req.body)
    res.status(200).send({data: updatedGoat})
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const destroy = async (req, res) => {
  try {
    const { id } = req.params
    const goat = await Goat.findById(parseInt(id))
    await goat.destroy()
    res.status(204).end()
  } catch (error) {
    res.status(404).send({ error: error.message })
  }
}


module.exports = { index, show, create, update, destroy }

