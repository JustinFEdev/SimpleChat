var socket = io();

// 접속 되었을 때 실행
socket.on('connect', function () {
  // var input = document.getElementById('test');
  // input.value = '접속 성공';
  var name = prompt('반갑습니다', '');
  // 빈칸인경우
  if (!name) {
    name = '익명';
  }
  socket.emit('newUser', name);
});
socket.on('update', function (data) {
  console.log(`${data.name}: ${data.message}`);
});
// 전송 함수
function send() {
  var message = document.getElementById('test').value;
  document.getElementById('test').value = '';
  socket.emit('message', { type: 'message', message: message });
}
