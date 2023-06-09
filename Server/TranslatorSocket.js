const {Socket} = require("socket.io")
const Translator = require("./Translator.js");

class TranslatorSocket {

    events = {
        "initData": {
            "code": 0,
            "handler": this.initData.bind(this)
        },
        "audioData": {
            "code": 1,
            "handler": this.audioData.bind(this)
        },
        "disconnect": {
            "code": 2,
            "handler": this.disconnect.bind(this)
        }
    }

    constructor(socket) {

        this.firstConnect = true;
        this.receivedInitData = false;

        this.socket = socket;

        for (const [eventName, eventDetails] of Object.entries(this.events)) {
            socket.on(eventName, eventDetails.handler)
        }
    }

    recognizedCallback(results, error) {
        if (error != null) {
            this.socket.send("error", {
                event: "recognizedText",
                message: error,
                code: 101
            })
            return;
        }
        this.socket.emit("recognizedText", results)
    }

    recognizingCallback(results, error) {
        if (error != null) {
            this.socket.send("error", {
                event: "recognizingText",
                message: error,
                code: 102
            })
            return;
        }
        this.socket.emit("recognizingText", results)
    }


    disconnect() {
        console.log('Disconnected!');
        if (this.translator) this.translator.endStream();
        if (this.socket) this.socket.disconnect();
    }

    audioData(data) {
        if (!this.receivedInitData || !this.translator) return;
        if (this.firstConnect) {
            this.firstConnect = false
            this.translator.startWritingStream()
        }
        this.translator.writeToStream(data)
    }

    initData(data) {
        if (!this.receivedInitData) {
          const {fromLang, toLang} = data;
          if (fromLang == undefined || toLang == undefined) {
            console.log("Missing from or to language");
            this.sendError("initData", "Either fromLang or toLang is missing");
            return;
          }
          
          try {
            this.translator = new Translator(fromLang, toLang);
            this.translator.connect(this.recognizedCallback.bind(this), this.recognizingCallback.bind(this));
            this.receivedInitData = true;
            this.sendSuccess("initData", "Successfully set languages");
          } catch (err) {
            console.log(err)
          }
        }
      }

    sendError(event, message) {
        this.socket.emit("error", {
            error: {
              event,
              message,
              code: this.events[event].code
            }
          })
    }

    sendSuccess(event, message) {
        this.socket.emit("success", {
            success: {
              event: event,
              message: message,
              code: this.events[event].code
            }
          })
    }

}

module.exports = TranslatorSocket;