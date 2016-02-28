<controls>
   <form name="controls">
       <button name="playing">||</button>
       <input name="add">
       <input name="submit" type="submit" value="add">
       <div class="volume">
           <label for="volume">volume</label>
           <input name="volume" type="range" min="0" max="100" value={opts.volume} />
       </div>
       <div class="position">
           <label for="position">position</label>
           <input name="position" type="range" min="0" max="100" value={opts.position} />
       </div>
   </form>
   <script>

     this.controls.onsubmit = event => {
         opts.send('loadfile', this.add.value);
         event.preventDefault();
     }

     const changeHandler = property => event => opts.send(property, parseFloat(event.target.value));
     this.position.onchange = this.position.oninput = changeHandler('percent-pos');
     this.volume.onchange = this.volume.oninput = changeHandler('volume');
     this.playing.onclick = event => opts.send('pause', !opts.pause);

     this.on('update', () => {
         if (opts.pause) { this.playing.innerHTML = "||"; }
         else { this.playing.innerHTML = "|>"; }
     });

   </script>
</controls>
