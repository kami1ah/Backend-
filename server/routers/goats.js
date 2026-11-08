// routers/goats.js
const { Router } = require('express');
const router = Router();
const goatsController = require('../controllers/goats')

router.get('/', goatsController.index)
router.get('/:id', goatsController.show)
router.post('/', goatsController.create)
router.patch('/:id', goatsController.update)
router.delete('/:id', goatsController.destroy)

module.exports = router;