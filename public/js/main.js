//Return a random color from an array of specified colors
function colorPicker() {
	var colors = ["#ebb12b", "#ff9191", "#ffffff", "#75ff75", "#ffff00", "#b2b2b2"];
	return colors[Math.floor(Math.random()*6)];
}