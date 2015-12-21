<playlist>
    <ul>
        <li each={opts.items}>
            {filename}
        </li>
    </ul>
    <script>
     this.on('update', () => console.log(opts.items));
    </script>
</playlist>
