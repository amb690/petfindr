
var request = require('request'); 
var apiOptions = { 
  server: 'http://localhost:3000',
  mapServer: 'https://geocoder.api.here.com/6.2/geocode.json?'
};

var renderSightingsPage = function(req, res, responseBody) { 
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No sightings found";
    }
  }
  res.render('index', {
    title: 'PetFindr',
    sightings: responseBody,
    message: message,
    pageHeader: {
      title: 'PetFindr',
      strapline: '¡Encuentre aquí a su mascota!'
    },
  });
};

var renderSightingForm = function(err, res, responseBody){
    res.render('add-form', 
      { title: 'Añadir avistamiento' });    
};

var renderEditSightingForm = function(err, res, responseBody){
    res.render('edit-form', 
    { title: 'Editar avistamiento',
      sighting: responseBody
    });    
};

var renderMap = function(err, res, responseBody){
    var message;
    if (!responseBody.length) {
      message = "No sightings found";
    }
    var lat = responseBody.Response.View[0].Result[0].Location.DisplayPosition.Latitude
    var lon = responseBody.Response.View[0].Result[0].Location.DisplayPosition.Longitude
    var url = 'https://image.maps.api.here.com/mia/1.6/mapview?app_id=6kIo9uNhDbHma5nBHClY&app_code=M086QGkVHEvA-hsbEbJi6Q&c=' + lat + ',' + lon + '&u=4k&h=800&w=800'
    
    res.render('map', 
    { title: 'Localización',
      location: url,
      message: responseBody,
      pageHeader: {
        title: 'PetFindr',
        strapline: '¡Encuentre aquí a su mascota!'
      }
    });
};

module.exports.sightingList = function(req, res, next) { 
  var path = '/api/sightings';
  requestOption = { 
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {}
  };

  request(requestOption, function(err,response,body){
    var i, data;

    data = body;

    renderSightingsPage(req, res, data);
  });
}


/* GET 'Add sighting' page */
module.exports.addSighting = function(req, res){
  var requestOption, path;
  path = '/api/sightings';
  requestOption = { 
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {}
  };
  request(requestOption, function(err,response,body){
    renderSightingForm(req, res, body);
  }); 
};

/* POST 'Add sighting' page */
module.exports.doAddSighting = function(req, res){
  var requestOption, path;
  var postData = {
        description : req.body.description,
        image_url : req.body.image_url,
        place: req.body.place,
        viewer_name: req.body.viewer_name,
        phone: req.body.phone,
        email: req.body.email
    };

  path = '/api/sightings';
  requestOption = {
    url : apiOptions.server + path,
    method : 'POST',
    json : postData
  };

  request(requestOption, function(err,response,body){
    if (response.statusCode === 201) {
        res.redirect('http://localhost:3000');
    }
  });
}

/* GET 'Edit sighting' page */
module.exports.editSighting = function(req, res){
  var requestOption, path;
  path = '/api/sightings/' + req.params.sightingid;
  requestOption = { 
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {}
  };
  request(requestOption, function(err,response,body){
    renderEditSightingForm(req, res, body);
  }); 
};

/* POST 'Edit sighting' page */
module.exports.doEditSighting = function(req, res){
  var requestOption, path, postData;
  path = '/api/sightings/' + req.params.sightingid;
  postData = {
        description : req.body.description,
        image_url : req.body.image_url,
        place: req.body.place,
        viewer_name: req.body.viewer_name,
        phone: req.body.phone,
        email: req.body.email
    };
  console.log(req.body);
  requestOption = {
    url : apiOptions.server + path,
    method : 'PUT',
    json : postData
  };

  request(requestOption, function(err,response,body){
    res.redirect('http://localhost:3000');
  });
}

module.exports.sightingDelete = function(req, res, next) { 
  var path = '/api/sightings/' + req.params.sightingid;
  requestOption = { 
    url: apiOptions.server + path,
    method: 'DELETE',
    json: {},
    qs: {}
  };

  request(requestOption, function(err,response,body){
    var i, data;
    data = body;
  });

  res.redirect('http://localhost:3000');
}

module.exports.findSighting = function(req, res, next) { 
  var path = '/api/sightings/description/' + req.body.description;
  var methd = 'POST';
  if (req.body.description == '') {
    path = '/api/sightings';
    methd = 'GET';
  }
  requestOption = { 
    url: apiOptions.server + path,
    method: this.methd,
    json: {},
    qs: {}
  };

  request(requestOption, function(err,response,body){
    renderSightingsPage(req, res, body);
  });
}

/* GET 'Locate sighting' page */
module.exports.locateSighting = function(req, res){
  var requestOption, path;
  path = 'app_id=6kIo9uNhDbHma5nBHClY&app_code=M086QGkVHEvA-hsbEbJi6Q&searchtext=' + req.params.sightingplace;
  requestOption = { 
    url: apiOptions.mapServer + path,
    method: 'GET',
    json: {},
    qs: {}
  };
  request(requestOption, function(err,response,body){
    renderMap(req, res, body);
  }); 
};
