function getExclusions(values) {
    var exclusions = [];
    if(!values.docs) {
        exclusions.push('docs');
    }
    return exclusions;
}

module.exports = getExclusions;
