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
         if (opts.pause) { this.playing.innerHTML = "|>"; }
         else { this.playing.innerHTML = "||"; }
         this.timepos.innerHTML = parseInt(opts.timepos / 60) + (parseInt(opts.timepos) % 60 < 10 ? ":0" : ":" ) + parseInt(opts.timepos) % 60;
         this.timeremaining.innerHTML = "-" + parseInt(opts.timeremaining / 60) + (parseInt(opts.timeremaining) % 60 < 10 ? ":0" : ":" ) + parseInt(opts.timeremaining) % 60;
     });

   </script>
</controls>
