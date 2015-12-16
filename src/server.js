import ws from 'ws';
import MPV from './mpv';
import config from './config';

const webSocket = new ws.Server({port: config.webSocketPort});
webSocket.broadcast = function(data) {
    this.clients.forEach(client => client.send(data));
};

const mpv = new MPV();
mpv.allowedCommands = [
    'set', 'add', 'cycle', 'multiply',
    'seek', 'revert-seek',
    'loadfile', 'loadlist',
    'screenshot',
    'playlist-next', 'playlist-prev', 'playlist-clear', 'playlist-remove',
    'playlist-move', 'playlist-shuffle',
    'show-text', 'show-progress',
    'set_property', 'get_property'
];

mpv.connect(config.socketPath).then(() => {
    webSocket.on('connection', (client) => {
        client.on('message', (data) => {
            mpv.command();
            mpv.command('get_property_string', 'playlist')
                .then((v) => console.log('callback', v));
        });
    });
    mpv.command('show-text', 'foo').then(v => console.log('v', v), e => console.log('e', e));
}, (error) => {
    console.log('Could not connect to mpv: ', error);
});

mpv.onEvent = (event) => {
    console.log('ev', event);
};
