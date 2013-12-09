/// <reference path="../typings/jquery/jquery.d.ts" />
class BaseGuiController {

    constructor(editor: any, options = {}, preview = true) {

        this.registerEditorHandlers(options);
        this.registerKeyHandlers();        
        this.registerSynchronizeHandlers();
        this.registerEvents();
        this.initFilesView();   

        if (preview) {

            this.registerPreviewHandlers();
        }     
    }

    public registerEditor = (editor: any) => {

        this.editor = editor;
        this.editor.on('change', (codeMirror) => {

            $.post("/Test/WriteFile", { guid: this.currentGuid, source: this.editor.getValue() });
            this.synchronizer.update(codeMirror.getValue());
        });

        this.editor.on('gutterClick', (codeMirror) => {

        });
    }

    public registerDragHandle = (handle: string) => {

        this.registerEditorHandlers({ handle: handle });
    }

    public registerWindow = (window: string) => {

        this.registerEditorHandlers({ window: window });
    }

    public registerPreview = (preview: string) => {

        this.registerEditorHandlers({ preview: preview });
    }

    public registerOverlay = (overlay: string) => {

        this.registerEditorHandlers({ overlay: overlay });
    }

    public registerMenu = (menu: string) => {

        this.registerEditorHandlers({ menu: menu });
    }

    public registerEditorHandlers = (options: Object) => {

        if (options.hasOwnProperty('preview')) {

            this.previewSelector = options['preview'];
            this.$preview = $(this.previewSelector);
        }

        if (options.hasOwnProperty('overlay')) {

            this.$overlay = $(options['overlay']);
        }

        if (options.hasOwnProperty('editor')) {

            this.registerEditor(options['editor']);
        }

        if (options.hasOwnProperty('window')) {

            this.$editorWindow = $(options['window']);
        }

        if (options.hasOwnProperty('menu')) {

            this.$menuWindow = $(options['menu']);
        }

        this.$editorWindow.resizable({

            minHeight: 52,
            minWidth: 200,
            containment: "#overlay",
            resize: (event, ui) => {


                if (this.isMenuActive) {

                    this.$editorWindow
                        .width(this.editorWidth)
                        .height(this.editorHeight);
                }
                else {

                    this.editorWidth = ui.size.width;
                    this.editorHeight = ui.size.height;
                }

                this.editor.refresh();
            },

            start: () => {

                this.isEditorDragging = true;
                this.toggleOverlay();
            },
            stop: () => {

                this.isEditorDragging = false;
                this.toggleOverlay();
                this.editor.refresh();
            },
            handles: 'all'
        }).draggable({

                iframeFix: true,
                containment: 'window'
            });

        if (options.hasOwnProperty('handle')) {

            this.$editorWindow.draggable('option', 'handle', options['handle']);
        } else {

            this.registerDragHandle('h1');
        }
    }

    public registerPreviewHandlers() {

        var iframe: any = this.$preview[0];
        $(iframe.contentWindow)
            .keydown(this.editorKeyDown)
            .keyup(this.editorKeyUp);
    }

    public insertWhitespace() {

        var lineNumber = this.editor.getCursor().line;
        var lineText = this.editor.getLineHandle(lineNumber).text;

        this.editor.setLine(lineNumber, "\n" + lineText);
        this.editor.setCursor(lineNumber);
    }
    public updateMenuState() {

        this.isMenuActive = true;
        this.toggleOverlay();
        this.isMenuAvailable = false;
    }

    private canExecuteAction() {

        return (!this.isMenuActive && this.canToggleEditor);
    }

    private editorKeyDown = (event) => {
        this.lastKeyDown = event.keyCode;

        if (this.canExecuteAction()) {

            // Insert line above current
            if (event.ctrlKey && event.keyCode === this.keys.ENTER) {

                this.insertWhitespace();
            }

            if (event.altKey) {

                // File browser
                if (event.keyCode === this.keys.O) {

                    this.createFileList();
                    this.isMenuActive = true;
                    this.toggleOverlay();
                    this.$openFileWindow.toggle();

                    $(".filter_query").focus();
                    this.isMenuAvailable = false;
                }

                // New file dialog
                if (event.keyCode === this.keys.N) {

                    this.isMenuActive = true;
                    this.toggleOverlay();
                    this.$newFileWindow.toggle();
                    $("newFileName").focus();
                    this.isMenuAvailable = false;
                }

                // Open fullscreen
                if (event.keyCode === this.keys.F) {

                    this.canToggleEditor = false;
                    this.$editorWindow.toggle();
                    window.open("/home/fullscreen", "_blank");
                }
            }
        } else {

            if (event.altKey) {

                // Close file dialog
                if (event.keyCode === this.keys.O && this.isMenuActive) {

                    this.isMenuActive = false;
                    this.$openFileWindow.toggle();

                    $('#wrap .filter_query').val("");
                    this.applyFilter();
                    $('.nicescroll-rails').hide();
                    this.toggleOverlay();
                    this.isMenuAvailable = true;
                }

                // Close new file dialog if allowed
                if (event.keyCode === this.keys.N && this.canToggleEditor) {

                    this.isMenuActive = false;
                    this.toggleOverlay();
                    this.$newFileWindow.toggle();
                    this.isMenuAvailable = true;
                    $("#newFileName").val("");
                }
            }
        }
    }

    private editorKeyUp = (event) => {

        if (!this.isMenuActive && this.canToggleEditor) {

            if (event.keyCode == 17 && this.lastKeyDown == 17) {

                this.$editorWindow.toggle();
                this.editor.refresh();
            }

            if (event.keyCode == 144 && this.lastKeyDown == 144) {
                if (this.ready) {
                    this.ready = false;
                    for (var i: any = 0; i < this.widgets.length; ++i) {
                        this.editor.removeLineWidget(this.widgets[i]);
                        this.editor.clearGutter("Errors");
                    }
                    this.widgets.length = 0;
                    var filename = $("#filename").text();
                    if (filename.indexOf(".html") > -1) {
                        $.get("/validate/validatehtml", { source: this.editor.getValue() }, (data) => {

                            this.getErrors(data);
                        }, "json");
                    } else if (filename.indexOf(".css") > -1) {
                        $.get("/validate/validatecss", { source: this.editor.getValue() }, (data) => {

                            this.getErrors(data);
                        }, "json");
                    }

                    this.ready = true;
                }
            }
        }

        if (event.keyCode === 27) {

            if (this.isMenuAvailable) {

                if (this.isMenuActive) {

                    this.isMenuActive = false;
                    this.toggleOverlay();
                    this.editor.focus();
                } else {

                    this.isMenuActive = true;
                    this.toggleOverlay();
                }

                this.$menuWindow.toggle().focus();
            }
        }
    }

    private getErrors = (data) => {

        for (var i in data) {
            if (data[i].Type == 2) {
                var msg = document.createElement("div");
                $(msg).append(document.createTextNode(data[i].Message));
                $(msg).addClass("lint-error");
                $(msg).hide();
                this.widgets.push(this.editor.addLineWidget(data[i].Line - 1, msg, { coverGutter: false, noHScroll: true }));

                var marker = this.makeMarker();
                var handle = this.editor.setGutterMarker(data[i].Line - 1, "Errors", marker);
                var lineNumber = this.editor.getLineNumber(handle);

                $(marker).attr("data-error-line-number", lineNumber)
                    .click(function (event) {

                        var errorDivId = $(this).attr("data-error-line-number");
                        $('.error-line-number' + errorDivId).toggle();
                    });
                $(msg).addClass("error-line-number" + lineNumber);
            }
        }
        $(this.errorCount).text(this.widgets.length);
    }

    public initFilesView() {

        $('#openFileWindow .filter_query').keyup(this.applyFilter);
        this.createFileList();
        var scrollbar: any = $("#file_list");
        scrollbar.niceScroll({ autohidemode: false, touchbehavior: false, cursorcolor: "#fff", cursoropacitymax: 1, cursorwidth: 16, cursorborder: false, cursorborderradius: false, background: "#121012", autohidemode: false, railpadding: { top: 2, right: 2, bottom: 2 } }).cursor.css({ "background": "#FF4200" });
        $('.nicescroll-rails').show({
            complete: function () {
                var scroll: any = $("#file_list");
                scroll.getNiceScroll().resize();
            }
        });
    }

    private applyFilter = () => {

        var filter = $('#openFileWindow .filter_query').val();
        this.showFilterResults(filter);
    }

    private createFileList = () => {
        var fileList = $('#file_list');
        this.files = [];
        fileList.empty();
        $.get("/test/getFiles", {}, (data) => {

            fileList.append('<div class="folder"><span class="folder_name">/root/</span><ul></ul><div class="clear"></div></div>');
            for (var i = data.length - 1; i >= 0; i--) {

                var item = data[i];

                if (item.Type == "File") {

                    var ul = $('#file_list .folder ul:last');
                    ul.append('<li><a><img src="/Content/Images/item.png" alt=""><span>' + item.Name + '</span></a></li>');
                    this.files.push(item);

                    data.splice(i, 1);
                }
            }

            for (i = 0; i < data.length; i++) {

                this.generateFolderTree(data[i], fileList);
            }
        });

    }

    private generateFolderTree = (item, fileList) => {

        fileList.append('<div class="folder"><span class="folder_name">' + item.FullPath + '</span><ul></ul><div class="clear"></div></div>');

        for (var i = item.Subs.length - 1; i >= 0; i--) {

            var sub = item.Subs[i];
            if (sub.Type == "File") {

                var ul = $('#file_list .folder ul:last');
                ul.append('<li><a><img src="/Content/Images/item.png" alt=""><span>' + sub.Name + '</span></a></li>');
                this.files.push(sub);

                item.Subs.splice(i, 1);
            }
        }

        for (var i = 0; i < item.Subs.length; i++) {

            var sub = item.Subs[i];
            this.generateFolderTree(sub, fileList);
        }
    }

    private showFilterResults = (filter) => {

        var block = $('#block .highlights');
        $('#block .highlights ul').remove();

        if (filter.length > 0) {
            block.append('<ul></ul>');
            var li = $('#block .highlights ul');

            for (var i = 0; i < this.files.length; i++) {

                var file = this.files[i];
                if (file.Name.search(filter) > -1 || file.FullPath.search(filter) > -1) {

                    li.prepend('<li><a href="javascript:void(0);" data-id="' + file.ID + '"><img src="/Content/Images/filter_item_logo.png" alt=""><span>' + file.Name + '</span></a></li>');
                }
            }
            li.find("a").click((event) => {

                var id = $(event.currentTarget).attr("data-id");

                $.post("/test/GetFileContent", { guid: id }, (data) => {

                    this.currentGuid = id;
                    this.editor.setValue(data.content);
                    this.isMenuActive = false;
                    this.toggleOverlay();
                    this.$openFileWindow.toggle();
                    this.isMenuAvailable = true;
                });
                $("#filename").text($(event.currentTarget).text());
            });
        }
    }

    public registerKeyHandlers() {

        $(window).keydown(this.editorKeyDown);
        $(window).keyup(this.editorKeyUp);        
    }

    public registerSynchronizeHandlers() {

        this.synchronizer = new Synchronizer(this.previewSelector);
        this.synchronizer.start(() => {

            this.synchronizer.update(this.editor.getValue());
        });
    }

    public registerEvents = () => {

        $(this.addButton).bind("click", this.createFile);
        $("#newFileName").bind("keydown", (event) => {

            if (event.keyCode == 13) {
                this.createFile();
                return false;
            }
        });
    }

    private createFile = () => {

        var fileName = $("#newFileName").val();
        if (fileName.endsWith(".css") || fileName.endsWith(".html")) {


            $.get("/test/CreateFile", { filename: fileName }, (data) => {

                if (data.Result) {

                    this.currentGuid = data.ID;
                    this.createFileList();
                    this.isMenuActive = false;
                    this.toggleOverlay();
                    this.$newFileWindow.toggle();
                    this.isMenuAvailable = true;
                    this.editor.setValue("");
                    $("#filename").text(fileName);
                }

            });

        } else {
            $("#newFileName").tooltip({ content: "Kan geen bestand maken zonder extensie" });
            $("#newFileName").tooltip("option", "show", { effect: "blind", duration: 700 });
            $("#newFileName").tooltip("open");
        }

    }

    private makeMarker() {
        var errorMarker = document.createElement("div");
        $(errorMarker).click(function (event) {


        });
        errorMarker.innerHTML = "<img style='cursor: pointer; width:10px; margin-left:15px; margin-bottom:1px;' src='/Content/Images/ErrorIcon.png'/>";
        return errorMarker;
    }


    private toggleOverlay() {

        if (this.isMenuActive) {

            this.$overlay.css({

                'background-color': 'black',
                'opacity': '0.65',
                'z-index': '499'
            });
        } else {

            this.$overlay.css({

                'background-color': '',
                'opacity': '1',
                'z-index': '0'
            });
        }

        if (this.isMenuActive || this.isEditorDragging) {
            $('#overlay').show();
        }
        else {
            $('#overlay').hide();
        }

    }

    public editor: any;
    public keys = {

        ENTER: 13,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79
    }

    private $overlay = $('#overlay');
    private $editorWindow = $('#editorWindow');
    private $preview = $('#preview');
    private $menuWindow = $('#editorMenuWindow');
    private $openFileWindow = $('#openFileWindow');
    private $newFileWindow = $('#newFileWindow');

    private previewSelector = '#preview';
    private errorCount = '#errorcount';
    private addButton = '#addButton';
    private editorWidth;
    private editorHeight;
    private isMenuActive = false;
    private isMenuAvailable = true;
    private isEditorDragging = false;
    private canToggleEditor = true;
    private synchronizer: Synchronizer;
    private lastKeyDown: number;
    private currentGuid = "";
    private files = [];
    private widgets = [];
    private ready = true;
}