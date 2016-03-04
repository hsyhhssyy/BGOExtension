# BGOExtension

<br>
一个增强BGO（[Boardgaming-Online](http://boardgaming-online.com/)）网站的扩展，为网页添加许多帮助玩家进行游戏的有用工具。<br>
包括自动刷新，并在轮到你的时候停止刷新，并发出提示音和桌面提示。<br>
除此之外，还汉化了整个BGO的页面。还包括许许多多的小工具，欢迎自由探索。<br>
[For English Readme, Click this link.](https://github.com/hsyhhssyy/BGOExtension/blob/master/README-enUS.md)<br>
<br>

2016-03-01 更新<br>
[2.1.9发布啦](https://github.com/hsyhhssyy/BGOExtension#21920160302)<br>
插件选项和统计工具也都支持中文啦。<br>
只要语言选择为简体中文，bgo上几乎没有布满英文的地方了。<br>

目录:<br>
1.  ------- [安装与使用](https://github.com/hsyhhssyy/BGOExtension#如何使用)<br>
2.  ------- [功能列表](https://github.com/hsyhhssyy/BGOExtension#功能列表)<br>
3.  ------- [数据统计功能](https://github.com/hsyhhssyy/BGOExtension#数据统计)<br>
4.  ------- [版本更新列表](https://github.com/hsyhhssyy/BGOExtension#版本更新说明)<br>

## 如何使用
1. [从Chrome应用商店安装](https://chrome.google.com/webstore/detail/bgo-auto-refresh/lmcmoogkhhaomncoipfgkonpabnihiff)<br>
2. 或者你在墙内的话，下载[插件文件](https://github.com/hsyhhssyy/BGOExtension/blob/master/ExtensionFiles.crx?raw=true)，然后打开Chrome的菜单->更多工具->扩展程序，再把下载的crx文件拖进去。<br>
3. 打开一个BGO游戏页面，插件会自动运行。<br>
4. 当你在BGO页面上时，在地址栏末端，会多出一个小按钮，按一下便打开了设置。设置对所有BGO页面生效。<br><br>
![插件设置](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-cfg-icon.jpg)<br>

## 功能列表

### 1. 全页面汉化功能
插件会自动汉化整个BGO页面，只需要你在语言选项里选择简体中文即可。<br>
![语言下拉单](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-language.jpg)<br>

### 2. 自动刷新功能
当轮到你进行操作时，你不需要关闭自动刷新，他会自动停止。当你结束你的回合后，他会自动继续开始刷新。<br>

### 3. 声音警告和桌面提示
当你启用了声音警告和桌面提示时，当指定的事件发生时，会弹出桌面通知和发出叮咚的声音。<br>
![弹窗设置](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-notification2.jpg)<br><br>
第一次弹出桌面通知时，Chrome会询问是否允许弹出桌面通知。<br>
![申请弹窗权限](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-notification1.jpg)<br><br>
弹出的桌面提示如下图，在Chrome不在前台的时候仍会弹出，可能会影响全屏游戏。<br>
![桌面通知](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/bgo-example2.jpg)<br>
<br>
**在这些选项里：**<br>
`你的回合` 表示当轮到你操作时，进行提醒，这包括且仅包括任何出现行动选项下拉列表单的情况。<br>
`发生任何行动` 表示某次页面刷新后，在你的回合外，其他玩家进行了行动，由于刷新是定时的，因此该提醒不一定能准确反映玩家的每一步行动。<br>
`游戏结束` 表示当游戏结束时并计分时，发送一个提醒。<br>
<br>
**已知的Bug：**<br>
[Bug]当你Reset Action Phase后，会收到`你的回合`的语音或者桌面提示（如果你打开了）。<br>
[Bug]游戏的第一和第二回合无法正常播放声音和提示。<br>

### 4. 高级卡牌列增强
启用高级卡牌列增强后，卡牌列会出现以下几个变化。<br>
1. 卡牌列末端，当前内政卡处，鼠标悬停会显示当前剩余内政卡。<br>
![剩余牌堆](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-advanced-card-row-1.jpg)<br>
由于网速的原因，这个窗口有时候并不会立即加载，你可能会看到Loading的字样，稍等片刻再指上去即可。<br>
注意这个剩余牌堆并不包含当前在卡牌列上的牌，与BGO提供的Discard Pile略有不同。<br>
有的时候，指上去会遇到Error的字样，这表示计算内政卡遇到了困难，需要到下个回合才能正确的显示。<br>
<br>
2. 除了你的面板外，其余玩家的面板上也会显示卡牌列，这样就可以方便的观察其他玩家的面板而不用来换切换。<br>
下面两个子选项就是用于微调该功能的。<br>
选项`在另一位玩家的面板上模拟下一回合的卡牌列`会使得另一位玩家的卡牌列自动模拟成下回合的状态。<br>
![模拟下个回合](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-advanced-card-row-2.jpg)<br>
[Bug]该功能有Bug，当你在本回合抓取并立刻打出一张科技牌时，这个模拟并不能正确的将这张牌除外。<br>
<br>
选项`在非当前行动的玩家的面板模拟下一回合的卡牌列`进一步微调该功能，现在会使得模拟卡牌列显示在非当前玩家的面板上，也就是说，假如你不是当前玩家，那么你的面板上显示的是模拟的下一回合卡牌列而不是当前卡牌列。<br>

### 5. 默认勾选结束回合
启用`默认勾选”勾选以确认结束回合”复选框`后，回合结束的复选框会自动被勾选上。<br>
![默认结束1](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-endturn2.jpg)<br>
选项`除非提示文本中包含警告信息`勾选后后，假如回合结束的提示框如下图一样有红字警告，那么结束回合复选框并不会自动被勾选上。<br>
![默认结束2](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-endturn1.jpg)<br>

### 6. 一些无法关闭的功能
下面是一些默认启用并且无法关闭的功能:<br>
1. 自己面板右下角的Save Notes本来是不能正确的存储中文的，现在可以了。<br>
![Note](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-save-note.jpg)<br>
<br>
2. 游戏中饥荒/腐败/战争/暴动的提示由横排变为竖排，并且指上去会有更详尽的提示。<br>
![状态栏](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-status-bar.png)<br>
<br>
3. 我的游戏（My games）页面现在被放到主面板的一个独立标签之中。这样就可以不用点击菜单就可以切换不同的游戏了。<br>
![我的游戏](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-mygame.jpg)<br>
<br>
4. 网页的标题被修改为显示局数 - 玩家 - BGO的模式，方便在标签多起来的时候分辨<br>
![标题栏](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-title.jpg)<br>
<br>
5. 玩家的名版上会用文字标注出玩家的颜色<br>
![玩家颜色](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-colorblind1.jpg)<br>
<br>
## 数据统计
数据统计是插件提供的一个辅助工具，点击插件设置页面下方工具箱中的“统计工具”按钮，即可打开统计工具页面。<br>
统计工具能够自动分析你的比赛历史，并给出许多统计结果。<br>
1. 统计工具仅支持英文ID，假如你是中文ID，你可以先临时改成英文ID，统计之后再改回来。<br>
2. 想要开始统计，首先确认显示的玩家名称，假如你想收集别人的比赛记录，也可以修改成别人的名称。之后点击上方的`列出比赛`按钮。<br>
3. 接下来，请耐心等待插件分析并列出所有的比赛，这个过程可能持续5-10分钟甚至更长，取决于你究竟打过多少比赛。<br>
4. 等到比赛全部列出，一个新的按钮`收集日志`出现在上方。在点击该按钮之前，请检查已经列出的比赛，将你不想要参与统计的比赛前面的复选框去掉。注意如果你想按照玩家人数筛选，那么上方提供了三个复选框统一操作，不需要你查看每场比赛并取消勾选具体的场次。<br>
![收集日志](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-statistics-1.jpg)<br>
<br>
5. 比赛日志会一场一场进行收集，收集过的场次底色会变红。注意就算你勾选了按照玩家人数筛选的复选框，这里仍然会收集日志，只不过在稍后统计的时候并不参与统计。<br>
6. 日志全部收集完成后，会出现`开始统计`按钮。在按下该按钮之前，首先请注意是否弹出玩家姓名选择面板。<br>
7. 假如弹出玩家姓名选择面板（如下图），则表明有一部分比赛的日志中没有以你当前玩家名称参与的玩家。这可能是因为你在该比赛之后改了名，或者你是中文ID临时改名来统计，亦或者是你创建了一局比赛你不在其中的比赛。这种情况下，请勾选上所有你曾经使用过的ID。<br>
![曾用名](https://github.com/hsyhhssyy/BGOExtension/blob/master/Demo/Readme/bgo-readme-image-statistics-2.jpg)<br>
8. 当你确认所有你曾经使用过的ID都被勾选，或者根本没有弹出姓名选择面板，你就可以点击`开始统计`按钮了。统计结果会以列表的形式展示在右侧。<br>
9. 其中`胜%(拿取)`项表明在所有拿了该牌的比赛中，你的总体胜率。`胜%(放过)`项表明在所有没有拿该牌的比赛中，你的总体胜率。这两个项目中，低于你总体平均胜率的单元格会被标注红底。高于你平均胜率的单元格会标注绿底。<br>
10. `拿取%` 的意义为拿取的局占总局数的百分比，与胜负无关。<br>
11. 在胜率计算时，负，平和投都记为负。<br>
12. 行动卡（黄牌）的统计是不准确的，因为他们可以多次拿取，而本统计工具中拿取的单位实际上不是“场”而是“张”。因此会造成黄牌有错误加权的问题。<br>

# 版本更新说明

###  2.1.9/2016.03.02
将统计工具页面汉化<br>
修复了汉化的一部分错误<br>
添加了玩家颜色指示器<br>
牌堆示加入了校验，假如计算出张数和显示剩余不符，会显示error从而不会误导玩家。<br>

###  2.1.8/2016.03.01
将插件的设置页面汉化<br>
修复了统计功能的一些bug<br>
修复了汉化的一部分错误<br>
加入了面板状态栏高级显示功能<br>

###  2.1.8/2016.03.01
修复了统计功能的一些bug<br>
修复了汉化的一部分错误<br>
我的游戏面板现在作为一个标签内置在其中<br>

###  2.1.6/2016.02.24
加入了统计功能<br>
修改了插件的名字，并修复了许多翻译的Bug<br>
注意在这个版本中，牌堆展示功能可能有错误，有些你已经获得的卡可能会出现在其中。<br>

###  2.1.3/2016.01.25
加入了显示下一轮卡牌列和剩余牌堆的功能。<br>
为新功能预留了设置选项<br>
修改默认刷新时间到30秒<br>
修复了很多Bug<br>
更新到了Chrome商店里<br>

###  2.1.0/2016.01.25
更新了汉化功能<br>
现在程序可以将BGO的UI，卡牌描述，行动选项等等全部汉化为中文
修复了很多Bug<br>
