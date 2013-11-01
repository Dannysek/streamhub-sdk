define(function() {
    'use strict';
    
    var Enums = {};
    
    /**
     * Enumeration of visibility states.
     * @readonly
     * @enum {number}
     * @memberof SimpleClass
     */
    Enums.VISIBILITY = {
        NONE: 0,
        EVERYONE: 1,
        OWNER: 2,
        GROUP: 3
    };

    return Enums;
});
