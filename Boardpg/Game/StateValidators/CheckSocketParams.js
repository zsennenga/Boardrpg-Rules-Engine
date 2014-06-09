/**
 * Check that the data array has all the fields necessary
 * 
 * @param params
 * @param data
 * @returns {Boolean}
 */
function execute(params, data) {
    if (params.length === 0) {
        return true;
    }
    for ( var param in params) {
        if (!(param in data)) {
            return false;
        }
    }

    return true;
}
module.exports.execute = execute;