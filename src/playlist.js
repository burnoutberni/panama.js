import {spawn} from 'child_process';

function youTubeDl(uri) {
    return new Promise((resolve, reject) => {
        let proc = spawn('youtube-dl', ['-f', 'best', '-e', '-g', uri]),
            stdout = [],
            stderr = [];
        proc.stdout.on('data', data => stdout.push(...data.toString('utf-8').split('\n')));
        proc.stderr.on('data', data => stderr.push(...data.toString('utf-8').split('\n')));
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
        return new Promise((resolve, reject) => {
            youTubeDl(requestUrl).then(
                result => {
                    const [stdout, stderr] = result,
                          title = stdout[0].trim(),
                          url = stdout[1].trim();

                    console.log('[youtube-dl] out: ', stdout);
                    console.log('[youtube-dl] err: ', stderr);

                    if (stderr.length) {
                        this.mpv.command('show-text', stderr.join('\n'));
                    }

                    if (title === '' || url === '') {
                        reject('[youtube-dl] returned nothing.');
                        return;
                    }

                    this.mpv.command('show-text', `added ${title} (${url}) to playlist.`);

                    this.items[requestUrl] = {title};
                    this.save();

                    console.info('[youtube-dl] loadfile: ', url);
                    this.mpv.command('loadfile', url, 'append-play', `title="${title}"`)
                        .then(v => resolve(v),
                              e => reject(e));
                },
                error => reject(`[youtube-dl] error: ${error}`)
            );
        });
    }

    }
}
