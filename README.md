# BGOExtension

Index/目录:
[Introduce](https://github.com/hsyhhssyy/BGOExtension#bgoextension)
[How To Use](https://github.com/hsyhhssyy/BGOExtension#how-to-use)
[简介](https://github.com/hsyhhssyy/BGOExtension#bgoextension-1)
[安装与使用](https://github.com/hsyhhssyy/BGOExtension#如何使用)

## Version Update/版本更新说明
### 2016.02.25 2.1.0 
更新了汉化功能
修复了很多Bug
Introduced Chinese translations
Fixed a lot of bugs.

# BGOExtension

A Chrome extension for helping Boardgaming-Online website users.<br>
It automatically refresh the webpage.<br>
When it is your turn, it will raise sound alert and send desktop notifications.<br>
## How to use
1. Download ExtensionFiles.crx
2. Open Chrome menu -> Tools -> Extensions
3. drag the crx file in.
4. Open a game on BGO and enjoy.
5. Youdon't need to toggle auto refresh off when you take your actions. It will automatically stop, and will restart when you end your turn.
6. When you are on BGO website, an additional button will appear at the end of the address bar, click and you will find the configurations.<br>
![ConfigurationDemo](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/bgo-example1.jpg)
7. [Bug] [Can't fix due to BGO website structure] When you Reset Action Phase, you will receive a sound/notification alert if you choose to alert on `Your Turn`.<br>
![AlertDemo](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/bgo-example2.jpg)
8. [Bug] [Can't fix due to BGO website structure] The first and second turn of a game can't trigger sound alert and notifications.

##About the configuration
`Your Turn` means to alert when it is your turn to act, which include all situations that you have an action drop down list.<br>
`Action Update` means to alert your when some one have take an action after a webpage refresh. Since the refresh is time based, this alert can't accurately reflect every rival moves.<br>
`End of Game` means to alert you when game is scored and ended.<br>

# BGOExtension

提供自动刷新，让BGO能稍微有那么一点点实时性。<br>
在轮到你的时候停止刷新，并发出提示音和桌面提示。<br>
## 如何使用
1. 下载ExtensionFiles.crx
2. 打开Chrome的菜单->更多工具->扩展程序
3. 把下载的crx文件拖进去
4. 打开一个BGO游戏页面，插件会自动运行。
5. 当轮到你进行操作时，你不需要关闭自动刷新，他会自动停止。当你结束你的回合后，他会自动回复。
6. 当你在BGO页面上时，在地址栏末端，会多出一个小按钮，按一下便打开了设置。设置对所有BGO页面生效。<br>
![ConfigurationDemo](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/bgo-example1.jpg)
7. [Bug][由于BGO的原因无法解决]当你Reset Action Phase后，会收到`Your Turn`的语音或者桌面提示（如果你打开了）。<br>
![AlertDemo](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/bgo-example2.jpg)
8. [Bug][由于BGO的原因无法解决]游戏的第一和第二回合无法正常播放声音和提示。

##关于设置的说明
`Your Turn` 表示当轮到你操作时，进行提醒，这包括且仅包括任何出现Action下拉列表单的情况。<br>
`Action Update` 表示某次页面刷新后，在你的回合外，其他玩家进行了行动，由于刷新是定时的，因此该提醒不一定能准确反映玩家的每一步行动。<br>
`End of Game` 表示当游戏结束时并计分时，发送一个提醒。<br>

