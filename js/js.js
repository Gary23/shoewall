/**
 * Created by ypj on 2017/1/12.
 */
window.onload = function () {
    var main = document.getElementById('main');
    var btn = document.getElementById('btn');

    var parmes = {
        page: 1,
        pageSize: 8
    }

    //页面加载时默认先调用ajax数据,将数据按照waterfall('main', 'box');加载到页面

    ajax({
        url: 'php/demo.php',
        method: 'get',
        data: parmes,
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            parmes.page++;
            for (var i = 0; i < obj.length; i++) {
                createHtml(obj[i]);
            }
            setTimeout(function () {
                var classArr = getByClass(main, 'box');
                for (var i = 0; i < classArr.length; i++) {
                    classArr[i].style.visibility = 'visible'
                }
                waterfall('main', 'box');
            }, 100)
        }

    })

    var flag = true;
    btn.onclick = function () {
        if (flag == true) {

            console.log('触发滚动事件了');
            flag = false

            ajax({
                url: 'php/demo.php',
                method: 'get',
                data: parmes,
                async: true,
                success: function (data) {
                    var obj = JSON.parse(data);
                    if (obj.length < parmes.pageSize) {
                        parmes.page = 1;
                    } else {
                        parmes.page++;
                    }
                    for (var i = 0; i < obj.length; i++) {
                        createHtml(obj[i]);
                    }
                    setTimeout(function () {
                        var classArr = getByClass(main, 'box');
                        for (var i = 0; i < classArr.length; i++) {
                            classArr[i].style.visibility = 'visible'
                        }
                        waterfall('main', 'box');
                    }, 100)
                    flag = true
                }
            })


            //main.style.height = mainHeight() + 'px';
            //console.log();
        }
    }

}

// 瀑布流函数 传入父元素和嵌套图片的盒子
function waterfall(parent, box) {

    // 将所有box元素获取。
    var Parent = document.getElementById(parent);
    //console.log(Parent);
    var boxs = getByClass(Parent, box);
    //console.log(boxs);

    // 计算列数,版心宽度/box的宽度
    //var boxWidth = boxs[0].offsetWidth;  // 包含padding-left，所以不需要再单独取间距了,用margin就不能这么取了

    //var width = document.body.clientWidth || document.documentElement.clientWidth;

    // 列数
    //var cols = Math.floor(width / boxWidth);

    // main的宽度和居中
    //Parent.style.cssText = 'width:' + (boxWidth * cols) + 'px;margin:0 auto;'

    // 存放每一列高度
    var space = 15;
    var colHeight = [];
    for (var i = 0; i < boxs.length; i++) {
        if (i < 4) {
            boxs[i].style.top = 0;
            boxs[i].style.left = i * (boxs[i].offsetWidth + space) + 'px';
            colHeight.push(boxs[i].offsetHeight);
        } else {      // 到第二行了
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
            boxs[i].style.top = minHeight + 'px';
            boxs[i].style.left = minIndex * (boxs[i].offsetWidth + space) + 'px';

            colHeight[minIndex] += boxs[i].offsetHeight;   // 在数组中加上增加的这张图片的高度,重新计算数组中的行高,下一张图片再加到最短的那个下面
        }
    }

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

// 获取数组中最小值索引的函数
//function getMinIndex(arr, val) {
//    for (var i in arr) {
//        if (arr[i] == val) {
//            return i;
//        }
//    }
//}

//检测滚动条的位置
function checkScroll() {
    var Parent = document.getElementById('main');
    var boxs = getByClass(Parent, 'box');
    var top = document.getElementById('top')
    //var lastBox = boxs[boxs.length - 1].offsetTop + Math.floor(boxs[boxs.length - 1].offsetHeight / 2);
    var lastBox = boxs[boxs.length - 1].offsetTop + Math.floor(boxs[boxs.length - 1].offsetHeight) + top.offsetHeight;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var height = document.documentElement.clientHeight || document.body.clientHeight;
    //console.log(lastBox + '<' + (Math.floor(height + scrollTop) + 5));
    //console.log('scrollTop:' + scrollTop + 'height:' + height);
    //console.log('offsetTop:' + boxs[boxs.length - 1].offsetTop + 'offsetHeight:' + Math.floor(boxs[boxs.length - 1].offsetHeight) + 'top' + top.offsetHeight);
    return (lastBox < Math.floor(height + scrollTop) + 5) && (Math.floor(height + scrollTop) + 5 - lastBox < 10) ? true : false;
}




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






















