(function (jsOMS, undefined) {
    jsOMS.ChartLegend = function () {
        this.position = {x: 0, y: 0};
        this.relative = true;
        this.horizontal = false;
        this.visible = true;
        this.labels = []; // {title, color, marker}
    };

    jsOMS.ChartLegend.prototype.addLabel = function(label) {
        this.labels.push(label);
    };

    jsOMS.ChartLegend.prototype.setVisibility = function(visibility) {
        this.visible = visibility;
    };

    jsOMS.ChartLegend.prototype.getVisibility = function() {
        return this.visible;
    };

    jsOMS.ChartLegend.prototype.setPosition = function(position) {
        this.position = position;
    };

    jsOMS.ChartLegend.prototype.getPosition = function() {
        return this.position;
    };

    jsOMS.ChartLegend.prototype.setRelative = function(relative) {
        this.relative = relative;
    };

    jsOMS.ChartLegend.prototype.isRelative = function() {
        return this.relative;
    };

    jsOMS.ChartLegend.prototype.setHorizontal = function(horizontal) {
        this.horizontal = horizontal;
    };

    jsOMS.ChartLegend.prototype.isHorizontal = function() {
        return this.horizontal;
    };


}(window.jsOMS = window.jsOMS || {}));
