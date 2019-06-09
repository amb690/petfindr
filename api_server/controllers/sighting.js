var mongoose = require('mongoose');
var Sight = mongoose.model('Sighting');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET list of sightings */
module.exports.sightingsReadAll = function(req, res){
 Sight
  .find({})
  .exec(function(err, sightings){
    if (!sightings) {
     sendJSONresponse(res, 404, {"message" : "sightings not found"});
    } else if (err) { 
      sendJSONresponse(res, 404, err);  
    } else { 
      sendJSONresponse(res, 200, sightings);
    }
  });
};

/* GET list of sightings */
module.exports.sightingsFindByDescription= function(req, res){
 Sight
  .find({description: new RegExp(req.params.description, 'i')})
  .exec(function(err, sightings){
    if (!sightings) {
     sendJSONresponse(res, 404, {"message" : "sightings not found"});
    } else if (err) { 
      sendJSONresponse(res, 404, err);  
    } else { 
      sendJSONresponse(res, 200, sightings);
    }
  });
};


/* GET a sightning by the id */
module.exports.sightingsReadOne = function(req, res) {
  console.log('Finding sighting details', req.params);
  if (req.params && req.params.sightingid) {
    Sight
      .findById(req.params.sightingid)
      .exec(function(err, sighting) {
        if (!sighting) {
          sendJSONresponse(res, 404, {
            "message": "sightingid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(sighting);
        sendJSONresponse(res, 200, sighting);
      });
  } else {
    console.log('No sightingid specified');
    sendJSONresponse(res, 404, {
      "message": "No sightingid in request"
    });
  }
};

/* POST a new sighting */
/* /api/sightings */
module.exports.sightingsCreate = function(req, res) {
  console.log(req.body);
  Sight.create({
    description: req.body.description,
    image_url: req.body.image_url,
    place: req.body.place,
    viewer_name: req.body.viewer_name,
    phone: req.body.phone,
    email: req.body.email
  }, function(err, sighting) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(sighting);
      sendJSONresponse(res, 201, sighting);
    }
  });
};

/* PUT /api/sightings/:sightingid */
module.exports.sightingsUpdateOne = function(req, res) {
  if (!req.params.sightingid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, sightingid is required"
    });
    return;
  }
  Sight
    .findById(req.params.sightingid)
    .exec(
      function(err, sighting) {
        if (!sighting) {
          sendJSONresponse(res, 404, {
            "message": "sightingid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        sighting.description = req.body.description;
        sighting.image_url = req.body.image_url;
        sighting.place = req.body.place;
        sighting.viewer_name = req.body.viewer_name;
        sighting.phone = req.body.phone;
        sighting.email = req.body.email;
        sighting.save(function(err, sighting) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, sighting);
          }
        });
      }
  );
};

/* DELETE /api/sightings/:sightingid */
module.exports.sightingsDeleteOne = function(req, res) {
  var sightingid = req.params.sightingid;
  if (sightingid) {
    Sight
      .findByIdAndRemove(sightingid)
      .exec(
        function(err, sighting) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          console.log("Sighting id " + sightingid + " deleted");
          sendJSONresponse(res, 204, null);
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "No sightingid"
    });
  }
};