import riot from 'riot';

<app>
    <p>{this['media-title']}</p>
    <controls volume={this.volume} position={this['percent-pos']} socket={this.socket}></controls>
    <script>
    this.socket = opts.socket;



    this.socket.onopen = () => {
        console.info('socket connected');
        this.socket.onmessage = event => {
            console.debug('incomming message', event.data);
            const [key, value] = JSON.parse(event.data);
            this[key] = value;
            this.update();
        }
    }

    </script>
</app>
