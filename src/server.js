import ws from 'ws';
import MPV from './mpv';
import Playlist from './playlist';
import config from './config';

const webSocket = new ws.Server({port: config.webSocketPort});
webSocket.broadcast = function(data) {
    this.clients.forEach(client => client.send(JSON.stringify(data)));
};

const mpv = new MPV();
const playlist = new Playlist(mpv);
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

function throttle(fn, delay) {
    let lastTime = new Date();
    return (...args) => {
        const now = new Date();
        if (now - lastTime > delay) {
            console.log('now');
            fn.apply(this, args);
            lastTime = now;
        }
    };
}
 

function setupClient(client) {
    client.sendJSON = data => client.send(JSON.stringify(data));
    const get_property = (property, filter) => {
        mpv.command('get_property', property).then(
            value => {
                if (typeof filter !== 'undefined') {
                    value = filter(value);
                }
                client.sendJSON([property, value]);
            },
            error => client.sendJSON(['error', error])
        );
    };
    get_property('volume');
    get_property('percent-pos');
    get_property('pause');
    get_property('playlist', v => playlist.update(v)); // todo:: call playlist.list here.
}

function handleMpvEvent(event) {
}

const handleClientEvent = client => data => {
    const [key, value] = JSON.parse(data);

    switch (key) {
    case 'loadfile':
        playlist.add(value);
        break;
    default:
        mpv.command('show-text', key + ' ' + value);
        mpv.command('set_property', key, value)
            .then(() => console.log('updated ' + key, value),
                  error => console.log('could not update ' + key, error));
    }
};

mpv.connect(config.socketPath).then(() => {
    mpv.onEvent = handleMpvEvent;

    const broadcastPayload = p => {
        webSocket.broadcast([p.name, p.data]);
    };
    mpv.observe('playlist', p => webSocket.broadcast(
        ['playlist', playlist.update(p.data)]));

    mpv.observe('percent-pos', throttle(p => {
            webSocket.broadcast(['percent-pos', p.data]);
    }, 1000));

    mpv.observe('volume', broadcastPayload);
    mpv.observe('pause', broadcastPayload);

    webSocket.on('connection', (client) => {
        setupClient(client);
        client.on('message', handleClientEvent(client));
    });
}, (error) => {
    console.log('Could not connect to mpv: ', error);
});
