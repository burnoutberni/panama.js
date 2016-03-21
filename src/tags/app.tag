import riot from 'riot';

<app>
    <error message="Could not connect to server: {this.socket.url}." if={this.socket.readyState != 1}></error>
    <controls volume={this.volume} position={this['percent-pos']} timepos={this['time-pos']} timeremaining={this['time-remaining']}
              pause={this.pause} send={this.send}></controls>
    <inputbar send={this.send}></inputbar>
    <playlist items={playlist} send="{this.send}"></playlist>
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
     controls {
       position:fixed;
       left:0;
       bottom:0;
       width:100%;
       background: #eee;
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

     .controls {
         max-width: 60rem;
         margin: 0 auto;
         text-align: center;
         display: flex;
         flex-wrap: wrap;
     }
     .controls > * {
       margin: auto 0;
       padding: 0;
     }
     button {
       font-weight: bold;
       min-width: 2rem;
       background: 0;
       border: 0;
       line-height: 200%;
     }
     .controls span {
       min-width: 2rem;
     }
     input[name="position"] { flex: 5 5; }
     input[name="volume"] { flex: 1 1; }

     form[name="inputbar"] {
         display: flex;
         flex-wrap: wrap;
     }
     form[name="inputbar"] > * { margin-bottom: 0.5rem; }
     input[name="submit"] {
         min-width: 3rem;
         margin-left: 1rem;
     }
     input[name="add"] {
         flex-grow: 2;
     }

     playlist ul {
         margin: 1rem -4rem;
         padding: 0 2rem;
         list-style-type: none;
     }
     playlist ul li {
         padding: 0.5rem 2rem;
         background-color: white;
         border-bottom: 0.2rem solid #eee;
         word-wrap: break-word;
     }
     playlist ul li span {
         cursor: default;
     }

     .current {
       background-color: #eee;
     }
     .current::before {
       content: "▶ ";
       cursor: default;
     }

    input[type=range]::-moz-range-track {
        height: 5px;
        background: #ddd;
        border: none;
    }

    input[type=range]:focus::-moz-range-track {
        background: #ccc;
    }
    </style>
</app>
