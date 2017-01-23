## 瀑布流的案例

一个简单的demo，为了练习一下瀑布流的做法，感觉是一种很有趣的布局。好像用css也可以做但这个是用js做的。

瀑布流比较麻烦的地方就是总是获取高度有问题，导致最新加载的图片会重叠到上一行，这里用了setTimeout延迟1秒钟显示解决这个问题，不知道还有没有别的做法。

不过感觉现在用瀑布流的网站也不多，我个人也更喜欢分页的显示方式，所以这个demo只是单纯的好奇才做着玩的。

## 实现思路

#### 布局部分

首先所有数据都是通过ajax发送到php文件，再从php文件读取json文件，php中通过接收到的参数确定需要哪些数据并将数据返回到页面中。通过一个按钮的点击事件加载数据。

获取到数据后就将其动态加载到html标签中，但是这时是隐藏的，这里使用一个setTimeout定时器，在里面延迟一下显示出来并且做瀑布流布局。

#### 瀑布流部分

遍历所有瀑布流的图片，先获取第一行的高度并赋值到一个数组中，因为是第一行所以top都是0，left值是前一个图片+间隔的值。
接着判断从第二行开始，每次都取出数组中的最小值作为当前图片的top值，left值可以根据这个最小值的索引获取到。
最后将这个图片的高度和数组最小值相加，得出新高度用作下次运算。并取得数组最高的值赋值给瀑布流容器的height属性。