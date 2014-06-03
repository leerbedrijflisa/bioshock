class CheatSheetWindow extends UIWindow {
    constructor(selector: any) {
        super(selector);
        this.initialize();
    }

    private initialize() {
        this.$filterQuery = this.$element.find('.bigInput');
        this.$filterQuery.on('keyup', this.filter);

        this.$closeLink = this.$element.find('#menu-window-close a');
        this.$closeLink.on('click', this.close);
    }

    public clearEventListeners() {
        this.$closeLink.off('click', this.close);

        return super.clearEventListeners();
    }

    // shortkey list, 1 shortkey veld
    public setShortKeysData(keys: any[]) {
        this.$shortkeys = keys;
        var fileList = $('.helpList').empty();

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
           
            fileList.append('<li><span>' + key.shortkey + '</span><span class="s">' + key.name + '</span><span class="hide order"></span></li>');
        }
    }

    public test = () => {
        var fileList = $('.helpList').empty();
        var keys = this.$shortkeys;

        if (keys != undefined || keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];

                var shortKey = $("<span></span>")
                    .text(key.shortkey);

                var keyName = $("<span></span>")
                    .addClass("s")
                    .text(key.name);

                $("<li></li>")
                    .append(shortKey)
                    .append(keyName)
                    .appendTo(fileList);

                //fileList.append('<li><span>' + key.shortkey + '</span><span class="s">' + key.name + '</span><span class="hide order"></span></li>');
            }
        }
    }

    private rewriteList = () => {
        $('.helpList').find("li").each(function (index) {
            $(this).remove();
        });
        this.test();
    }

    private filter = () => {
        if (this.$shortkeys != undefined || this.$shortkeys != null) {
            this.rewriteList();
        }

        var helpList = $('.helpList');
        var searchString = this.$filterQuery.val();
        if (searchString.length > 2) {

            var searchArray = searchString.trim().replace(/ {2,}/g, ' ').split(' ');
        
            helpList.find("li").each(function (index) {
                var item = $(this);
                var remove = true;
                var orderCount = [];

                for (var i = 0; i < searchArray.length; i++) {
                    var sItem = searchArray[i].toLowerCase();
                    if (sItem == null || sItem == ' ') {
                        delete searchArray[i];
                    } else {
                        var indexCount = item.find(".s").text().toLowerCase().indexOf(sItem.trim());
                        if (indexCount > -1) {
                            remove = false;
                            orderCount.push(indexCount.toString());
                        }
                    }
                }
                
                if (remove) {
                    item.remove();
                } else {
                    item.data("order", orderCount);
                }
            });

            var items = [];

            helpList.find("li").each(function () {
                var item = $(this);
                var order = item.data("order");

                var prev = 0;
                var points = 0;

                if (order) {
                    if (order.length == 1) {
                        points = item.find(".s").text().length - order[0];
                    } else {
                        for (var i = 0; i < order.length; i++) {
                            points++;

                            if (order[i] < prev) {
                                break;
                            }
                            prev = order[i];
                        }

                        if (prev == order[order.length - 1]) {
                            points += 10;
                        }
                    }
                }

                item.data("points", points);
                var cloned = item.clone(true, true);
                items.push(cloned);
            });

            items.sort(this.sortItems);
            helpList.empty();

            for (var i = 0; i < items.length; i++) {
                helpList.append(items[i]);
            }
        }
    }

    private sortItems(a: JQuery, b: JQuery): number {
        var pointsA = a.data("points");
        var pointsB = b.data("points");

        if (pointsA > pointsB) {
            return -1;
        } else if (pointsB > pointsA) {
            return 1;
        }
        return 0;
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
    private $shortkeys: any[];    
}  