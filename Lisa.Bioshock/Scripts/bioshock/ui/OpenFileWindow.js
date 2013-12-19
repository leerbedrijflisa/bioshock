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
    function OpenFileWindow(selector) {
        var _this = this;
        _super.call(this, selector);
        this.filter = function (event) {
            var filter = $(event.target).val();
            var $highlights = _this.$element.find('#block .highlights');
            $highlights.children('ul').remove();

            if (filter.length > 0) {
                var $ul = $('<ul />').appendTo($highlights);

                for (var i = 0; i < _this.files.length; i++) {
                    var file = _this.files[i];
                    if (file.Name.search(filter) > -1 || file.FullPath.search(filter) > -1) {
                        var $li = $('<li />').appendTo($ul);
                        var $a = $('<a />').attr({
                            'href': 'javascript:void(0);',
                            'data-id': file.ID
                        }).appendTo($li);

                        var $img = $('<img />').attr({
                            'src': '/Content/Images/filter_item_logo.png',
                            'alt': file.ID
                        }).appendTo($a);

                        var $span = $('<span />').text(file.Name).appendTo($a);

                        $a.click(function (event) {
                            _this.updateEditor(event);
                        });
                    }
                }
            }
        };
        this.filterSubmit = function () {
            var $highlights = _this.$element.find('.highlights');
            var $ul = $highlights.find('ul');
            var $children = $ul.children('li');

            if ($children.length > 0) {
                var $a = $children.first().find('a');
                $a.click();
            }

            _this.$element.find('.filter_query').focus();
            return false;
        };
        this.updateEditor = function (event) {
            var id = $(event.currentTarget).attr('data-id');

            Workspace.instance.ajax.getFileContents(id, function (data) {
                /* TODO: Implement editor content update */
                console.log(data);
            });
        };
        this.generateFolderTree = function (item, $fileList, $ul) {
            console.log(item);
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
        this.cleanup = function () {
            _this.$element.find('.filter_query').val('');

            var $highlights = _this.$element.find('#block .highlights');
            $highlights.children('ul').remove();
        };
        this.files = [];
    }
    OpenFileWindow.prototype.initialize = function () {
        var _this = this;
        var $filter = this.$element.find('#filter');
        var $filterQuery = $filter.find('.filter_query');

        this.open(function () {
            _this.createFileList();
        }).close(function () {
            _this.cleanup();
        });

        $filter.submit(function () {
            return _this.filterSubmit();
        });

        $filterQuery.keyup(function (event) {
            _this.filter(event);
        });

        return _super.prototype.initialize.call(this);
    };

    OpenFileWindow.prototype.createFileList = function () {
        var _this = this;
        var $fileList = $('#file_list');
        $fileList.empty();

        this.files = [];

        Workspace.instance.ajax.getFiles(undefined, function (data) {
            for (var i = 0; i < data.length; i++) {
                _this.generateFolderTree(data[i], $fileList);
            }
        });
    };
    return OpenFileWindow;
})(UIWindow);
;
//# sourceMappingURL=OpenFileWindow.js.map
