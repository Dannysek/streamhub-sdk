define([
    'streamhub-sdk/jquery',
    'event-emitter',
    'inherits'
], function($, EventEmitter, inherits) {
    'use strict';

    /**
     * A piece of Web Content
     * @param body {String|Object} A string of HTML, the Content body.
     *     If an object, it should have a .body property
     * @param [opt_id] {string} An id for this content. Preferably unique.
     * @fires Content#attachment
     * @fires Content#removeAttachment
     * @exports streamhub-sdk/content
     * @constructor
     */
    var Content = function(bodyOrObj, opt_id) {
        var body = bodyOrObj;
        var obj = {};
        EventEmitter.call(this);
        if (typeof bodyOrObj === 'object') {
            body = body.body;
            obj = bodyOrObj;
        }
        this.body = body;
        this.id = obj.id || opt_id || '0';//TODO (joao) Maybe Math.floor(Math.random() * 10000000);
        this.visibility = obj.visibility || obj.vis || 1;
        this.attachments = obj.attachments || [];
        this.replies = obj.replies || [];
    };
    inherits(Content, EventEmitter);

    /**
     * Attach an Oembed to the Content
     * @param obj {Oembed} An Oembed Content instance to attach
     * @fires Content#attachment
     */
    Content.prototype.addAttachment = function(obj) {
        this.attachments.push(obj);
        this.emit('attachment', obj);
    };

    /**
     * Remove an Oembed from the Content
     * @param obj {Oembed} An Oembed Content instance to attach
     * @fires Content#removeAttachment
     */
    Content.prototype.removeAttachment = function(obj) {
        this.attachments.splice(this.attachments.indexOf(obj), 1);
        this.emit('removeAttachment', obj);
    };

    /**
     * Add a reply to the Content
     * @param obj {Content} A piece of Content in reply to this one
     * @fires Content#addReply
     */
    Content.prototype.addReply = function(obj) {
        this.replies.push(obj);
        this.emit('reply', obj);
    };

    /**
     * Set some properties and emit 'change' and 'change:{property}' events
     * @param newProperties {Object} An object of properties to set on this Content
     * @fires Content#change
     * @fires Content#event:change:_property_
     */
    Content.prototype.set = function (newProperties) {
        newProperties = newProperties || {};
        var oldProperties = {};
        var oldVal, newVal, changed;
        for (var key in newProperties) {
            if (newProperties.hasOwnProperty(key)) {
                oldVal = oldProperties[key] = this[key];
                newVal = this[key] = newProperties[key];
                if (newVal !== oldVal) {
                    this.emit('change:'+key, newVal, oldVal);//Will emit 'change:visibility'
                    changed = true;
                }
            }
        }
        if (changed) {
            this.emit('change', newProperties, oldProperties);
            if (this.visibility === 0) {
                this.emit('removed');
            }
        }
    };

    return Content;
});
