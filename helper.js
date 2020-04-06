const fs = require('fs');

module.exports.loadVIPs = () => {
    let vips = []
    try {
        // read contents of the file
        const data = fs.readFileSync('vips.txt', 'UTF-8');
    
        // split the contents by new line
        const lines = data.split(/\r?\n/);
    
        // print all lines
        lines.forEach((line) => {
            vips.push(line.split(":")[0])
        });
    } catch (err) {
        console.error(err);
    }
    return vips
}

module.exports.loadTrackedIds = () => {
    let tracked = []
    try {
        // read contents of the file
        const data = fs.readFileSync('tracked.txt', 'UTF-8');
    
        // split the contents by new line
        const lines = data.split(/\r?\n/);
    
        // print all lines
        lines.forEach((line) => {
            tracked.push(line.split(":")[0])
        });
    } catch (err) {
        console.error(err);
    }
    return tracked
}

module.exports.loadGameIds = () => {
    let tracked = []
    try {
        // read contents of the file
        const data = fs.readFileSync('game_ids.txt', 'UTF-8');
    
        // split the contents by new line
        const lines = data.split(/\r?\n/);
    
        // print all lines
        lines.forEach((line) => {
            tracked.push(line.split(":")[0])
        });
    } catch (err) {
        console.error(err);
    }
    return tracked
}

