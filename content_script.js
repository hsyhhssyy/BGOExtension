var playerColors=["Unknown","Orange","Purple","Green","Red"];
//get current player
var combo = $("form[id=\"formAction\"]");
var boardInfo = $("div").first();
var msg = {
	type: "bgo-board-information",
	playerName:$("span[class=\"nom\"]").text().replace(/\s/g," "),
	rivals:[],
	message : $("td[class=\"titre3\"]").first().text(),
	lastAction:$("td[class=\"titreNote\"]").first().text(),
	listbox: combo.length,
	url: document.URL
};

//find player list
var player_name_table = $("table[class=\"tableau0\"]")[1];
player_name_table=$(player_name_table);
var player_names = player_name_table.find("ul[id=\"indJoueur\"]");
var i=0;
while(player_names[i] != undefined){
	var name = $(player_names[i]).find("li").contents().get(0).nodeValue;
	
	if(name.valueOf()  == msg.playerName.valueOf() ){
		msg.playerNo= i/2+1;
	}else{
		if(name.valueOf() != "Journal" 
		&& name.valueOf() != "Chat"
		&& (!name.valueOf().endsWith(" "))){
			msg.rivals.push(name);
		}
	}
	i++;
}

//Copy deck row to everyone's panel
if(card_row == undefined){
	var card_row = $("div[id=\"card_row\"]");
	var card_tr=$("<tr></tr>");
	var card_td=$("<td colspan=\"2\"></td>");
	card_td.append(card_row.clone(true));
	card_tr.append(card_td.clone(true));
	var player2table=$("div[id=\"Plateau"+(3-msg.playerNo)+"\"]").first().find("table").first().find("tbody").first();
	player2table.prepend(card_tr.clone(true))
}

//send the package
chrome.runtime.sendMessage(msg);

function jumpurl(){  
  location=document.URL;  
} 

if(msg.listbox == 0){
	if(msg.message){
		setTimeout('jumpurl()',3000);  
	}
}else{
	var notificate = false;
	//Events that will trigger alert
	if(msg.message.startsWith("Political Phase")||
	msg.message.startsWith("Aggression")||
	msg.message.startsWith("Colonize")||
	msg.message.startsWith("Send Colonists")||
	msg.message.startsWith("Event")
	){
		notificate = true;
	}
	
	if(msg.message.startsWith("Action")){
		if(msg.lastAction!=""
		&& (!msg.lastAction.startsWith(playerColors[msg.playerNo]))){
			notificate = true;
		}
	}
	
	if(notificate == true){
		if(beep == undefined){
			var beep = (function() {
	    			var audioElement = document.createElement('audio');
	    			audioElement.setAttribute("src", chrome.extension.getURL("Alert-08.m4a"));
	    			audioElement.play();
			});
			beep();
			if (Notification) {
				if (Notification.permission=="granted") {
					var n_options = {
	      				body: 'Your rival ['+msg.rivals[0]+"] is waiting for you.",
	      				icon: chrome.extension.getURL("favicon.ico")
	  				}
	             		var notification = new Notification('BGO Ready', n_options);
	             		
	             		setTimeout(notification.close.bind(notification), 5000); 
	       		} else if(Notification.permission=="default"){
	         			Notification.requestPermission();
	       		}
	   		}
		}
	}
}