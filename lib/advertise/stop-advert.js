'use strict'

var adverts = require('../adverts')
var broadcastAdvert = require('./broadcast-advert')
var notify = require('../commands/notify')

const stopAdvert = (ssdp, plumbing, advert) => {
    clearTimeout(plumbing.timeout)

    // remove advert from list
    var index = adverts.indexOf(advert)
    adverts.splice(index, 1)

    broadcastAdvert(ssdp, advert, notify.BYEBYE);           //trigger broadcast

    var shutdown;

    if (plumbing.shutDownServers) {
        shutdown = Promise.all([
            plumbing.shutDownServers(),
            new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 1000);
            })]
        );
    }
    else {
        shutdown = new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, 1000);
        }); // when we are being hosted by express, etc, don't shut the server down here.
    }

    return shutdown;
}

module.exports = stopAdvert
