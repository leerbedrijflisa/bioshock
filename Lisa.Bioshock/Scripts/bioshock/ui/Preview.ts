class Preview {
    constructor(selector: string) {
        this.initialize(selector);
    }

    private initialize(selector) {
        this.element = <HTMLIFrameElement> $(selector)[0];
        this.document.on('keydown', this.onKeyPressed);
        this.document.on('keyup', this.onKeyReleased);
    }

    public update(file: FileDescriptor, contents: string) {
        if (this.fileId === file.ID) {
            this.applyChanges(contents);
        }
        else {
            this.reloadDependencies();
        }
    }

    public clear() {
        this.document.html('<html><head></head><body></body></html>');
    }

    private onKeyPressed = (event: JQueryKeyEventObject) => {
        this.keyPressed.raise(event);
    }

    private onKeyReleased = (event: JQueryKeyEventObject) => {
        this.keyReleased.raise(event);
    }

    private applyChanges(contents) {
        this.updateTitle(contents);
        this.updateContents(contents);
    }

    private updateTitle(contents: string) {
        var title = contents.match(/<title>((.*?|[\r\n*?])*?)(<\/|$)./mi);

        if (title) {
            document.title = title[1];
        } else {
            document.title = null;
        }
    }

    private matchElement(a: JQuery, b: JQuery, attrs: string[]): boolean {
        if (a.length != b.length) {
            //console.log(a.length, b.length);
            return false;
        }

        if (a.prop('tagName') != b.prop('tagName')) {
            //console.log(a.prop('tagName'), b.prop('tagName'));
            return false;
        }

        for (var i = 0; i < attrs.length; i++) {
            var attr = $.trim(attrs[i].toLowerCase());
            var ignoreCharIdx = attr.indexOf('^');
            var ignoreChar = ignoreCharIdx > -1 ? attr.substr(ignoreCharIdx + 1, 1) : null;

            if (ignoreChar) {
                attr = attr.substring(0, ignoreCharIdx);
            }

            var attrA = $.trim(a.attr(attr));
            var attrB = $.trim(b.attr(attr));

            if (ignoreChar) {
                attrA = attrA.substring(0, attrA.indexOf(ignoreChar) - 1);
                attrB = attrB.substring(0, attrB.indexOf(ignoreChar) - 1);
            }

            if (attrA != attrB) {
                return false;
            }
        }
        return true;
    }

    private updateHead(contents: string, reload = false) {
        var $contents;
        try {
            $contents = $(contents);
        } catch(e) {
            $contents = $("");
        }

        var currentLink = $(this.document.find('link')[0]);
        var newLink = $($contents.filter('link')[0]);

        if (newLink.length > 0) {
            var href = newLink.attr('href');
            var qsIdx = href.indexOf('?');

            if (reload) {
                href = href.substr(0, qsIdx);
            }

            if (href.indexOf('?') < 0) {
                href += '?' + new Date().getTime();
            }
            newLink.attr('href', href);
        }

        if (newLink.length == 0) {
            currentLink.remove();
        }
        else if (currentLink.length == 0 && newLink.length > 0) {
            this.document.find('head').append(newLink);
        }
        else if (!this.matchElement(currentLink, newLink, ["href^?", "rel", "type"]) || reload) {
            currentLink.replaceWith(newLink);
        }


        //var toRemove = [];

        //var indices = [];

        //newLinks.each((i, el) => {
        //    var $el = $(el);
        //    console.log(i, currentLinks[i]);
        //    if (currentLinks[i]) {
        //        var match = this.matchElement($(currentLinks[i]), $el, ["href^?", "rel", "type"]);
        //        console.log($(currentLinks[i]).attr('href'), $el.attr('href'), match);
        //        if (!match) {
        //            console.log('replace: ', $el.attr('href'));
        //            $(currentLinks[i]).replaceWith($el);
        //        }
        //    } else {
        //        this.document.find('head').append($el);
        //    }

        //    indices.push(i);
        //});

        //console.log(indices);
        //currentLinks.each((i, el) => {
        //    if ($.inArray(i, indices) == -1) {
        //        console.log(i + ' removed');
        //        $(currentLinks[i]).remove();
        //    }
        //});

        //var currentLinks = this.document.find('link');

        //var matchedLinks = [];
        //var dom = $(contents);
        //var domLength = dom.filter('link').each((i, el) => {
        //    var $old = $(currentLinks.get(i));
        //    var $el = $(el);
        //    var href = $el.attr('href');

        //    if (href.indexOf('?') < 0) {
        //        href += '?' + new Date().getTime();
        //    }
        //    $el.attr('href', href);

        //    matchedLinks.push($el);

        //    //if ($old.length == 0) {
        //    //    matchedLinks.push($el);
        //    //}
        //    //else if (!this.compareElement($old, $el, ["href^?", "rel", "type"])) {
        //    //    //$old.replaceWith($el).remove();
        //    //    matchedLinks.push($el);
        //    //}
        //    //else {
        //    //    matchedLinks.push($el);
        //    //}
        //}).length;

        //if (currentLinks.length > 0) {
        //    currentLinks.remove();
        //}

        //if (domLength > 0) {
        //    this.document.find('head').append(matchedLinks);
        //}

        
        //currentLinks.remove('link');

        //var headMatch = contents.match(/<head>((.*?|[\r\n*?])*?)(<\/head(.*?)>|<body(.*?)>)/gmi);

        //if (headMatch != null && headMatch.length > 0) {
        //    var link = headMatch[0].match(/<link (.*?)>/gmi);

        //    if (link != null && link.length > 0 && (reload || this.oldLink != link[0])) {
        //        this.document.find('head').html(link[0]);
        //        this.oldLink = link[0];
        //    }
        //}
    }

    private updateBody(contents: string) {
        var bodyMatch = contents.match(/<body(.*?)>((.*?|[\r\n*?])*?).*?$/gi);

        if (bodyMatch != null && bodyMatch.length > 0) {
            this.document.find('body')[0].innerHTML = bodyMatch[0].replace(/<\/body>/gi, '')
                                                                  .replace(/<\/html>/gi, '');
        } else {
            this.document.find('body')[0].innerHTML = contents;
        }
    }

    private updateContents(contents: string) {
        this.updateHead(contents);
        this.updateBody(contents);
    }

    private reloadDependencies() {
        this.updateHead(this.document.find("head")[0].outerHTML, true);
    }

    public get fileId() {
        return $(this.element).data('fileId');
    }

    public set fileId(id: string) {
        $(this.element).data('fileId', id);
    }

    private get document(): JQuery {
        return $((this.element.contentDocument
            || this.element.contentWindow.document).documentElement);
    }

    // events
    public keyPressed: EventDispatcher = new EventDispatcher(this);
    public keyReleased: EventDispatcher = new EventDispatcher(this);

    // fields
    private element: HTMLIFrameElement;
    private oldLink: string;
}