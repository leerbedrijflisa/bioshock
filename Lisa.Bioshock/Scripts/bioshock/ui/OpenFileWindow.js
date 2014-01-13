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
        _super.call(this, selector);
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

    OpenFileWindow.prototype.filter = function (event) {
        var _this = this;
        var filter = $(event.target).val();
        var $highlights = this.$element.find('#block .highlights');
        $highlights.children('ul').remove();

        if (filter.length > 0) {
            var $ul = $('<ul />').appendTo($highlights);

            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                if (file.name.search(filter) > -1 || file.fullPath.search(filter) > -1) {
                    var $li = $('<li />').appendTo($ul);
                    var $a = $('<a />').attr({
                        'href': 'javascript:void(0);'
                    }).data("file-id", file.id).appendTo($li);

                    var $img = $('<img />').attr({
                        'src': '/Content/Images/filter_item_logo.png',
                        'alt': file.ID
                    }).appendTo($a);

                    var $span = $('<span />').text(file.name).appendTo($a);

                    $a.click(function (event) {
                        _this.updateEditor(event);
                    });
                }
            }
        }
    };

    OpenFileWindow.prototype.filterSubmit = function () {
        var $highlights = this.$element.find('.highlights');
        var $ul = $highlights.find('ul');
        var $children = $ul.children('li');

        if ($children.length > 0) {
            var $a = $children.first().find('a');
            $a.click();
        }

        this.$element.find('.filter_query').focus();
        return false;
    };

    OpenFileWindow.prototype.updateEditor = function (event) {
        var id = $(event.currentTarget).data('file-id');

        Workspace.instance.ajax.getFileContents(id, function (data) {
            new EditorWindow('#editorWindow').openFile(data);
        });

        this.close();
    };

    OpenFileWindow.prototype.createFileList = function () {
        var _this = this;
        var $fileList = $('#file_list').empty();

        this.files = [];

        Workspace.instance.ajax.getFiles(function (data) {
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    _this.generateFolderTree(data[i], $fileList);
                }
            }
        });
    };

    OpenFileWindow.prototype.generateFolderTree = function (item, $fileList, $ul) {
        var path = item.fullPath.replace('/root', '');

        if (path == '') {
            path = '/';
        }

        if (item.type == 1 /* FOLDER */) {
            var $folder = $('<div />').addClass('folder').appendTo($fileList);
            $('<span />').addClass('folder_name').text(path).appendTo($folder);

            var $files = $('<ul />').appendTo($folder);
            $('<div />').addClass('clear').appendTo($folder);

            for (var i = 0; i < item.folderProps.items.length; i++) {
                this.generateFolderTree(item.folderProps.items[i], $fileList, $files);
            }
        } else {
            var $lastUl = $ul || $('<ul />').appendTo(".folder");

            var $li = $('<li />').appendTo($lastUl);
            var $a = $('<a />').appendTo($li);
            var $img = $('<img />').attr('src', '/Content/Images/item.png').appendTo($a);
            var $filename = $('<span />').text(item.name).appendTo($a);

            this.files.push(item);
        }
    };

    OpenFileWindow.prototype.cleanup = function () {
        this.$element.find('.filter_query').val('');

        var $highlights = this.$element.find('#block .highlights');
        $highlights.children('ul').remove();
    };
    return OpenFileWindow;
})(UIWindow);
;
//# sourceMappingURL=OpenFileWindow.js.map
