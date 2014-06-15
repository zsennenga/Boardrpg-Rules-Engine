function Board() {
    this.board = {};
}

/**
 * Helper Class to track data for a given movement path
 */
function Path() {
    this.node = 0;
    this.previousNodes = [];
    this.length = 0;
}

/**
 * Helper function that checks if a node that we're thinking about visiting is the one that we just came from.
 * @param node
 * @param previous
 * @returns {Boolean}
 */
function checkWasLast(node, previous) {
    return node === previous[previous.length - 1];
}
/**
 * Checks that a path that a player wants to take exists and takes them to the specified location.
 * 
 * @param start
 * @param end
 * @param nodeList
 * @returns {Boolean}
 */
function validatePath(start, end, nodeList) {
    if (nodeList[0] !== start || nodeList[nodeList.length - 1] !== end) {
        return false;
    }
    for (var i = 1; i < nodeList.length - 1; i++) {
        var node = nodeList[i];
        var prevNode = nodeList[i-1];
        if (prevNode.connectedNodes.indexOf(node) === -1)  {
            return false;
        }
    }
    return true;
}
/**
 * Get all the moves possible from a given spot.
 * @param startId
 * @param distance
 * @param cb
 */
function getAllMoves(startId, distance, cb) {
    // Check that the types are correct. Should not happen often but it prevents crashes etc.
    if (typeof this.board[startId] !== 'Object') {
        cb('INVALID_BOARD_POS', null);
        return;
    } else if (typeof distance !== 'number' || distance % 1 === 0) {
        cb('DISTANCE_NOT_INT', null);
        return;
    }

    // Return Vars
    var returnPaths = [];

    // Setup the queue's first run
    var queue = [];
    var firsts = this.board[startId].connectedNodes;

    for (var i = 0; i < firsts.length; i++) {
        var path = new Path();
        path.node = firsts[i];
        queue.push(path);
    }

    while (queue.length !== 0) {
        // Get from queue
        var currentPath = queue.shift();
        // get the currentNode
        var currentNode = currentPath.node;
        // Get the set of connected nodes to our current node
        var nexts = this.board[currentNode].connectedNodes;

        // For each of the nodes connected to the current nodes
        for (var j = 0; j < nexts.length; j++) {
            // Avoid bouncing back and forth on two squares
            if (checkWasLast(nexts[j], currentPath.previousNodes)) {
                continue;
            }

            // Get the nodes previously visited by the currentPath
            // Add the currentNode to it
            var prevNodes = currentPath.previousNodes;
            prevNodes.push(currentNode);

            // Build the next path
            var newPath = new Path();
            newPath.node = nexts[j];
            newPath.length = currentPath.length + 1;
            newPath.previousNodes = prevNodes;

            // Handle end conditions
            if (newPath.length === distance) {
                var nodes = newPath.previousNodes;
                nodes.push(newPath.node);
                returnPaths.push(nodes);
            } else {
                queue.push(newPath);
            }
        }
    }

    cb(null, returnPaths);
}

module.exports = Board;