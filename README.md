# iPhoto

iPhoto 是一个模仿 Mac 应用 iPhoto 写的一个 jquery 插件

![preview](https://github.com/musicq/iphoto/blob/master/demo/img/preview.png)

你可以按照自己喜欢的方式，把它应用在网站的任何位置，它是一种新的图片展示方式，相信会给用户一种眼前一亮的浏览体验。

## 使用方法

```javascript
$('#iphoto').iPhoto();
```

## 配置选项

- `MAX_WIDTH` 用来限制放大图片最大的宽度，默认 200px
- `MAX_HEIGHT` 用来限制放大图片的最大高度，默认 200px
- `MOUSEMOVE` 定义一个鼠标事件，是否使用 mousemove 事件来运行程序，默认需要鼠标按住运行程序
- `afterSelected` 在 鼠标点击 或者 鼠标抬起 时触发，它接收两个参数
    + `el` 当前元素的 jquery 对象
    + `index` 当前元素的索引，这个需要自己在生成图片时自己添加到 `data-index` 中

---


 你可以根据需要使用这个完成一个小的 web 应用， 例如 [这里](http://localhost:4000/demos/iphoto/index.html)，示例代码可以克隆下这个 repo，然后运行
 ```shell
 npm install
 node server.js
 ```
