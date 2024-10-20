import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({port: 8090});

wss.on('connection',(ws) => {
    ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
})
