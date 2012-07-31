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
	var os = this.os.match(/Win|Mac|UNIX|Linux/gi);
	if(os == "Win") {
		return "Windows";
	}
	else if(os == "Mac") {
		return "Mac";
	}
	else if(os == "UNIX") {
		return "Unix";
	}
	else if(os == "Linux") {
		return "Linux";
	}
	else {
		return "Other";
	}
};

module.exports = User;