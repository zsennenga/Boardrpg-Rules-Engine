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

module.exports.tryParseJson = tryParseJson;