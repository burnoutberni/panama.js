<controls>
    <input name="volume" type="range" min="0" max="100" value={opts.volume} />
    <input name="position" type="range" min="0" max="100" value={opts.position} />

    <script>
     //this.on('update', () => console.log(this));

     this.position.onchange = event =>
         opts.socket.send(JSON.stringify(['pos-percent', parseFloat(event.target.value)]));
    </script>
</controls>
