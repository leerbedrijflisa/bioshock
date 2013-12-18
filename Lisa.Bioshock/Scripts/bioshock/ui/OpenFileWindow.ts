/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../Workspace.ts" />
/// <reference path="UIWindow.ts" />
class OpenFileWindow extends UIWindow {

    public constructor(selector: any) {
        super(selector);
    }

    public initialize() {
        var $filter = this.$element.find('#filter');
        var $filterQuery = $filter.find('.filter_query');

        this.open(() => {
            this.createFileList();
        }).close(() => {
            this.cleanup();
        });

        $filter.submit(() => {
            return this.filterSubmit();
        });

        $filterQuery.keyup((event) => {
            this.filter(event);
        });
    }    
    
    private filter = (event) => {
        var filter = $(event.target).val();
        var $highlights = this.$element.find('#block .highlights');
        $highlights.children('ul').remove();

        if (filter.length > 0) {
            var $ul = $('<ul />').appendTo($highlights);

            for (var i = 0; i < this.files.length; i++) {

                var file = this.files[i];
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

                    $a.click((event) => {
                        this.updateEditor(event);
                    });
                }
            }
        }
    }

    private filterSubmit = () => {
        var $highlights = this.$element.find('.highlights');
        var $ul = $highlights.find('ul');
        var $children = $ul.children('li');

        if ($children.length > 0) {
            var $a = $children.first().find('a');
            $a.click();
        }

        this.$element.find('.filter_query').focus();
        return false;
    }

    private updateEditor = (event) => {
        var id = $(event.currentTarget).attr('data-id');

        Workspace.instance.ajax.getFileContent({ guid: id }, (data) => {
            /* TODO: Implement editor content update */
            console.log(data);
        });
    }

    private createFileList() {

        var $fileList = $('#file_list');
        $fileList.empty();

        this.files = [];

        Workspace.instance.ajax.getFiles(undefined, (data) => {
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

    private cleanup = () => {
        this.$element.find('.filter_query').val('');

        var $highlights = this.$element.find('#block .highlights');
        $highlights.children('ul').remove();
    }  

    private files = [];
};