var User = function(userData) {
    this.id = userData.sessionId;
    this.browser = userData.browser;
    this.screenWidth = userData.screenWidth;
    this.screenHeight = userData.screenHeight;
};

User.prototype.getScreenResolution = function() {
	return this.screenWidth + "x" + this.screenHeight;
};

module.exports = User;