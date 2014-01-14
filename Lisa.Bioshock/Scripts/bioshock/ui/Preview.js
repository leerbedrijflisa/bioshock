var Preview = (function () {
    function Preview(selector) {
        this.element = $(selector)[0];
        this.document = $(this.element.contentDocument || this.element.contentWindow);
    }
    Preview.prototype.addKeyUpHandler = function (eventHandler) {
        this.document.on('keyup', eventHandler);
    };

    Preview.prototype.removeKeyUpHandler = function (eventHandler) {
        this.document.off('keyup', eventHandler);
    };
    return Preview;
})();
//# sourceMappingURL=Preview.js.map
