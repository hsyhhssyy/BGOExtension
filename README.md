# BGOExtension

<br>
A Chrome extension for helping Boardgaming-Online website users.<br>
It added many usful tools and functions to the website.<br>
一个增强BGO（Boardgaming-Online）网站的扩展，为网页添加许多帮助玩家进行游戏的有用工具<br>
<br>

2016-02-18<br>
[2.1.3 Released./2.1.3发布啦](https://github.com/hsyhhssyy/BGOExtension#21320160225)<br>
<br>

Index / 目录:<br>
1.  ------- [Introduce](https://github.com/hsyhhssyy/BGOExtension#bgoextension-1)<br>
2.  ------- [How To Use](https://github.com/hsyhhssyy/BGOExtension#how-to-use)<br>
3.  ------- [简介](https://github.com/hsyhhssyy/BGOExtension#bgoextension-2)<br>
4.  ------- [安装与使用](https://github.com/hsyhhssyy/BGOExtension#如何使用)<br>
5.  ------- [Bugs/已知的Bug](https://github.com/hsyhhssyy/BGOExtension#bugs已知的bug)<br>
6.  ------- [Updates/版本更新列表](https://github.com/hsyhhssyy/BGOExtension#versionupdate版本更新说明)<br>

# BGOExtension

A Chrome extension for helping Boardgaming-Online website users.<br>
It automatically refresh the webpage.<br>
When it is your turn, it will raise sound alert and send desktop notifications.<br>
## How to use
1.[Install From Chrome Web Store](https://chrome.google.com/webstore/detail/bgo-auto-refresh/lmcmoogkhhaomncoipfgkonpabnihiff)<br>
2. Open a game on BGO and enjoy.<br>
3. You don't need to toggle auto refresh off when you take your actions. It will automatically stop, and will restart when you end your turn.<br>
![AlertDemo](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/bgo-example2.jpg)<br>
4. When you are on BGO website, an additional button will appear at the end of the address bar, click and you will find the configurations.<br>
![ConfigurationDemo](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/bgo-example1.jpg)<br>

##About the configuration
`Your Turn` means to alert when it is your turn to act, which include all situations that you have an action drop down list.<br>
`Action Update` means to alert your when some one have take an action after a webpage refresh. Since the refresh is time based, this alert can't accurately reflect every rival moves.<br>
`End of Game` means to alert you when game is scored and ended.<br>

# BGOExtension

一个增强BGO（Boardgaming-Online）网站的扩展，为网页添加许多帮助玩家进行游戏的有用工具。<br>
包括自动刷新，并在轮到你的时候停止刷新，并发出提示音和桌面提示。<br>
除此之外，还汉化了整个BGO的页面。还包括许许多多的小工具，欢迎自由探索。<br>

## 如何使用
1. [从Chrome应用商店安装](https://chrome.google.com/webstore/detail/bgo-auto-refresh/lmcmoogkhhaomncoipfgkonpabnihiff)<br>
2. 或者你在墙内的话，下载[插件文件](https://github.com/hsyhhssyy/BGOExtension/blob/master/ExtensionFiles.crx?raw=true)，然后打开Chrome的菜单->更多工具->扩展程序，再把下载的crx文件拖进去。<br>
3. 打开一个BGO游戏页面，插件会自动运行。<br>
4. 当轮到你进行操作时，你不需要关闭自动刷新，他会自动停止。当你结束你的回合后，他会自动回复。<br>
![AlertDemo](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/bgo-example2.jpg)<br>
5. 当你在BGO页面上时，在地址栏末端，会多出一个小按钮，按一下便打开了设置。设置对所有BGO页面生效。<br>
![ConfigurationDemo](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/bgo-example1.jpg)<br>


##关于设置的说明
`Your Turn` 表示当轮到你操作时，进行提醒，这包括且仅包括任何出现Action下拉列表单的情况。<br>
`Action Update` 表示某次页面刷新后，在你的回合外，其他玩家进行了行动，由于刷新是定时的，因此该提醒不一定能准确反映玩家的每一步行动。<br>
`End of Game` 表示当游戏结束时并计分时，发送一个提醒。<br>

#Bugs/已知的Bug
Unfixable bug/无法修复的Bug：<br>
<br>
[Bug] [Can't fix due to BGO website structure] When you Reset Action Phase, you will receive a sound/notification alert if you choose to alert on `Your Turn`.<br>
[Bug][由于BGO的原因无法解决]当你Reset Action Phase后，会收到`Your Turn`的语音或者桌面提示（如果你打开了）。<br>
<br>
[Bug] [Can't fix due to BGO website structure] The first and second turn of a game can't trigger sound alert and notifications.<br>
[Bug][由于BGO的原因无法解决]游戏的第一和第二回合无法正常播放声音和提示。<br>

#VersionUpdate/版本更新说明

###  2.1.3/2016.02.25
加入了显示下一轮卡牌列和剩余牌堆的功能。<br>
为新功能预留了设置选项<br>
修改默认刷新时间到30秒<br>
修复了很多Bug<br>
更新到了Chrome商店里<br>

###  2.1.0/2016.02.25
更新了汉化功能<br>
现在程序可以将BGO的UI，卡牌描述，行动选项等等全部汉化为中文
修复了很多Bug<br>