define([
    'inherits',
    'stream/transform',
    'streamhub-sdk/debug'],
function (inherits, Transform, debug) {
    var log = debug('streamhub-sdk/streams/more');


    /**
     * A Duplex stream (Readable & Writable) that only passes through
     * the number of items it is instructed to.
     * @constructor
     * @param opts {object}
     * @param [opts.goal=0] {number} The initial amount to let through
     */
    function More (opts) {
        opts = opts || {};
        this._goal = opts.goal || 0;
        Transform.call(this, opts);
    }

    inherits(More, Transform);


    /**
     * @private
     * Required by Transform subclasses.
     * This ensures that once the goal is reached, no more content
     * passes through.
     */
    More.prototype._transform = function (chunk, requestMore) {
        log('_transform', chunk);
        if (this._goal <= 0) {
            this._requestMoreWrites = requestMore;
            return;
        }
        this._goal--;
        this.push(chunk);
        requestMore();
    };


    /**
     * Let more items pass through.
     * This sets the goal of the stream to the provided number.
     * @param newGoal {number} The number of items this stream should
     *     let through before holding again.
     */
    More.prototype.get = function (newGoal) {
        var requestMore = this._requestMoreWrites;

        this._goal = newGoal;
        if (typeof requestMore === 'function') {
            this._requestMoreWrites = null;
            requestMore();
        }
    };


    return More
});