<error>
    <div class="message">
        <p>{opts.message}</p>
    </div>

    <style>
     error {
         display: flex;
         align-items: center;
         justify-content: center;
         position: fixed;
         width: 100%;
         height: 100%;
         top: 0;
         left: 0;
         background: rgba(0, 0, 0, 0.9);
     }

     error .message {
         padding: 1rem;
         border-radius: 0.5rem;
         background-color: #eee;
     }
    </style>
</error>
