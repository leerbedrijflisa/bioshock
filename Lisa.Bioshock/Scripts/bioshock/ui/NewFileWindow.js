var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="UIWindow.ts" />
var NewFileWindow = (function (_super) {
    __extends(NewFileWindow, _super);
    function NewFileWindow(selector) {
        var _this = this;
        _super.call(this, selector);
        this.cleanup = function () {
            _this.$element.find('#newFileName').val('');
        };
        this.setUp = function () {
            var $filename = _this.$element.find('#newFileName');
            console.log($filename);

            setTimeout(function () {
                $filename.focus();
            }, 500);
        };
        this.createFile = function () {
            var fileName = _this.$element.find('#newFileName').val();

            if (fileName.endsWith('.css') || fileName.endsWith('.html')) {
                Workspace.instance.ajax.createFile({ filename: fileName }, function (data) {
                    if (data.result) {
                        /* TODO: Update the editor */
                        $('#filename').text(fileName);
                        _this.close();
                    }
                });
            } else {
                alert('Kan geen bestand aanmaken zonder extensie!');
            }
        };
    }
    NewFileWindow.prototype.initialize = function () {
        var _this = this;
        var $form = this.$element.find('#createFile');
        var $addButton = this.$element.find('#addButton');

        this.open(function () {
            _this.setUp();
        }).close(function () {
            _this.cleanup();
        });

        $form.submit(function () {
            _this.createFile();
            return false;
        });

        $addButton.click(function () {
            _this.createFile();
            return false;
        });

        return _super.prototype.initialize.call(this);
    };
    return NewFileWindow;
})(UIWindow);
;
//# sourceMappingURL=NewFileWindow.js.map
