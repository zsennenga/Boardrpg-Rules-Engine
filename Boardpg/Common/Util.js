function tryParseJson(data) {
    var out = false;
    try {
        data = JSON.parse(data);
    } catch (e) {
        var givenData = {};
        givenData.gD = data;
        data = givenData;
    }
    return data;
}

function format(code, data) {
    var ret = {};
    ret.code = code;
    ret.data = data;
    return ret;
}

module.exports.tryParseJson = tryParseJson;
module.exports.format = format;