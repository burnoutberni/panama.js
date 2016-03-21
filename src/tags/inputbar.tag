<inputbar>
   <form name="inputbar">
     <input name="add">
     <input name="submit" type="submit" value="add">
   </form>
   <script>

     this.inputbar.onsubmit = event => {
         opts.send('loadfile', this.add.value);
         event.preventDefault();
     }
   </script>
</inputbar>
