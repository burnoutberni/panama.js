import net from 'net';
import Q from 'q';

export default class MPV {
    constructor() {
        this.requestId = 0;
        this.deferredRequests = {};
        this.propertyObserverId = 0;
        this.propertyObservers = {};
    }

    connect(socketPath) {
        return new Promise((resolve, reject) => {
            this.socket = net.connect({path: socketPath});
            this.socket.on('error', reject);
            this.socket.on('connect', resolve);
            this.socket.on('data', payloads => {
                payloads.toString('utf-8').trimRight('\n').split('\n')
                    .forEach(payload => this.handler(JSON.parse(payload)));
            });
        });
    }

    command(...args) {
       const id = this.requestId++,
              deferred = Q.defer(),
              data = JSON.stringify({
                  command: args,
                  request_id: id
              });
        if (this.allowedCommands && this.allowedCommands.indexOf(args[0]) < 0) {
            console.info('[mpv] forbidden command: ', args);
            deferred.reject('command is not in allowedCommands.');
        }
        else {
            console.info('[mpv] executing command: ', args);
            this.deferredRequests[id] = deferred;
            this.socket.write(data + '\r\n');
        }
        return deferred.promise;
    }

    observe(property, handler) {
        const id = this.propertyObserverId++;
        this.propertyObservers[property] = handler;
        this.command('observe_property', id, property);
    }

    handler(payload) {
        const id = payload.request_id;
        if (this.deferredRequests.hasOwnProperty(id)) {
            const callback = this.deferredRequests[id];
            delete this.deferredRequests[id];
            if (payload.error === 'success') {
                callback.resolve(payload.data);
            }
            else {
                callback.reject(payload.error);
            }
        }
        else if (payload.event == 'property-change' &&
                 this.propertyObservers.hasOwnProperty(payload.name)) {
            this.propertyObservers[payload.name](payload);
        }
        else if (typeof this.onEvent !== 'undefined') {
            this.onEvent(payload.event);
        }
        else {
            console.log('[mpv] unhandled event: ', payload);
        }
    }
}
