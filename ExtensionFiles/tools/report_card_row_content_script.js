/** ***********************
**
** 将卡牌列在聊天栏里报一下
**
** ************************/

//statusBar
extensionTools.executeReady(ttaBoardInformation,ttaTranslation,function() {

	var card_row = $("div[id=\"card_row\"]").first();
	if (ttaBoardInformation.cardRow != undefined) {
	       card_row = ttaBoardInformation.cardRow;
	}
	
 if( ttaBoardInformation.config["chrome.bgo-extension.report-card-row"]!="true"){
  return;
}
	
	var lang = ttaBoardInformation.config["chrome.bgo-extension.translate-language"] ;
	var cards_str="BGOExtension(Website:git.io/vwg6t) report Cards in ["+lang+"]:";
	 var cardRowContent = [];
        if (card_row != undefined) {
            var card_row_cards = card_row.find("a");
            var j = 0;
            while (card_row_cards[j] != undefined) {
                if (card_row_cards[j].getAttribute("class").indexOf("carteEnMain") < 0) {
                    var cardA = $(card_row_cards[j]).find("p[class=\"nomCarte\"]")[0];
                    if (cardA != undefined) {
                        var ageTitle = $(card_row_cards[j]).find("p[class=\"ageCarte ageCarte1x\"]")[0];
                        if (ageTitle != undefined && ageTitle.innerHTML!=undefined) {
                            var card_name=ageTitle.innerHTML+" - "+ttaTranslation.getTranslatedText(cardA.innerHTML.substr(0, cardA.innerHTML.length - 4));
                            cardRowContent[cardRowContent.length] = card_name;
                            cards_str += " ["+card_name+"]";
                        }
                    } else {
                        cardA = cardA;
                    }
                }

                j++;
            }
        }
        
        //report the cards
        //get last message
        	var msg_form= $('div[class="plateau plateau0"]').find('form');
        	
        	var savedNote = msg_form.find("span[class=\"texte\"]");
		 for (var j=0;savedNote[j] != undefined;j++) {
		    var txt = savedNote[j].value
		    var convert = $("<p>" + txt + "</p>")
		    txt = convert[0].innerHTML;
		    savedNote[j].value = txt;
		}

        	
        	var table_msg= msg_form.find('table[class="tableau3"]');
        	var spans= table_msg.find('span[class="titre3"]');
        	var name = spans.first().text().toUpperCase();
        	if(ttaBoardInformation.playerName.toUpperCase() == name){
        	       spans= table_msg.find('span[class="texte"]');
        	       var last_msg = spans[1].innerHTML;
        	       if(last_msg.startsWith("BGOExtension")){
        	       	   return;
        	       }
        	}
        	
        	//post
            //var txt_box= msg_form.find('textarea[name="message"]')[0];
            var data_post = "maxPost="+msg_form.find('input[name="maxPost"]')[0].getAttribute("value");
            
            
		var tstr = cards_str;
		var bstr = '';
		for(i=0; i<tstr.length; i++)
		{
		if(tstr.charCodeAt(i)>127)
		{
		  bstr += '&#' + tstr.charCodeAt(i) + ';';
		}
		else
		{
		  bstr += tstr.charAt(i);
		}
		}
            
            data_post+="&message="+escape(bstr);
            
            $.ajax({
			 type: "POST",
			 url: msg_form[0].getAttribute("action"),
			 data: data_post,
			 success: function(msg){
			     var  re = /name=.maxPost.*?value=.(\S*?). .>/; 
			     var arrMactches = msg.match(re);
			     msg_form.find('input[name="maxPost"]')[0].setAttribute("value",arrMactches[1]);
			 }
	      });
            //msg_form.submit();
});