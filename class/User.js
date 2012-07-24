var User = function(id, browser, width, height) {
    this.id = id;
    this.browser = browser;
    this.screenWidth = width;
    this.screenHeight = height;
};

User.prototype.getScreenResolution = function() {
	return this.screenWidth + "x" + this.screenHeight;
};

module.exports = User;