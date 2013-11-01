define(['streamhub-sdk/jquery', 'event-emitter'], function($, EventEmitter) {
    'use strict';
    
	/**
	 * A module to use for storing Content objects.
	 * @exports streamhub-sdk/storage
	 */
    var Storage = {
        cache: {}
    };
    EventEmitter.call(Storage);
    $.extend(Storage, EventEmitter.prototype);
    
    /**
     * Gets an object from storage, using sync or async
     * @param key {String} the key lookup
     * @param callback {?function} optional callback to fire in async mode
     * @returns the value at the specified key position
     */
    Storage.get = function(key, callback) {
        var result = this.cache[key];
        if (callback) {
            callback(result);
        } else {
            return result;
        }
    };

    /**
     * Sets an object to a key in storage, using sync or async
     * @param key {String} the key to store this under
     * @param value {Object} the value to store
     * @param callback {?function} optional callback to fire in async mode when complete
     */
    Storage.set = function(key, value, callback) {
        var obj = this.cache[key];
        
        if (obj) {
            this.emit('storage.change', obj, value);
            //obj.set(value)//TODO (joao) Doesn't work for children stored in array anyways.
        } else {
            this.emit('storage.add', value);
        }
        this.cache[key] = value;
        
        if (callback) {
            callback(value);
        } else {
            return value;
        }
    };

    return Storage;
});
