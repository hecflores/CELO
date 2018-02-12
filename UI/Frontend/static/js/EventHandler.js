/**
 * Created by Hector on 2/27/2017.
 */
function MyEvent(data) {
    $.extend(this, data);
}
function EventHandler() {
    this._events = {events: [], subevents: {}};
}
EventHandler.prototype.unbind = function () {


    if (typeof this._events == "undefined") {
        this._events = { events: [], subevents: {} };
    }
    switch (arguments.length) {
        case 0:
            console.error("EventHandler.on: Invalid number of parameters");
            break;
        default:
            var node = this._events;
            for (var i = 0; i < arguments.length; i++) {
                if (typeof node.subevents[arguments[i]] == "undefined") {
                    return;
                }
                node = node.subevents[arguments[i]];
            }
            node.events = [];
            break;

    }
}
EventHandler.prototype.unbindAll = function () {
    if (typeof this._events == "undefined") {
        this._events = { events: [], subevents: {} };
    }
    var node = this._events;
    for (var i = 0; i < arguments.length; i++) {
        if (typeof node.subevents[arguments[i]] == "undefined") {
            return;
        }
        node = node.subevents[arguments[i]];
    }
    node.events = [];
    for (var subevent in node.subevents) {
        var tempArguments = $.merge([subevent], arguments);
        this.unbindAll.apply(this, tempArguments);
        delete node.subevents[subevent];
    }

}

EventHandler.prototype.on = function () {
    if (typeof this._events == "undefined") {
        this._events = { events: [], subevents: {} };
    }
    switch (arguments.length) {
        case 0:
            console.error("EventHandler.on: Invalid number of parameters");
            break;
        case 1:
            console.error("EventHandler.on: Invalid number of parameters");
            break;
        default:
            if (typeof arguments[arguments.length - 1] != "function") {
                console.error("EventHandler.on: Last argument is not a function");
                return this;
            }
            var node = this._events;
            for (var i = 0; i < arguments.length - 1; i++) {
                if (typeof node.subevents[arguments[i]] == "undefined") {
                    node.subevents[arguments[i]] = { events: [], subevents: {} };
                }
                node = node.subevents[arguments[i]];
            }
            node.events.push(arguments[arguments.length - 1]);
            break;

    }
    return this;
}
EventHandler.prototype.trigger = function () {
    if (typeof this._events == "undefined") {
        this._events = { events: [], subevents: {} };
    }
    switch (arguments.length) {
        case 0:
            console.error("EventHandler.trigger: Invalid number of parameters");
            break;
        default:
            if (!(arguments[arguments.length - 1] instanceof MyEvent)) {
                if (typeof arguments[arguments.length - 1] == "object") {
                    arguments[arguments.length - 1] = this.createEvent(arguments[arguments.length - 1]);
                }
                else {
                    arguments[arguments.length++] = this.createEvent({});
                }
            }
            var node = this._events;
            for (var i = 0; i < arguments.length - 1; i++) {
                if (typeof node.subevents[arguments[i]] == "undefined") {
                    return;
                }
                node = node.subevents[arguments[i]];
            }
            var myArguments = arguments;
            node.events.forEach(function (item) {
                item(myArguments[myArguments.length - 1]);
            });
    }


}
EventHandler.prototype.triggerAll = function () {
    if (typeof this._events == "undefined") {
        this._events = { events: [], subevents: {} };
    }
    switch (arguments.length) {
        case 0:
            console.error("EventHandler.trigger: Invalid number of parameters");
            break;
        default:
            if (!(arguments[arguments.length - 1] instanceof MyEvent)) {
                if (typeof arguments[arguments.length - 1] == "object") {
                    arguments[arguments.length - 1] = this.createEvent(arguments[arguments.length - 1]);
                }
                else {
                    arguments[arguments.length++] = this.createEvent({});
                }
            }
            var node = this._events;
            var myArguments = arguments;
            for (var i = 0; i < arguments.length - 1; i++) {
                node.events.forEach(function (item) {
                    item(myArguments[myArguments.length - 1]);
                });
                if (typeof node.subevents[arguments[i]] == "undefined") {
                    return;
                }

                node = node.subevents[arguments[i]];
            }

            node.events.forEach(function (item) {
                item(myArguments[myArguments.length - 1]);
            });
    }
}
EventHandler.prototype.createEvent = function (data) {
    var newData = $.extend({}, data, { sender: this });
    return new MyEvent(newData);
}