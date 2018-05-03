// Load electron
const { ipcRenderer } = require('electron');
window.onload = () => {
    ipcRenderer.on('message', () => {
      console.log('Received a message');
    });

    let body = document.querySelector('body');
    let selectionDom = document.createElement('div');
    selectionDom.id = 'infoselection007';
    let selectBtn = document.createElement('div');
    selectBtn.id = 'infoselectionbtn007';
    selectBtn.innerText = '点击选定';
    selectionDom.appendChild(selectBtn);

    let scaleLevel = document.createElement('div');
    scaleLevel.classList.add('scale-level');
    scaleLevel.style.width = body.scrollWidth + 'px';

    let scaleVertical = document.createElement('div');
    scaleVertical.classList.add('scale-vertical');
    scaleVertical.style.height = body.scrollHeight + 'px';

    
    body.appendChild(selectionDom);
    body.appendChild(scaleLevel);
    body.appendChild(scaleVertical);
    let nodeList = document.querySelectorAll('*');

    nodeList.forEach(function(item, index) {
        if (item.innerText && item.innerText !== '' && item.innerText.length < 10) {
            item.style.cursor = 'pointer';
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
                scaleVertical.style.left = leftPix + 'px';
                selectionDom.style.top = topPix + 'px';
                scaleLevel.style.top = topPix + 'px';

                selectionDom.style.width = target.offsetWidth + 'px';
                scaleVertical.style.width = target.offsetWidth + 'px';
                selectionDom.style.height = target.offsetHeight + 'px';
                scaleLevel.style.height = target.offsetHeight + 'px';
                event.stopPropagation();
            });
            item.addEventListener('click', function(event) {
                let paths = event.path.reverse();
                console.log(paths);
                let selectorPath = '';
                for (let i = 4; i < paths.length; i++) {
                    let index = getIndex(paths[i]);
                    if (paths[i].id) {
                        selectorPath = '#' + paths[i].id;
                    } else if (paths[i].classList.length > 0) {
                        selectorPath += ' .' + paths[i].classList[0] + ( index > 1 ? ':nth-child(' + index + ')' : '');
                    } else {
                        selectorPath += ' ' + paths[i].nodeName +  ( index > 1 ? ':nth-child(' + index + ')' : '');
                    }
                }
                console.log(selectorPath);
                ipcRenderer.sendToHost(selectorPath);
                event.stopPropagation();
                event.preventDefault();
            });
        }
    });
}

//获取元素的纵坐标（相对于窗口）
function getTop(e){
    var offset=e.offsetTop;
    if(e.offsetParent!=null) {
        offset+= e.scrollTop;
        offset+=getTop(e.offsetParent);
    }
    return offset;
}
//获取元素的横坐标（相对于窗口）
function getLeft(e){
    var offset=e.offsetLeft;
    if(e.offsetParent!=null) {

        offset+= e.scrollLeft;
        offset+=getLeft(e.offsetParent);
    }
    return offset;
}

function getIndex(element, root, index) {
    let i = index || 1;
    // let u = root || element;
    let elementSibling = element.previousElementSibling;
    if (root) {
        i++
        if (elementSibling)
            return getIndex(elementSibling, root, i);
        else
            return i;
    } else {
        if (elementSibling)
            return getIndex(elementSibling, element, i);
        else
            return i;
    }
}
