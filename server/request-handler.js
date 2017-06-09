
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var chatData = require('./storage.js');

var responseHandler = function (response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end( JSON.stringify(data) );
}

var postReqDataHandler = function (request, callback) {
  var body = '';
  request.on('data', function(chunk) {
    body += chunk;

  });

  request.on('end', function(){
    // console.log('Starting body');
    // console.log(body);
    // console.log('done body');
    callback( JSON.parse(body) );
  })
}
// var objectId = 1;.
var requests = {
  'GET': function (request, response) {
    responseHandler(response, chatData.chats);
  },
  'POST': function (request, response) {
    postReqDataHandler(request, function(chat) {
      chat.objectId = ++chatData.chats.objectId;
      chat.createdAt = new Date();
      chat.createdAt = (chat.createdAt).toJSON();
      chatData.chats.results.push(chat);
      responseHandler(response, {objectId: chat.objectId}, 201);
    });
  },
  'OPTIONS': function (request, response) {
    responseHandler(response, null);
  }
}

var requestHandler = function (request, response) {

  // console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var req = requests[request.method];

  if ( req ) {
    req(request, response);
  } else {
    responseHandler(response, 'O oh, not found here', 404);
  }

};

module.exports = {
  headers,
  requestHandler,
  responseHandler
};
