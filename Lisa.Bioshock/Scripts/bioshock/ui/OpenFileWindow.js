var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../Workspace.ts" />
/// <reference path="UIWindow.ts" />
var OpenFileWindow = (function (_super) {
    __extends(OpenFileWindow, _super);
    function OpenFileWindow() {
        _super.apply(this, arguments);
        var _this = this;
        this.createFileList = function () {
            var $fileList = $('#file-list');
            $fileList.empty();

            _this.files = [];

            Workspace.instance.ajax.getFiles(function (data) {
                for (var i = 0; i < data.length; i++) {
                    _this.generateFolderTree(data[i], $fileList);
                }
            });
        };
        this.generateFolderTree = function (item, $fileList) {
            var type = item.Type.toLowerCase();
            var path = item.FullPath.replace('/root', '');
            var $folder = $('<div />').addClass('folder').appendTo($fileList);
            $('<span />').addClass('folder-name').text(path).appendTo($folder);

            var $files = $('<ul />').appendTo($folder);
            $('<div />').addClass('clear').appendTo($files);

            if (type == "file") {
                var $li = $('<li />').appendTo($files);
                var $a = $('<a />').appendTo($li);
                var $img = $('<img />').attr('src', '/Content/Images/item.png').appendTo($a);
                var $fileName = $('<span />').text(item.Name).appendTo($a);

                _this.files.push(item);
            } else if (type == "folder") {
                for (var i = 0; i < item.Subs.length; i++) {
                    _this.generateFolderTree(item.Subs[i], $fileList);
                }
            }
        };
        this.files = [];
    }
    OpenFileWindow.prototype.constructor = function (selector) {
        _super.prototype(selector);
    };

    OpenFileWindow.prototype.initialize = function () {
        var filter = this.$element.find('.filter');
        filter.submit(function () {
        });
    };
    return OpenFileWindow;
})(UIWindow);
;
//# sourceMappingURL=OpenFileWindow.js.map
