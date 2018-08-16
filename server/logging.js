class Logging {
    constructor() {
        this.chrome = false
        this.prefix = "bob"
    }
    setColors(data) {
        let paint = (color, text) => {
            switch (color) {
                case '0'://black
                    text = '\x1B[30m' + text; break;
                case '4': //red
                    text = '\x1B[31m' + text; break;
                case '2': //green
                    text = '\x1B[32m' + text; break;
                case 'E': //yellow
                    text = '\x1B[33m' + text; break;
                case '1': //blue
                    text = '\x1B[34m' + text; break;
                case 'D': //magenta
                    text = '\x1B[35m' + text; break;
                case '3': //cyan
                    text = '\x1B[36m' + text; break;
                case 'f': //white
                    text = '\x1B[37m' + text; break;
                default:
                    text = color + text; break;
            }
            return text + '\x1B[39m' + '\x1b[0m';
        }
        let output = ""
        let painting = false
        let grabColor = 0
        let color = ""
        let items = []
        for (var i = 0; i < data.length; i++) {
            if (data[i] == "$") {
                if (painting) {
                    if (output != "") {
                        items.push(paint(color, output))
                        painting = false
                        output = ""
                    }
                }
                grabColor = true
                color = ""
            }
            if (grabColor) {
                color = color + data[i]
                if (color.length == 2) {
                    grabColor = false
                    painting = true
                    color = color.replace("$", "")
                }
            } else {
                output = output + data[i]
            }
        }
        if (painting) {
            items.push(paint(color, output))
        }
        output = ""
        for (let i in items) {
            output = output + items[i]
        }
        return output
    }
    log(message, color = "2") { //2=green

        message = `${this.prefix} ${this.setColors(`$3${message}`)}`
        console.log(message)
    }
    info(message) {
        message = `${this.prefix} ${this.setColors(`$3${message}`)}`
        console.log(message)

    }
    error(message) {
        message = `${this.prefix} ${this.colorText("red", message)}`
        console.log(message)
    }
}
let logging = new Logging()
logging.log("$2Hello $3World")