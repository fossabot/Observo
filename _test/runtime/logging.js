class Logging {
    constructor() {
        this.chrome = false
        this.prefix = ` ${this.colorText("magenta", "Defined")} |`
    }
    setPrefix(color, word) {
        if (this.chrome == true) {
            this.prefix = "[" + word + "] "
        } else {
            this.prefix = " " + this.colorText(color, word) + " |"
        }
    }
    inChrome() {
        this.chrome = true
    }
    colorText(color, text) {
        if (this.chrome == false) {
            switch (color) {
                case 'black':
                    text = '\x1B[30m' + text; break;
                case 'red':
                    text = '\x1B[31m' + text; break;
                case 'green':
                    text = '\x1B[32m' + text; break;
                case 'yellow':
                    text = '\x1B[33m' + text; break;
                case 'blue':
                    text = '\x1B[34m' + text; break;
                case 'magenta':
                    text = '\x1B[35m' + text; break;
                case 'cyan':
                    text = '\x1B[36m' + text; break;
                case 'white':
                    text = '\x1B[37m' + text; break;
                default:
                    text = color + text; break;
            }
            return text + '\x1B[39m' + '\x1b[0m';
        }
        return text
    };
    log(message, color = "white") {
        if (this.chrome == false) {
            message = `${this.prefix} ${this.colorText(color, message)}`
            console.log(message)
        } else {
            message = `${this.prefix} %c${message}`
            let css = `color: ${color};`
            setTimeout(console.log.bind(console, message, css), 0);
        }
    }
    info(message) {
        if (this.chrome == false) {
            message = `${this.prefix} ${this.colorText("cyan", message)}`
            console.log(message)
        } else {
            message = `${this.prefix} %c${message}`
            let css = `color: cyan;`
            setTimeout(console.log.bind(console, message, css), 0);
        }

    }
    error(message) {
        if (this.chrome == false) {
            message = `${this.prefix} ${this.colorText("red", message)}`
            console.log(message)
        } else {
            message = `${this.prefix} %c${message}`
            let css = `color: red;`
            setTimeout(console.log.bind(console, message, css), 0);
        }
    }
}

module.exports = Logging