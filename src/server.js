import ws from 'ws';
import MPV from './mpv';
import config from './config';

const webSocket = new ws.Server({port: config.webSocketPort});
webSocket.broadcast = function(data) {
    this.clients.forEach(client => client.send(JSON.stringify(data)));
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
    'set_property', 'get_property', 'observe_property'
];

function pollProperty(property) {
    mpv.command('get_property', property)
        .then(value => {
            webSocket.broadcast([property, value]);
            setTimeout(pollProperty, 500, property);
        });
}

function setupClient(client) {
    client.sendJSON = data => client.send(JSON.stringify(data));
    const get_property = property => {
        mpv.command('get_property', property).then(
            value => client.sendJSON([property, value]),
            error => client.sendJSON(['error', error])
        );
    };
    get_property('volume');
    get_property('percent-pos');
    get_property('media-title');
}

mpv.connect(config.socketPath).then(() => {
    pollProperty('percent-pos');
    mpv.command('loadfile', 'https://www.youtube.com/watch?v=-UJX0QpkhhU', 'append', 'force-media-title="foo"')
        .then(v => console.log('v', v), e => console.log('e', e));
    webSocket.on('connection', (client) => {
        setupClient(client);
        client.on('message', (data) => {
            const [key, value] = JSON.parse(data);
            mpv.command('set_property', 'percent-pos', value)
                .then(v => console.log('v', v), e => console.log('e', e));

        });
    });
    //mpv.command('get_property', 'media-title').then(v => console.log('v', v), e => console.log('e', e));
}, (error) => {
    console.log('Could not connect to mpv: ', error);
});

mpv.onEvent = (event) => {
    console.log(event);
};
