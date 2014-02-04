class OpenFileWindow extends UIWindow {

    public constructor(selector: any) {
        super(selector);
        this.initialize();
    }

    private initialize() {
        this.$filter = this.$element.find('#filter');
        this.$filterQuery = this.$filter.find('.filter-query');

        this.$filter.on('submit', this.onFilterSubmit);
        this.$filterQuery.on('keyup', this.onFilter);
    }

    public open() {
        this.$filterQuery.val('');

        setTimeout(() => {
            this.$filterQuery.focus();
        }, 100);

        return super.open();
    }

    public clearEventListeners() {
        this.fileSelected.clear();

        this.$filter.off('submit', this.onFilterSubmit);
        this.$filterQuery.off('keyUp', this.onFilter);

        return super.clearEventListeners();
    }

    public reset() {
        this.$filterQuery.val('');

        var $highlights = this.$element.find('#open-file-filter-block .highlights');
        $highlights.children('ul').remove();
    }  

    public setFileData(files: StorageItem[]) {
        var $fileList = $('#file-list').empty();
        this.files = [];

        for(var i in files) {
            if (files.hasOwnProperty(i)) {
                this.generateFolderTree(files[i], $fileList);
            }
        }

        this.onFilter();
    }

    private onFilter = () => {
        var filter = this.$filterQuery.val();
        var $highlights = this.$element.find('#open-file-filter-block .highlights');
        $highlights.children('ul').remove();

        if (filter.length > 0) {
            var $ul = $('<ul />').appendTo($highlights);

            for (var i = 0; i < this.files.length; i++) {

                var file = this.files[i];
                if (file.name.indexOf(filter) > -1 || file.fullPath.indexOf(filter) > -1) {

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
                        this.onFileSelected(event);
                    });
                }
            }
        }
    }

    private onFilterSubmit = () => {
        var $highlights = this.$element.find('.highlights');
        var $ul = $highlights.find('ul');
        var $children = $ul.children('li');

        if ($children.length > 0) {
            var $a = $children.first().find('a');
            $a.click();
        }

        this.$filterQuery.focus();
        return false;
    }

    private onFileSelected = (event: JQueryEventObject) => {
        var id = $(event.currentTarget).data('file-id');
        this.fileSelected.raise(id);
    }


    private generateFolderTree(item: StorageItem, $fileList, $ul?) {
        var path = item.fullPath;

        if (path == '') {
            path = '/';
        }

        if (item.type == StorageItemType.FOLDER) {
            var $folder = $('<div />').addClass('folder').appendTo($fileList);
            $('<span />').addClass('folder-name').text(path).appendTo($folder);

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

    // events
    public fileSelected: EventDispatcher = new EventDispatcher(this);

    // fields
    private files = [];
    private $filter: JQuery;
    private $filterQuery: JQuery;
};