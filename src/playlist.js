import {spawn} from 'child_process';

function youTubeDl(uri) {
    return new Promise((resolve, reject) => {
        let proc = spawn('youtube-dl', ['-f', 'best', '-e', '-g', uri]),
            stdout = [],
            stderr = [];
        proc.stdout.on('data', data => stdout.push(...data.toString('utf-8').split('\n')));
        proc.stderr.on('data', data => stderr.push(...data.toString('utf-8').split('\n')));
        proc.on('close', code => {
            const title = stdout[0].trim();
            let url = stdout[1].trim();
            if (title === '' || url === '') {
                reject('returned nothing.');
            } else if (title !== '') {
                if (url.indexOf('?') !== -1) {
                  const parts = url.split('?');
                  url = parts[0] + `?panama_title=${encodeURIComponent(title)}&` + parts[1];
                } else {
                  url += `?panama_title=${encodeURIComponent(title)}`;
                }
            }

            if (!code) resolve([title, url, stderr]);
            else reject(`[youtube-dl] error: ${stderr}`);
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
                    const [title, url, errors] = result;
                    if (errors.length) {
                        this.mpv.command('show-text', '[youtube-dl]: ' + errors.join('\n'));
                    }

                    this.mpv.command('show-text', `added ${title} (${url}) to playlist.`);

                    //this.items[requestUrl] = {title};
                    //this.save();

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
