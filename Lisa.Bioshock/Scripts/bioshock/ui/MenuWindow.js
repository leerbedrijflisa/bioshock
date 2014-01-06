var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MenuWindow = (function (_super) {
    __extends(MenuWindow, _super);
    function MenuWindow(selector) {
        _super.call(this, selector);
    }
    MenuWindow.prototype.initialize = function () {
        this.open(function () {
        }).close(function () {
        });

        return _super.prototype.initialize.call(this);
    };
    return MenuWindow;
})(UIWindow);
//# sourceMappingURL=MenuWindow.js.map
