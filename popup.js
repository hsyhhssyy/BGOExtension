
document.addEventListener('DOMContentLoaded', function () {
	var data = chrome.extension.getBackgroundPage().bgoData;
	if(data.error){
		$("#message").text(data.error);
		$("#content").hide();
	}else{
		$("#message").hide();
		$("#content-player-name").text(data.playerName);
		$("#content-action-count").text(data.listbox);
		$("#content-player-no").text(data.playerNo);
		$("#content-message").text(data.message);
		$("#content-last-action").text(data.lastAction);
	}
});
