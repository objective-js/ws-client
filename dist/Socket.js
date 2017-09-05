'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Socket = function () {
    function Socket(host) {
        var _this = this;

        _classCallCheck(this, Socket);

        this.ids = {};
        this.eventToMethods = {
            'open': 'onopen',
            'close': 'onclose',
            'error': 'onerror'
        };
        this.host = host;
        this.socket = new WebSocket('ws://' + this.host);

        this.socket.onmessage = function (msg) {
            _this.onMessage(msg);
        };
    }

    _createClass(Socket, [{
        key: 'emit',
        value: function emit(event, params) {
            this.socket.send(JSON.stringify({
                event: event,
                params: params
            }));
            console.log('emit ' + event);
        }
    }, {
        key: 'on',
        value: function on(event, listener) {
            if ('function' === typeof listener) {
                if ('undefined' !== typeof this.eventToMethods[event]) {
                    this[this.eventToMethods[event]](listener);
                } else {
                    this.ids[event] = this.ids[event] || [];
                    this.ids[event].push(listener);
                }
            } else {
                throw new Error('The listener you want to register has to be a valid JavaScript function. ' + (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) + ' given');
            }
        }
    }, {
        key: 'onopen',
        value: function onopen(callback) {
            this.socket.onopen = callback;
        }
    }, {
        key: 'onclose',
        value: function onclose(callback) {
            this.socket.onclose = callback;
        }
    }, {
        key: 'onerror',
        value: function onerror(callback) {
            this.socket.onerror = callback;
        }
    }, {
        key: 'onMessage',
        value: function onMessage(message) {
            var data = JSON.parse(message.data);

            if ('undefined' !== typeof data.event && 'undefined' !== typeof this.ids[data.event]) {
                for (var k in this.ids[data.event]) {
                    if (this.ids[data.event].hasOwnProperty(k)) {
                        this.ids[data.event][k](data.message);
                    }
                }
            }
        }
    }]);

    return Socket;
}();