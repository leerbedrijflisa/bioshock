/// <reference path="typings/jquery/jquery.d.ts" />
class GuiController {

    /**
     * Creates a new GuiController
     *
     * @constructor
     * @param {object} options - Options used for initializing the GuiController.
     */
    constructor(editor: any, options = {}) {

        this.registerEditorHandlers(options);
        this.registerKeyHandlers();
        this.registerSynchronizeHandlers();     
        this.registerEvents();   
        this.initFilesView();
    }

    /**
     * Registers the editor on which the change event should be handled
     * 
     * @param {*} editor - The editor (CodeMirror).
     */
    private ready = true;
    private widgets = [];
    public registerEditor = (editor: any) => {
        this.editor = editor;
        this.editor.on('change', (codeMirror) => {

            this.synchronizer.update(codeMirror.getValue());

        });
        this.editor.on('gutterClick', (codeMirror) => {

        });
    }

    /**
     * Registers the drag handle
     * 
     * @param {string} handle - The selector to get the drag handle.
     */
    public registerDragHandle = (handle: string) => {

        this.registerEditorHandlers({ handle: handle });
    }

    /**
     * Registers the element that will be used to identify the editors window
     * 
     * @param {string} window - The selector used to get the window.
     */
    public registerWindow = (window: string) => {

        this.registerEditorHandlers({ window: window });
    }

    /**
     * Registers the element that will be used to identify the preview
     * 
     * @param {string} preview - The selector used to get the preview.
     */
    public registerPreview = (preview: string) => {

        this.registerEditorHandlers({ preview: preview });
    }

    /**
     * Registers the element that will be used to identify the overlay
     * 
     * @param {string} overlay - The selector used to get the overlay.
     */
    public registerOverlay = (overlay: string) => {

        this.registerEditorHandlers({ overlay: overlay });
    }

    /**
     * Registers the element that will be used to identify the (escape) menu
     * 
     * @param {string} overlay - The selector used to get the menu.
     */
    public registerMenu = (menu: string) => {

        this.registerEditorHandlers({ menu: menu });
    }

    private editorKeyDown = (event) => {
        this.lastKeyDown = event.keyCode;

        if (!this.isMenuActive) {

            if (event.ctrlKey && event.keyCode == 13) {

                var lineNumber = this.editor.getCursor().line;
                var lineText = this.editor.getLineHandle(lineNumber).text;

                this.editor.setLine(lineNumber, "\n" + lineText);
                this.editor.setCursor(lineNumber);
            }

            if (event.altKey && event.keyCode == 79) {
                
                this.isMenuActive = true;
                this.toggleOverlay();
                $(this.openFileWindowSelector).toggle();
                $(".filter_query").focus();
                this.isMenuAvailable = false;
                
            }
            if (event.altKey && event.keyCode == 78) {

                this.isMenuActive = true;
                this.toggleOverlay();
                $(this.newFileWindow).toggle();
                $("#newFileName").focus();
                this.isMenuAvailable = false;
            }
        } else {

            if (event.altKey && event.keyCode == 79) {

                this.isMenuActive = false;
                $(this.openFileWindowSelector).toggle();
                $('#wrap .filter_query').val("");
                this.applyFilter();
                $('.nicescroll-rails').hide();
                this.toggleOverlay();
                this.isMenuAvailable = true;
            }

            else if (event.altKey && event.keyCode == 78) {

                this.isMenuActive = false;
                this.toggleOverlay();
                $(this.newFileWindow).toggle();
                this.isMenuAvailable = true;
                $("#newFileName").val("");
            }
        }


    }
    
    private editorKeyUp = (event) => {
        
        if (!this.isMenuActive) {

            if (event.keyCode == 17 && this.lastKeyDown == 17) {

                $(this.editorWindowSelector).toggle();
                this.editor.refresh();
            }

            //if (event.keyCode == 20 && this.lastKeyDown == 20) {
            //    var msg = document.createElement("div");
            //    msg.appendChild(document.createTextNode("Hallo"));
            //    msg.className = "lint-error";
            //    this.editor.addLineWidget(3, msg, { coverGutter: false, noHScroll: true });
            //    this.editor.setGutterMarker(3, "Errors", this.makeMarker());
            //}

            if (event.keyCode == 144 && this.lastKeyDown == 144) {
                if (this.ready) {
                    this.ready = false;
                    $.get("/validate/validate", { source: this.editor.getValue() }, (data) => {
                        for (var i: any = 0; i < this.widgets.length; ++i) {
                            this.editor.removeLineWidget(this.widgets[i]);
                            this.editor.clearGutter("Errors");
                        }
                        this.widgets.length = 0;
                        for (var i in data) {
                            if (data[i].Type == 2) {
                                var msg = document.createElement("div");
                                $(msg).append(document.createTextNode(data[i].Message));
                                $(msg).addClass("lint-error");
                                $(msg).hide();
                                this.widgets.push(this.editor.addLineWidget(data[i].Line -1, msg, { coverGutter: false, noHScroll: true }));

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
                        this.ready = true;
                    }, "json");
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

                $(this.menuWindowSelector).toggle().focus();
            }
        }
    }

    private initFilesView() {
        
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

        $.get("/test/getFiles", { }, (data) => {

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

                    li.prepend('<li><a href="javascript:void(0);" data-id="' + file.ID + '"><img src=" / Content / Images / filter_item_logo.png" alt=""><span>' + file.Name + '</span></a></li>');
                }
            }
            li.find("a").click((event) => {

                var id = $(event.currentTarget).attr("data-id");
                
                $.get("/test/GetFileContent", { guid: id }, (data) => {

                    this.editor.setValue(data.content);
                    this.isMenuActive = false;
                    this.toggleOverlay();
                    $(this.openFileWindowSelector).toggle();
                    this.isMenuAvailable = true;
                });
            });
        } 
    }

    private registerKeyHandlers() {

        $(window).keydown(this.editorKeyDown);
        $(window).keyup(this.editorKeyUp);
        
        var iframe: any = $(this.previewSelector)[0];
        $(iframe.contentWindow).keydown(this.editorKeyDown);
        $(iframe.contentWindow).keyup(this.editorKeyUp);
    }

    private registerSynchronizeHandlers() {

        this.synchronizer = new Synchronizer(this.previewSelector);
        this.synchronizer.start(() => {

            this.synchronizer.update(this.editor.getValue());
        });
    }

    public registerEditorHandlers = (options:Object) => {

        if (options.hasOwnProperty('preview')) {

            this.previewSelector = options['preview'];
        }

        if (options.hasOwnProperty('overlay')) {

            this.overlaySelector = options['overlay'];
        }

        if (options.hasOwnProperty('editor')) {

            this.registerEditor(options['editor']);
        }

        if (options.hasOwnProperty('window')) {

            this.editorWindowSelector = options['window'];
        }

        if (options.hasOwnProperty('menu')) {

            this.menuWindowSelector = options['menu'];
        }

        $(this.editorWindowSelector).resizable({

            minHeight: 52,
            minWidth: 200,  
            containment: "#overlay",
            resize: (event, ui) => {
                
                
                if (this.isMenuActive) {


                    $(this.editorWindowSelector).width(this.editorWidth);
                    $(this.editorWindowSelector).height(this.editorHeight);
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
        });

        $(this.editorWindowSelector).draggable({

            iframeFix: true,
            containment: "window"
        });
        if (options.hasOwnProperty('handle')) {

            $(this.editorWindowSelector).draggable('option', 'handle', options['handle']);
        } else {

            this.registerDragHandle('h1');
        } 
    }

    private registerEvents = () => {

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

            $("#filename").text(fileName);
            $.get("/test/CreateFile", { filename: fileName });
            this.isMenuActive = false;
            this.toggleOverlay();
            $(this.newFileWindow).toggle();
            this.isMenuAvailable = true;
        } else {

            //$("#newFileName").tooltip();
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

            $(this.overlaySelector).css({
                'background-color': 'black',
                'opacity': '0.65',
                'z-index': '499'
            });
        } else {

            $(this.overlaySelector).css({
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

    private editorWindowSelector = '#editorWindow';   
    private previewSelector = '#preview';
    private overlaySelector = '#overlay';
    private menuWindowSelector = '#editorMenuWindow';
    private openFileWindowSelector = '#openFileWindow';
    private errorCount = '#errorcount';
    private newFileWindow = '#newFileWindow';
    private addButton = '#addButton';
    private editorWidth;
    private editorHeight;
    private isMenuActive = false;
    private isMenuAvailable = true;
    private isEditorDragging = false;
    private synchronizer: Synchronizer;
    private editor = undefined;    
    private lastKeyDown: number;     
    //private files = {
    //'\\': ['index.html', 'contact.html', 'lol.html', 'houdoe.html', 'rap.html'],
    //'\\css': ['style.css'],
    //'\\css\\images': ['background.jpg', 'contact-map.png']
    //}     
    private files = [];
}