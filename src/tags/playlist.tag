<playlist>
    <ul>
        <li each={opts.items}  class="{current ? 'current' : ''}">
            <span onclick={parent.removeItem}>×</span>
            <span class="title" onclick={parent.playItem}>{filename.indexOf('panama_title') !== -1 ? decodeURIComponent(filename.split('panama_title=')[1].split('&')[0]) : filename}</span>
            <a if={requestUrl} href="{requestUrl}">source</a>
        </li>
    </ul>
    <script>
     this.on('mount', () => console.log(opts.items));

     this.playItem = event => {
         opts.send('playlist-pos', opts.items.indexOf(event.item));
     }
     this.removeItem = event => {
         opts.send('playlist-remove', opts.items.indexOf(event.item));
     }
    </script>
</playlist>
