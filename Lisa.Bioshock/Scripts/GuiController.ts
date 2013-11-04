/// <reference path="typings/jquery/jquery.d.ts" />
class GuiController {

    /**
     * Creates a new GuiController
     *
     * @constructor
     * @param {object} options - Options used for initializing the GuiController.
     */
    constructor(editor:any, options = {}) {

        this.registerEditorHandlers(options);
        this.registerKeyHandlers();        
        this.registerSynchronizeHandlers();
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

            this.editor.setGutterMarker(3, "Errors", this.makeMarker());
        });
    }

    /**
     * Registers the drag handle
     * 
     * @param {string} handle - The selector to get the drag handle.
     */
    public registerDragHandle = (handle:string) => {

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
                this.isMenuAvailable = false;
            }
        } else {

            if (event.altKey && event.keyCode == 79) {

                this.isMenuActive = false;
                $(this.openFileWindowSelector).toggle();
                this.toggleOverlay();
                this.isMenuAvailable = true;
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
                                msg.appendChild(document.createTextNode(data[i].Message));
                                msg.className = "lint-error";
                                var errorinfo = document.createElement("div");
                                errorinfo.appendChild(document.createTextNode("More error information"));
                                errorinfo.className = "errorinfo";
                                msg.appendChild(errorinfo);
                                $(msg).click(function (event) {

                                    $(event.target).children().toggle();
                                });
                                this.widgets.push(this.editor.addLineWidget(data[i].Line -1, msg, { coverGutter: false, noHScroll: true }));
                                this.editor.setGutterMarker(data[i].Line -1, "Errors", this.makeMarker());
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

    private registerEditorHandlers(options:Object) {

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

    private makeMarker() {
        var errorMarker = document.createElement("div");
        errorMarker.innerHTML = "<img style='width:10px; margin-left:15px; margin-bottom:1px;' src='/Content/Images/ErrorIcon.png'/>";
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
    private editorWidth;
    private editorHeight;
    private isMenuActive = false;
    private isMenuAvailable = true;
    private isEditorDragging = false;
    private synchronizer: Synchronizer;
    private editor = undefined;    
    private lastKeyDown: number;          
}