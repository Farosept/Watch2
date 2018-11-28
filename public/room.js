var pause = ()=>{
	var iframe = $('iframe')[0].contentWindow;
	//iframe.postMessage({ method: 'pause' }, '*');
	socket.emit("control",escape("pause"));
}
var play = ()=>{
	var iframe = $('iframe')[0].contentWindow;
	//iframe.postMessage({ method: 'play' }, '*');
	socket.emit("control",escape("play"));
}
var rew = (time)=>{
	var iframe = $('iframe')[0].contentWindow;
	iframe.postMessage({ method: 'pause' }, '*');
	if(stop == false){
	socket.emit("control",{'event':"timeUpdate",'time':time});}
	stop = false;
}
var init = ()=>{
	var iframe = $('iframe')[0].contentWindow;
	socket.emit("control",escape("init"));
}
// Создаем текст сообщений для событий
strings = {
	'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
	'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
	'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
	'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
	'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
};
window.onload = function() {
	// Создаем соединение с сервером; websockets почему-то в Хроме не работают, используем xhr

	socket = io.connect('http://2f931334.ngrok.io');

	socket.on('connect', function () {
		socket.on('control',(msg)=>{
			console.log(msg)
			var iframe = $('iframe')[0].contentWindow;

			if(msg == "play") iframe.postMessage({ method: 'play' }, '*');
			if(msg== "pause") iframe.postMessage({ method: 'pause' }, '*');
			if(msg['event']=="timeUpdate"){
				stop = true;
				iframe.postMessage({ method: 'seek', time: msg['time'] }, '*');
			}
			if(msg=="init"){
				iframe.postMessage({ method: 'play' }, '*');

			}
		})
		socket.on('message', function (msg) {
			// Добавляем в лог сообщение, заменив время, имя и текст на полученные
			document.querySelector('#log').innerHTML += strings[msg.event].replace(/\[([a-z]+)\]/g, '<span class="$1">').replace(/\[\/[a-z]+\]/g, '</span>').replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name).replace(/\%text\%/, unescape(msg.text).replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
			// Прокручиваем лог в конец
			document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
		});
		// При нажатии <Enter> или кнопки отправляем текст
		document.querySelector('#input').onkeypress = function(e) {
			if (e.which == '13') {
				// Отправляем содержимое input'а, закодированное в escape-последовательность
				socket.send(escape(document.querySelector('#input').value));
				// Очищаем input
				document.querySelector('#input').value = '';
			}
		};
		document.querySelector('#send').onclick = function() {
			socket.send(escape(document.querySelector('#input').value));
			document.querySelector('#input').value = '';
		};		
	});
};