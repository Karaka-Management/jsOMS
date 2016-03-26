(function (uriFactory, undefined) {
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Response');
    
    jsOMS.Message.Response.Response = function (data) {
        this.responses = data;
    };

    jsOMS.Message.Response.Response.prototype.get = function(id)
    {
        return this.responses[id];
    };

    jsOMS.Message.Response.Response.prototype.getByIndex = function(index)
    {
        return this.responses[Object.keys(this.responses).sort()[index]];
    };
}(window.jsOMS = window.jsOMS || {}));