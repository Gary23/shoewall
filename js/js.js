/**
 * Created by ypj on 2017/1/12.
 */
window.onload = function () {
    // 初始化用到的变量
    var main = document.getElementById('main');
    var btn = document.getElementById('btn');

    // 用作保存页数和每次加载多少数据
    var parmes = {
        page: 1,
        pageSize: 8
    }

    // 首先发送ajax获取刚打开网页默认显示的数据
    ajax({
        url: 'php/demo.php',
        method: 'get',
        data: parmes,   // 将获取多少数据和页数发送到php，php获取后根据页数和数据长度截取json数据并返回
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            parmes.page++;      // 每次需要增加page,这样下一次获取的就是第二页的内容
            for (var i = 0; i < obj.length; i++) {
                createHtml(obj[i]);     // 动态添加到html标签中
            }
            setTimeout(function () {        // 这里延迟100毫秒显示是为了等待上面函数执行完毕,完全获取完高度再执行瀑布流,否则会重叠
                var classArr = getByClass(main, 'box');
                for (var i = 0; i < classArr.length; i++) {
                    classArr[i].style.visibility = 'visible'
                }
                waterfall('main', 'box');   // 执行瀑布流布局
            }, 100)
        }
    })

    // 点击按钮继续加载，falg是为了让按钮按下后，如果没有加载完数据再点击也是无效的
    var flag = true;
    btn.onclick = function () {
        btn.innerHTML = '加载中...'
        if (flag == true) {
            flag = false
            ajax({
                url: 'php/demo.php',
                method: 'get',
                data: parmes,
                async: true,
                success: function (data) {
                    var obj = JSON.parse(data);
                    if (obj.length < parmes.pageSize) {     // 这里让页数做了循环，加载完数据就再循环到第一页
                        parmes.page = 1;
                    } else {
                        parmes.page++;
                    }
                    for (var i = 0; i < obj.length; i++) {
                        createHtml(obj[i]);
                    }
                    setTimeout(function () {        // 这里由开始的100毫秒增加为1000毫秒

                        var classArr = getByClass(main, 'box');
                        for (var i = 0; i < classArr.length; i++) {
                            classArr[i].style.visibility = 'visible'
                        }
                        btn.innerHTML = '继续加载'
                        waterfall('main', 'box');
                        flag = true
                    }, 1000)
                }
            })
        }
    }

}

// 瀑布流函数 传入父元素和嵌套图片的盒子
// 如果有四列数据，那么将每列的数据用数组保存，每次添加时就去检测数组中最小的数组，这个就是新图片的top值。依次类推。
function waterfall(parent, box) {

    // 将所有box元素获取。
    var Parent = document.getElementById(parent);
    var boxs = getByClass(Parent, box);
    //console.log(boxs);

    // 计算列数,版心宽度/box的宽度
    //var boxWidth = boxs[0].offsetWidth;  // 包含padding-left，所以不需要再单独取间距了,用margin就不能这么取了

    //var width = document.body.clientWidth || document.documentElement.clientWidth;

    // 列数
    //var cols = Math.floor(width / boxWidth);

    // main的宽度和居中
    //Parent.style.cssText = 'width:' + (boxWidth * cols) + 'px;margin:0 auto;'

    //图片间隔
    var space = 15;
    // 存放每一列高度
    var colHeight = [];
    for (var i = 0; i < boxs.length; i++) {
        if (i < 4) {    // 最开始的四列
            boxs[i].style.top = 0;
            boxs[i].style.left = i * (boxs[i].offsetWidth + space) + 'px';      // left就是前面的图片+间隔
            colHeight.push(boxs[i].offsetHeight);
        } else {      // 到第二行了

            // 以下是便利出数组中的最小值和最小值的索引。
            var minHeight = colHeight[0];
            var minIndex = 0;
            for (var k = 0; k < colHeight.length; k++) {
                if (minHeight > colHeight[k]) {
                    minHeight = colHeight[k];
                    minIndex = k;
                }
            }
            // var minHeight = Math.min.apply(null, colHeight); // 求出最小值,第二行的第一个要存在第一行最短的图片下
            // var index = getMinIndex(colHeight, minHeight); // 最小值的索引
            // boxs[i].style.position = 'absolute';
            // boxs[i].style.top = minHeight + 'px';
            // boxs[i].style.left = boxs[index].offsetLeft + 'px';

            boxs[i].style.top = minHeight + 'px';       //第二行开始图片的top都是获取到数组中最小的那个值
            boxs[i].style.left = minIndex * (boxs[i].offsetWidth + space) + 'px';       // left就是那个最小值的left
            colHeight[minIndex] += boxs[i].offsetHeight;   // 在数组中加上增加的这张图片的高度,重新计算数组中的行高,下一张图片再加到最短的那个下面
        }
    }

    // 便利得出最大的高度，并将该数值赋值给整个瀑布流容器的height值
    var maxHeight = colHeight[0];
    for (var i = 0; i < colHeight.length; i++) {
        if (maxHeight < colHeight[i]) {
            maxHeight = colHeight[i];
        }
    }

    Parent.style.height = maxHeight + 'px';
}


// 获取类名的函数
function getByClass(parent, className) {
    var classArr = [];
    var elems = parent.getElementsByTagName('*');
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].className == className) {
            classArr.push(elems[i]);
        }
    }
    return classArr;
}



//检测滚动条的位置
//function checkScroll() {
//    var Parent = document.getElementById('main');
//    var boxs = getByClass(Parent, 'box');
//    var top = document.getElementById('top')
//    //var lastBox = boxs[boxs.length - 1].offsetTop + Math.floor(boxs[boxs.length - 1].offsetHeight / 2);
//    var lastBox = boxs[boxs.length - 1].offsetTop + Math.floor(boxs[boxs.length - 1].offsetHeight) + top.offsetHeight;
//    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//    var height = document.documentElement.clientHeight || document.body.clientHeight;
//    //console.log(lastBox + '<' + (Math.floor(height + scrollTop) + 5));
//    //console.log('scrollTop:' + scrollTop + 'height:' + height);
//    //console.log('offsetTop:' + boxs[boxs.length - 1].offsetTop + 'offsetHeight:' + Math.floor(boxs[boxs.length - 1].offsetHeight) + 'top' + top.offsetHeight);
//    return (lastBox < Math.floor(height + scrollTop) + 5) && (Math.floor(height + scrollTop) + 5 - lastBox < 10) ? true : false;
//}



// 将ajax获取到的内容动态添加到html标签中。
function createHtml(obj) {

    var img = document.createElement('img');
    img.src = './img/' + obj.src;

    var content = document.createElement('div');
    content.className = 'content';

    var h4 = document.createElement('h4');
    h4.innerHTML = obj.name;

    var p = document.createElement('p');
    p.innerHTML = obj.content;

    var pic = document.createElement('div');
    pic.className = 'pic';

    var box = document.createElement('div');
    var main = document.getElementById('main');
    box.className = 'box';


    pic.appendChild(img)

    content.appendChild(h4);

    content.appendChild(p);

    box.appendChild(pic);

    box.appendChild(content);

    main.appendChild(box);


}






















