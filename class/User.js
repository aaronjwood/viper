/**
 * User class constructor
 * @param {Object} userData
 * @returns {User}
 */
var User = function(userData) {
    this.userId = userData.userId;
    this.browser = userData.browserInfo.browser;
    this.screenWidth = userData.screenWidth;
    this.screenHeight = userData.screenHeight;
    this.os = userData.browserInfo.os;
};

/**
 * Takes the screen width and height and returns it as a resolution
 * @returns {String}
 */
User.prototype.getScreenResolution = function() {
    return this.screenWidth + "x" + this.screenHeight;
};

/**
 * Returns the operating system used by the user
 * @returns {String}
 */
User.prototype.getOs = function() {
    return this.os;
};

module.exports = User;