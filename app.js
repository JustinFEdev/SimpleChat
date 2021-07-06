/* 설치한 express 모듈 불러오기 */
const express = require('express');

/* 설치한 socket.io 모듈 불러오기 */
const socket = require('socket.io');

/* Node.js 기본 내장 모듈 불러오기 */
const http = require('http');

/* Node.js 기본 내장 모듈 불러오기 */
const fs = require('fs');

/* express 객체 생성 */
const app = express();

/* express http 서버 생성 */
const server = http.createServer(app);

/* 생성된 서버를 socket.io에 바인딩 */
const io = socket(server);

app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

/* Get 방식으로 / 경로에 접속하면 실행 됨 */
app.get('/', function (request, response) {
  fs.readFile('./static/js/index.html', function (err, data) {
    if (err) {
      response.send('error');
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
    }
  });
  //   console.log('유저가 / 으로 접속하였습니다!');

  /* 클라이언트로 문자열 응답 */
  //   response.send('Hello, Express Server!!');
});

io.sockets.on('connect', function (socket) {
  // 새로운 유저 접속
  socket.on('newUser', function (name) {
    console.log(name + ' 님께서 접속 하였습니다.');
    // 소켓에 이름저장
    socket.name = name;
    // 모든 소켓에게 전송
    io.sockets.emit('update', {
      type: 'connect',
      name: 'SERVER',
      message: name + '님이 접속하였습니다.',
    });
  });

  // 전송한 메세지 수령
  socket.on('message', function (data) {
    //누가 보냈는지?
    data.name = socket.name;
    console.log(data);
    //보낸이 제외한 나머지 유저에게 메세지 전송
    socket.broadcast.emit('update', data);
  });

  //   socket.on('send', function (data) {
  //     console.log('전달 메세지:', data.msg);
  //   });

  socket.on('disconnect', function () {
    console.log(socket.name + '  님이 나가셨습니다.');
  });

  //접속 종료
  socket.broadcast.emit('update', {
    type: 'disconnect',
    name: 'SERVER',
    message: socket.name + ' 님이 나가셨습니다.',
  });
});

/* 서버를 8080 포트로 listen */
server.listen(8080, function () {
  console.log('서버 실행 중..');
});
