(function (jsOMS, undefined) {
    jsOMS.Client = function () {
        this.port = 80;
        this.ip = '127.0.0.1';
        this.protocol = '';
        this.connection = null;
        this.messages = [];
    };

    jsOMS.Client.prototype.setMessage = function(id, callback) {
        this.messages[id] = callback;
    };

    jsOMS.Client.prototype.setIp = function(ip) {
        this.ip = ip;
    };

    jsOMS.Client.prototype.setPort = function(port) {
        this.port = port;
    };

    jsOMS.Client.prototype.setProtocol = function(protocol) {
        this.protocol = protocol;
    };

    jsOMS.Client.prototype.connect = function() {
        var self = this;
        this.connection = new WebSocket(this.ip, this.protocol);

        this.connection.onmessage = function(event) {
            var msg = JSON.parse(event.data);

            self.messages[msg.type](msg);
        }
    };

    jsOMS.Client.prototype.send = function(msg) {
        this.connection.send(JSON.stringify(msg));
    };

    jsOMS.Client.prototype.close = function() {
        this.connection.close();
    }
}(window.jsOMS = window.jsOMS || {}));
