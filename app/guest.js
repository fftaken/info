window.onload = function() {
    let selectionDom = document.createElement('div');
    selectionDom.style.border = '1px dashed #000';
    selectionDom.style.position = 'absolute';
    selectionDom.style.cursor = 'pointer';
    selectionDom.style.pointerEvents = 'none';
    let selectBtn = document.createElement('div');
    selectBtn.style.position = 'absolute';
    selectBtn.style.border = '1px dashed #ccc';
    selectBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    selectBtn.style.color = '#fff';
    selectBtn.style.left = '0px';
    selectBtn.style.top = '-20px';
    selectBtn.style.width = '60px';
    selectBtn.style.overflow = 'hidden';
    selectBtn.style.height = '20px';
    selectBtn.style.lineHeight = '20px';
    selectBtn.style.fontSize = '12px';
    selectBtn.style.textAlign = 'center';
    selectBtn.style.pointerEvents = 'none';
    selectBtn.style.cursor = 'pointer';
    selectBtn.innerText = '点击选定';
    selectionDom.appendChild(selectBtn);
    document.querySelector('body').appendChild(selectionDom);
    let nodeList = document.querySelectorAll('*');
    nodeList.forEach(function(item, index) {
        if (item.innerText && item.innerText !== '' && item.innerText.length < 8) {
            item.addEventListener('mouseenter', function(event) {
                let target = event.currentTarget;
                let topPix = getTop(target);
                let leftPix = getLeft(target);
                if (topPix < 20) {
                    selectBtn.style.top = target.offsetHeight + 'px';
                } else {
                    selectBtn.style.top = '-20px';
                }
                selectionDom.style.left = leftPix + 'px';
                selectionDom.style.top = topPix + 'px';
                selectionDom.style.width = target.offsetWidth + 'px';
                selectionDom.style.height = target.offsetHeight + 'px';
                event.stopPropagation();
            });
            item.addEventListener('click', function(event) {
                let paths = event.path.reverse();
                let selectorPath = '';
                for (let i = 4; i < paths.length; i++) {
                    if (paths[i].id) {
                        selectorPath += ' #' + paths[i].id;
                    } else if (paths[i].classList.length > 0) {
                        selectorPath += ' .' + paths[i].classList[0];
                    } else if (i === paths.length -1) {
                        selectorPath += ' ' + paths[i].nodeName;
                    }
                }
                window.bridgeMessage007 = selectorPath;
                // window.parent.setContent(paths, event.currentTarget.innerText);
                event.stopPropagation();
            });
        }
    });
    
}
//获取元素的纵坐标（相对于窗口）
function getTop(e){
    var offset=e.offsetTop;
    if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
    return offset;
}
//获取元素的横坐标（相对于窗口）
function getLeft(e){
    var offset=e.offsetLeft;
    if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
    return offset;
}