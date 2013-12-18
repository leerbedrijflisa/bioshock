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
            var $fileList = $('#file_list');
            $fileList.empty();

            _this.files = [];

            Workspace.instance.ajax.getFiles(function (data) {
                for (var i = 0; i < data.length; i++) {
                    _this.generateFolderTree(data[i], $fileList);
                }
            });
        };
        this.generateFolderTree = function (item, $fileList, $ul) {
            var type = item.Type.toLowerCase();
            var path = item.FullPath.replace('/root', '');

            if (path == '') {
                path = '/';
            }

            if (type == "folder") {
                var $folder = $('<div />').addClass('folder').appendTo($fileList);
                $('<span />').addClass('folder_name').text(path).appendTo($folder);

                var $files = $('<ul />').appendTo($folder);
                $('<div />').addClass('clear').appendTo($folder);

                for (var i = 0; i < item.Subs.length; i++) {
                    _this.generateFolderTree(item.Subs[i], $fileList, $files);
                }
            } else {
                var $lastUl = $ul || $('<ul />').appendTo(".folder");

                var $li = $('<li />').appendTo($lastUl);
                var $a = $('<a />').appendTo($li);
                var $img = $('<img />').attr('src', '/Content/Images/item.png').appendTo($a);
                var $filename = $('<span />').text(item.Name).appendTo($a);

                _this.files.push(item);
            }
        };
        this.files = [];
    }
    OpenFileWindow.prototype.constructor = function (selector) {
        _super.prototype(selector);
    };

    OpenFileWindow.prototype.initialize = function () {
        var _this = this;
        var filter = this.$element.find('.filter');

        this.open(function () {
            _this.createFileList();
        });

        filter.submit(function () {
        });
    };
    return OpenFileWindow;
})(UIWindow);
;
//# sourceMappingURL=OpenFileWindow.js.map
