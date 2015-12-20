import riot from 'riot';
import config from './config';
import app from '../dist/tags';


let socket = new WebSocket('ws://localhost:' + config.webSocketPort);
riot.mount('app', {title: 'test', socket: socket});
