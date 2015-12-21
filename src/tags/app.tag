import riot from 'riot';

<app>
    <controls volume={this.volume} position={this['percent-pos']}
              pause={this.pause} send={this.send}></controls>
    <playlist items={playlist}></playlist>
    <p>
        powered by <a href="https://git.phaer.org/panama">panama</a>, patches welcome.
    </p>
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
    <style>
     body {
         background-color: #121212;
     }
     app {
         display: block;
         max-width: 30rem;
         margin: 0 auto;
         padding: 2rem;
         background-color: #eee;
         border-radius: 0.5rem;

         font-family: monospace;
     }

     form[name="controls"] {
         display: flex;
         flex-wrap: wrap;
     }
     form[name="controls"] > * { margin-bottom: 0.5rem; }
     button[name="playing"] {
         width: 10%
     }
     input[name="add"] {
         width: 75%;
         flex-grow: 2;
     }
     input[name="submit"] {
         width: 10%;
     }
     .volume, .position {
         width: 100%;
         display: flex;

     }
     .volume label, .position label {
         width: 15%;
         line-height: 200%;
     }
     .volume input, .position input {
         width: 84%;
     }

     playlist ul {
         margin: 1rem -4rem;
         padding: 0 2rem;
         list-style-type: none;
     }
     playlist ul li {
         padding: 1rem 2rem;
         background-color: white;
         border-bottom: 0.2rem solid #eee;
         word-wrap: break-word;
     }
    </style>
</app>
