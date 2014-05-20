class CheatSheetWindow extends UIWindow {
    constructor(selector: any) {
        super(selector);
        this.initialize();
    }

    public shortkeys: JQuery;

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

    // shortkey list, 1 shortkey veld
    public setShortKeysData(keys: any[]) {
        var fileList = $('.helpList').empty();

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
           
            fileList.append('<li><span>' + key.shortkey + '</span><span class="s">' + key.name + '</span></li>');
        }
    }

    private filter = () => {
        var helpList = $('.helpList');
        var searchString = this.$filterQuery.val();
        var searchArray = searchString.split(' ');

        if (searchString.length > 2) {
            helpList.find("li").each(function (index) {
                var item = $(this);
                var remove = true;

                for (var i = 0; i < searchArray.length; i++) {
                    var sItem = searchArray[i].toLowerCase();
                    var indexCount = item.text().toLowerCase().indexOf(sItem.trim());
                    if (indexCount > -1) {
                        remove = false;
                    }
                }
                alert(indexCount);
                if (remove) {
                    item.remove();
                }
            });
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
                    if (item == null || !item) {
                        $(this).removeClass('hide');
                    }
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