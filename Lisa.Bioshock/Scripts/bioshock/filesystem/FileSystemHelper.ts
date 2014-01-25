class FileSystemHelper {

    public static hasValidExtension(fileName: string) {
        for (var i in this.extensions) {
            if (this.extensions.hasOwnProperty(i)) {
                if (this.hasCorrectExtension(this.extensions[i], fileName)) {
                    return true;
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
            if (this.endsWith(fileName, '.'+ type[i])) {
                return true;
            }
        }
        return false;
    }

    private static endsWith(str: string, pattern: string) {
        var d = str.length - pattern.length;
        return d >= 0 && str.lastIndexOf(pattern) === d;
    }

    private static extensions = {
        html: ["htm", "html"],
        css: ["css"]
    };
}