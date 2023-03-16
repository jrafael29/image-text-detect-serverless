const AWS = require('aws-sdk');
const Handler = require('./handler');

const Rekog = new AWS.Rekognition()

const handler = new Handler({
    RekognitionService: Rekog
});

module.exports = handler.main.bind(handler)