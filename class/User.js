var User = function(userData) {
	this.userId = userData.userId;
	this.browser = userData.browserInfo.browser;
	this.screenWidth = userData.screenWidth;
	this.screenHeight = userData.screenHeight;
	this.os = userData.browserInfo.os;
};

User.prototype.getScreenResolution = function() {
	return this.screenWidth + "x" + this.screenHeight;
};

User.prototype.getOs = function() {
	return this.os;
};

module.exports = User;