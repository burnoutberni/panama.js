import riot from 'riot';

<app>
    <controls volume={this.volume} position={this['percent-pos']}
              pause={this.pause} send={this.send}></controls>
    <add send={this.send}></add>
    <playlist items={playlist}></playlist>
    <script>
    this.socket = opts.socket;
    this.send = (...args) => this.socket.send(JSON.stringify(args));

    this.socket.onopen = () => {
        console.info('socket connected');
        this.socket.onmessage = event => {
            //console.debug('incomming message', event.data);
            const [key, value] = JSON.parse(event.data);
            this[key] = value;
            this.update();
        }
    }

    </script>
</app>
