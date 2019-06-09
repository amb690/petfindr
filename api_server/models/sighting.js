var mongoose = require('mongoose');

var sightingSchema = mongoose.Schema({ 
    description: {
        type: String,
        required: true
    },
    image_url: {
        type: String
    },
    place: {
        type: String,
        required: true
    },
    viewer_name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

mongoose.model('Sighting', sightingSchema);