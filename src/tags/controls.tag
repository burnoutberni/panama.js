<controls>
    <button name="playing">||</button>
    <input name="volume" type="range" min="0" max="100" value={opts.volume} />
    <input name="position" type="range" min="0" max="100" value={opts.position} />

    <script>

     const changeHandler = property => event => opts.send(property, parseFloat(event.target.value));

     this.position.onchange = changeHandler('percent-pos');
     this.volume.onchange = changeHandler('volume');
     this.playing.onclick = event => opts.send('pause', !opts.pause);

     this.on('update', () => {
         if (opts.pause) { this.playing.innerHTML = "||"; }
         else { this.playing.innerHTML = "|>"; }
     });

    </script>
</controls>
