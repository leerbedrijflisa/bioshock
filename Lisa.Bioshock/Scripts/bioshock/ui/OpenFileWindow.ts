/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../Workspace.ts" />
/// <reference path="UIWindow.ts" />
class OpenFileWindow extends UIWindow {

    public constructor(selector: any) {
        super(selector);
    }

    public initialize() {
        var filter = this.$element.find('.filter');
        filter.submit(() => {

        });
    }

    private createFileList = () => {

        var $fileList = $('#file-list');
        $fileList.empty();

        this.files = [];

        Workspace.instance.ajax.getFiles((data) => {
            for (var i = 0; i < data.length; i++) {
                this.generateFolderTree(data[i], $fileList);
            }
        });       
    }

    private generateFolderTree = (item, $fileList) => {
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

            this.files.push(item);
        } else if (type == "folder") {
            for (var i = 0; i < item.Subs.length; i++) {
                this.generateFolderTree(item.Subs[i], $fileList);
            }
        }
    }

    private files = [];
};