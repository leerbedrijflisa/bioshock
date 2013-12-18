/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../Workspace.ts" />
/// <reference path="UIWindow.ts" />
class OpenFileWindow extends UIWindow {

    public constructor(selector: any) {
        super(selector);
    }

    public initialize() {
        var filter = this.$element.find('.filter');

        this.open(() => {
            this.createFileList();
        });

        filter.submit(() => {

        });
    }

    public createFileList = () => {

        var $fileList = $('#file_list');
        $fileList.empty();

        this.files = [];

        Workspace.instance.ajax.getFiles((data) => {
            for (var i = 0; i < data.length; i++) {
                this.generateFolderTree(data[i], $fileList);
            }
        });       
    }

    private generateFolderTree = (item, $fileList, $ul?) => {
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
                this.generateFolderTree(item.Subs[i], $fileList, $files);
            }
        } else {
            var $lastUl = $ul || $('<ul />').appendTo(".folder");

            var $li = $('<li />').appendTo($lastUl);
            var $a = $('<a />').appendTo($li);
            var $img = $('<img />').attr('src', '/Content/Images/item.png').appendTo($a);
            var $filename = $('<span />').text(item.Name).appendTo($a);

            this.files.push(item);
        }
    }

    private files = [];
};