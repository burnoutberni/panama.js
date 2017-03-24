<inputbar>
   <form name="inputbar">
     <input name="add" placeholder="Enter your audio or video URL here…">
     <input name="submit" type="submit" value="add">
   </form>
   <script>

     this.inputbar.onsubmit = event => {
         opts.send('loadfile', this.add.value);
         this.add.value = '';
         event.preventDefault();
     }
   </script>
</inputbar>
