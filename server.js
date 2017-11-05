
let http = require('http');
let path = require('path');
let async = require('async');
let socketio = require('socket.io');
let express = require('express');

let router = express();
let server = http.createServer(router);
let io = socketio.listen(server);

router.use(express.static(__dirname + '/client'));
router.set('views', path.join(__dirname, 'client/views'));

router.set('view engine','jade');
//router.configure('development', function( ) { router.locals.pretty = true; });
router.get('/', function( req, res ){
  res.render( 'index' );
});

let socketArr = [];
let userTextArr = [];
let numUser = 0;

io.on('connection', function(socket){
  numUser++;
    userTextArr.forEach(function(data){
      socket.emit('message', data);
    });

    socketArr.push(socket);

    socket.on('message', function(textInput){
      let userText = String(textInput || '');

      if (!userText)
        return;

      socket.get('name', function(err, userName){
        let data = { name: userName,
                     text: userText
        };
        allClients('message', data);
        userTextArr.push(data);
      });
    });

    socket.on('identify', function(name){
      socket.set('name', String(name || 'Anonymous'), function(err){
        updateUserList();
      });
    });


    socket.on('disconnect', function(){
      numUser--;
      socketArr.splice(socketArr.indexOf(socket), 1);
      updateUserList();
    });

  });

function allClients( event, eventData){
  socketArr.forEach( function (socket){
    socket.emit(event, eventData);
  });
}

function updateUserList(){
  async.map( socketArr,
            function( socket, callback){
              socket.get( 'name', callback);
            },
            function( err, names){
              allClients( 'userList', names);
            }
  );
  allClients( 'numUser', numUser );
}

server.listen(process.env.PORT || 5000, process.env.IP || '0.0.0.0', function(){
  let addr = server.address();
  console.log("server listening:", addr.address + ":" + addr.port);
});
