<controls>
   <div class="controls">
       <button name="playlistprev">&lt;&lt;</button>
       <button name="playing">|></button>
       <button name="playlistnext">&gt;&gt;</button>
       <span name="timepos"></span>
       <input name="position" type="range" min="0" max="100" value={opts.position} />
       <span name="timeremaining"></span>
       <span>vol</span>
       <input name="volume" type="range" min="0" max="100" value={opts.volume} />
   </div>
   <script>

     /*this.controls.onsubmit = event => {
         opts.send('loadfile', this.add.value);
         event.preventDefault();
     }*/

     const changeHandler = property => event => opts.send(property, parseFloat(event.target.value));
     this.position.onchange = this.position.oninput = changeHandler('percent-pos');
     this.volume.onchange = this.volume.oninput = changeHandler('volume');
     this.playing.onclick = event => {
       opts.send('pause', !opts.pause);
       event.preventDefault();
     }
     this.playlistprev.onclick = event => opts.send('playlist-prev');
     this.playlistnext.onclick = event => opts.send('playlist-next');

     this.on('update', () => {
         if (opts.pause) { this.playing.innerHTML = "▶"; }
         else { this.playing.innerHTML = "||"; }
         const duration = Math.floor(opts.duration) * 1000
         const position = Math.floor(opts.duration * opts.position / 100) * 1000

         if (duration && position) {
           this.timepos.innerHTML = new Date(position).toISOString().substr(11, 8);
           this.timeremaining.innerHTML = '-' + new Date(duration - position).toISOString().substr(11, 8);
         }
     });

   </script>
</controls>
