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

        setTimeout(function () {
            $filterQuery.focus();
        }, 100);

        return super.initialize();
    }    
    
    private filter(event) {
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
                        'href': 'javascript:void(0);',
                    }).data("file-id", file.id).appendTo($li);

                    var $img = $('<img />').attr({
                        'src': '/Content/Images/filter_item_logo.png',
                        'alt': file.ID
                    }).appendTo($a);

                    var $span = $('<span />').text(file.name).appendTo($a);

                    $a.click((event) => {
                        this.updateEditor(event);
                    });
                }
            }
        }
    }

    private filterSubmit() {
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

    private updateEditor(event) {
        var id = $(event.currentTarget).data('file-id');

        workspace.ajax.getFileContents(id, (data) => {
            new EditorWindow('#editorWindow').openFile(data);
        });

        this.close();
    }

    private createFileList() {
        var $fileList = $('#file_list').empty();

        this.files = [];

        workspace.ajax.getFiles((data) => {
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    this.generateFolderTree(data[i], $fileList);
                }
            }
        });
    }

    private generateFolderTree(item: IStorageItem, $fileList, $ul?) {
        var path = item.fullPath.replace('/root', '');

        if (path == '') {
            path = '/';
        }

        if (item.type == StorageItemType.FOLDER) {
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
    }  

    private cleanup() {
        this.$element.find('.filter_query').val('');

        var $highlights = this.$element.find('#block .highlights');
        $highlights.children('ul').remove();
    }  

    private files = [];
};