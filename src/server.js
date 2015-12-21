import ws from 'ws';
import {spawn} from 'child_process';
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

function youTubeDl(uri) {
    return new Promise((resolve, reject) => {
        let dl = spawn('youtube-dl', ['-e', '-g', uri]),
            stdout = [],
            stderr = [];
        dl.stdout.on('data', data => stdout.push(data.toString('utf-8')));
        dl.stderr.on('data', data => stderr.push(data.toString('utf-8')));
        dl.on('close', code => {
            if (!code) resolve([stdout, stderr]);
            else reject(stderr);
        });
    });
}

function broadcastProperty(property, interval=500) {
    // TODO: use observe_property
    mpv.command('get_property', property)
        .then(value => {
            webSocket.broadcast([property, value]);
            setTimeout(broadcastProperty, interval, property, interval);
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
    get_property('pause');
    get_property('playlist');
}

function handleMpvEvent(event) {

}

const handleClientEvent = client => data => {
    const [key, value] = JSON.parse(data);

    switch (key) {
    case 'loadfile':
        youTubeDl(value).then(
            result => {
                const [stdout, stderr] = result;
                console.log('youtube-dl stderr', stderr);
                const title = stdout[0].trim(),
                      url = stdout[1].trim();
                mpv.command('show-text', `added ${title} (${url})`);
                mpv.command('loadfile', url, 'append', `force-media-title="${title}"`)
                    .then(v => console.log('v', v), e => console.log('e', e));


            },
            stderr => mpv.command('show-text', stderr.join('\n')));
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

    broadcastProperty('percent-pos');
    broadcastProperty('volume');
    broadcastProperty('pause');
    broadcastProperty('playlist', 1000);


    webSocket.on('connection', (client) => {
        setupClient(client);
        client.on('message', handleClientEvent(client));
    });
}, (error) => {
    console.log('Could not connect to mpv: ', error);
});
