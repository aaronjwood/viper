var User = function(userData) {
    this.id = userData.sessionId;
    this.browser = userData.browser;
    this.screenWidth = userData.screenWidth;
    this.screenHeight = userData.screenHeight;
    this.os = userData.os;
};

User.prototype.getScreenResolution = function() {
	return this.screenWidth + "x" + this.screenHeight;
};

User.prototype.getOs = function() {
	return this.os;
};

module.exports = User;