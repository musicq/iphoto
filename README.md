# iPhoto

iPhoto 是一个模仿 Mac 应用 iPhoto 写的一个 jquery 插件

![preview](https://github.com/musicq/iphoto/tree/master/demo/img/preview.png)

你可以按照自己喜欢的方式，把它应用在网站的任何位置，它是一种新的图片展示方式，相信会给用户一种眼前一亮的浏览体验。

## 使用方法

```javascript
$('#iphoto').iPhoto();
```

## 配置选项

- `MAX_WIDTH` 用来限制放大图片最大的宽度，默认 200px
- `MAX_HEIGHT` 用来限制放大图片的最大高度，默认 200px
- `MOUSEMOVE` {boolean} 是否使用 `mousemove` 事件来运行程序，默认需要鼠标按住运行程序
- `afterSelected` 在 鼠标点击 或者 鼠标抬起 时触发，它接收两个参数
    + `el` 当前元素的 jquery 对象
    + `index` 当前元素的索引，这个需要自己在生成图片时自己添加到 `data-index` 中

## 可使用的方法
有一些公共方法可供调用

#### 图片等比例缩放

```javascript
/**
* 图片等比例缩放
* @param {Number} width           需要进行等比例缩放图片的真实宽
* @param {Number} height          需要进行等比例缩放图片的真实高
* @param {Number} CUS_MAX_WIDTH  「可选」自定义缩放最大宽度，如 200，怎缩放最大宽度不超过 200px; 若不填，则默认为 MAX_WIDTH
* @param {Number} CUS_MAX_HEIGHT 「可选」自定义缩放最大高度，如 200，怎缩放最大高度不超过 200px; 若不填，则默认为 MAX_HEIGHT
* @returns {object} size          返回一个 object，包含有缩放后的宽和高
*/
$.fn.iPhoto.imgScale(width, height, CUS_MAX_WIDTH, CUS_MAX_HEIGHT);
```

#### 获取鼠标在页面上的位置
```javascript
/**
* [获取鼠标在页面上的位置] 「摘自网上」
* @param  {[event]}  e       [事件]
* @return {[object]} point   [x:鼠标在页面上的横向位置 y:鼠标在页面上的纵向位置]
*/
$.fn.iPhoto.getMousePoint(e);
```
#### 移除 pop 层
```javascript
$.fn.iPhoto.removeiphoto();
```

#### 弹出 pop 层

> 此函数的鼠标事件可以不用传入

```javascript
/**
* [弹出 pop 层]
* @param  {[object]} $target [目标元素的 jquery 对象]
* @param  {[string]} src     [图片源]
* @param  {[number]} z_w     [图片缩放后的宽度]
* @param  {[number]} z_h     [图片缩放后的高度]
* @param  {[event]} e        [传入鼠标事件]
*/
$.fn.iPhoto.iphotoPopUp($target, src, z_w, z_h, e);
```


---

你可以根据需要使用 iPhoto 插件完成一个小的 web 应用， 例如 [这里](http://musicq.github.io/demos/iphoto/index.html)。

你也可以克隆下这个 repo，在本地运行

```shell
    cd iPhoto && npm install #安装必要插件
    
    node server.js #启动服务器 http://localhost:3000
```


### 反馈
插件还有很多需要提升的地方，所以如果你是一个开发人员可以查看 `/dev`文件夹下的开发源码，对它进行修改，然后可以分享出来给大家，也可以直接在 [issues](https://github.com/musicq/iphoto/issues) 里面提出任何建议，我会及时改正。

Thanks！
