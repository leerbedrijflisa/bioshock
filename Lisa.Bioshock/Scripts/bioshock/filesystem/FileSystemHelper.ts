class FileSystemHelper {

    public static hasValidExtension(fileName: string) {
        for (var i in this.extensions) {
            if (this.extensions.hasOwnProperty(i)) {
                for (var j = 0; j < this.extensions[i].length; j++) {
                    if (fileName.indexOf('.' + this.extensions[i][j]) > -1) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public static isHTML(fileName: string) {
        return this.hasCorrectExtension(this.extensions.html, fileName);
    }

    public static isCSS(fileName: string) {
        return this.hasCorrectExtension(this.extensions.css, fileName);
    }

    private static hasCorrectExtension(type: string[], fileName: string) {
        for (var i = 0; i < type.length; i++) {
            if (fileName.indexOf('.' + type[i])) {
                return true;
            }
        }
        return false;
    }

    private static extensions = {
        html: ["htm", "html"],
        css: ["css"]
    };
}