# div2img
Convert all the contents of the div element into a picture including SVG and canvas elements, just using javaScript.
<br>
<br>转换页面元素为<strong>canvas</strong>，并支持<strong>下载</strong>。
<h3>依赖的开源库（Depended on libraries）：</h3>
<p>html2canvas: https://github.com/niklasvh/html2canvas</p>
<p>SVG2Bitmap: https://github.com/Kaiido/SVG2Bitmap</p>

<h3>使用方法（Usage）：</h3>
  <pre>div2img(options);</pre>
  <p>方法返回一个转换之后的canvas的DOM对象，故也可以声明一个变量来接收该对象：</p>
  <pre>var canvas = div2img(options);</pre>
  <p>其中options为配置选项对象，定义如下。</p>
<h3>配置项（Options）：</h3>
  <pre>var options = {
    id: 'divid',              // 页面元素id（container id）
    name: 'imgName',          // 保存图片的名字（image name）
    backgroundColor: '#f00',  // 背景颜色，只有在页面元素有透明元素或不能完全覆盖背景时可见(background color)
    download: true            // 是否下载，默认false不下载(download or not)
}</pre>

<h3>演示（Demo）</h3>
  http://liuxinlei.com/works/div2img/demo/
