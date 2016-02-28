import {spawn} from 'child_process';

function youTubeDl(uri) {
    return new Promise((resolve, reject) => {
        let proc = spawn('youtube-dl', ['-e', '-g', uri]),
            stdout = [],
            stderr = [];
        proc.stdout.on('data', data => stdout.push(data.toString('utf-8')));
        proc.stderr.on('data', data => stderr.push(data.toString('utf-8')));
        proc.on('close', code => {
            if (!code) resolve([stdout, stderr]);
            else reject(stderr);
        });
    });
}

export default class Playlist {
    constructor(mpv) {
        this.mpv = mpv;
        this.items = {};
    }

    update(items) {
        return items.map((element, index) => {
            if (this.items.hasOwnProperty(index)) {
                element = Object.assign(element, this.items[index]);
            }
            return element;
        });
 
    }

    add(requestUrl) {
        youTubeDl(requestUrl).then(
            result => {
                const [stdout, stderr] = result,
                      title = stdout[0].trim(),
                      url = stdout[1].trim();
                console.log('youtube-dl stderr', stderr);
                this.mpv.command('show-text', `added ${title} (${url})`);
                this.mpv.command('get_property', 'playlist/count').then(
                    count => {
                        this.items[count] = {title, requestUrl};
                        this.mpv.command('loadfile', url, 'append', `force-media-title="${title}"`)
                            .then(v => console.log('loadfile', title, url, v),
                                  e => console.log('loadfile', e));
                    },
                    stderr => this.mpv.command('show-text', stderr.join('\n')));
            });
    }
}
