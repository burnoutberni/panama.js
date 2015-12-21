<add>
    <form name="form">
        <input name="add">
        <input name="submit" type="submit" value="add">
    </form>
    <script>
     this.form.onsubmit = event => {
         console.log(this.add.value);
         opts.send('loadfile', this.add.value);
         event.preventDefault();
     }
    </script>
</add>
