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
    for (var i = 0; i < params.length; i++) {
        if (!(params[i] in data)) {
            return false;
        }
    }

    return true;
}
module.exports.execute = execute;