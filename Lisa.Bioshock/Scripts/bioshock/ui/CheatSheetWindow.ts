class CheatSheetWindow extends UIWindow {
    constructor(selector: any) {
        super(selector);
        this.initialize();
    }

    private initialize() {
        this.$filterQuery = this.$element.find('.bigInput');
        this.$filterQuery.on('keyup', this.onFilter);

        this.$closeLink = this.$element.find('#menu-window-close a');
        this.$closeLink.on('click', this.close);
    }

    public clearEventListeners() {
        this.$closeLink.off('click', this.close);

        return super.clearEventListeners();
    }

    public setShortKeysData(keys: any[]) {
        var fileList = $('.helpList').empty();

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var writeKeys = '';

            if (key.key1) {
                writeKeys = key.key1;
            } if (key.key2) {
                writeKeys += (key.key1 ? ' + ' + key.key2 : key.key2);
            } if (key.key3) {
                writeKeys += ((key.key1 || key.key2) ? ' + ' + key.key2 : key.key2);
            }

            fileList.append('<li><span>' + writeKeys + '</span><span class="s">' + key.name + '</span></li>');
        }
    }

    private onFilter = () => {
        this.clearFilter();
        var helpList = $('.helpList');
        var searchString = this.$filterQuery.val();
        var searchArray = searchString.split(' ');

        helpList.find("li").each(function (index) {
            var item = $(this).find('.s').text().toLowerCase();
            var hide = true;
            for (var i = 0; i < searchArray.length; i++) {
                var sItem = searchArray[i].toLowerCase();
                if (item.indexOf(sItem.trim()) == -1) {
                    if (hide) {
                        $(this).addClass('hide');
                    }
                } else {
                    hide = false;
                    if(item == null || !item)
                        $(this).removeClass('hide');
                }
            }
        });
    }

    private clearFilter = () => {
        $('.helpList').find("li").each(function (index) {
            $(this).removeClass('hide');
        });
    }


    // fields
    private $closeLink: JQuery;
    private $filterQuery: JQuery;
    
}  