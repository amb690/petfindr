var express = require('express');
var router = express.Router();
var ctrlSightings = require('../controllers/sighting');

router.get('/sightings', ctrlSightings.sightingsReadAll);
router.get('/sightings/:sightingid', ctrlSightings.sightingsReadOne);
router.post('/sightings/description/:description', ctrlSightings.sightingsFindByDescription);
router.post('/sightings', ctrlSightings.sightingsCreate);
router.put('/sightings/:sightingid', ctrlSightings.sightingsUpdateOne);
router.delete('/sightings/:sightingid', ctrlSightings.sightingsDeleteOne);

module.exports = router;