var express = require('express');
var router = express.Router();
var ctrlSightings = require('../controllers/sighting'); 

/* GET home page. */
router.get('/', ctrlSightings.sightingList); 
router.post('/', ctrlSightings.findSighting);
router.get('/delete/:sightingid', ctrlSightings.sightingDelete);
router.get('/sighting/new', ctrlSightings.addSighting);
router.post('/sighting/new', ctrlSightings.doAddSighting);
router.get('/sighting/edit/:sightingid', ctrlSightings.editSighting);
router.post('/sighting/edit/:sightingid', ctrlSightings.doEditSighting);
router.get('/sighting/locate/:sightingplace', ctrlSightings.locateSighting);

module.exports = router;