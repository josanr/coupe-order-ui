/**
 * Created by ruslan on 21.01.2016.
 */

'use strict';

const Menu = function(parent, node, menu){

    this.node = node;
    this.menuStruct = menu;
    this.parent = parent;

    let html;

    html = [
        '<ul id="sideMenu" style="border-radius: 4px;font-size: 12px; position: absolute; background: #fff; display:none" class="nav nav-tabs nav-stacked">',


        '</ul>',
    ].join("\n");
    this.conMenu = $(html).appendTo('body');
    this.activeId = null;
    this.insertsMod = $('#doorInsertMod');
    this.sizeMod = $('#sizesPopMod');
    this.doorWidthMod = $('#doorWidthMod');

    this.activeDivType = null;
    this.updateEv = new Event('menuUpdated', {
        bubbles: true,
        cancelable: true,
    });
    this.resetEv = new Event('menuReset', {
        bubbles: true,
        cancelable: true,
    });

    this.node.querySelector('.pheight').value = 2600;
    this.node.querySelector('.pwidth').value = 3200;




    html = '';
    for (let x in this.menuStruct) {
        let mItem = this.menuStruct[x];
        html +='<option value="' + x + '" data-var="' + mItem['variable'] + '" data-insert="' + mItem['insertDiff'] + '" data-horiz="' + mItem['horizDiff'] + '">' + mItem['name'] + '</option>';
    }
    this.node.querySelector('.gpType').innerHTML = html;



    this.activeDiv = function(){
        return this.activeDivType;
    };


    this.type = function (s) {
        if (s !== undefined) {
            this.node.querySelector('.gpType').value = s
        } else {
            return this.node.querySelector('.gpType').value;
        }
    };

    this.color = function (s) {
        let colorHolder = this.node.querySelector('.gpColor');
        if (s !== undefined) {
            colorHolder.value = s;
        } else {
            return colorHolder.value;
        }
    };

    this.divType = function (s) {
        let divType = this.node.querySelector('.divType');
        if (s !== undefined) {
            divType.value = s;
        } else {
            return divType.value;
        }
    };

    this.dov = function (s) {
        let dov = this.node.querySelector('.dov');
        if (s !== undefined) {
            dov.checked = s;
        } else {
            return dov.checked;
        }
    };
    this.stub = function (s) {
        let stub = this.node.querySelector('.stub');
        if (s !== undefined) {
            stub.checked = s;
        } else {
            return stub.checked;
        }
    };

    this.picture = function (s) {
        let picture = this.node.querySelector('.picture');
        if (s !== undefined) {
            picture.checked = s;
        } else {
            return picture.checked;
        }
    };

    this.height = function (s) {
        let pheight = this.node.querySelector('.pheight');
        if (s !== undefined) {
            pheight.value = s;
        } else {
            return pheight.value;
        }
    };
    this.width = function (s) {
        let pwidth = this.node.querySelector('.pwidth');
        if (s !== undefined) {
            pwidth.value = s;

        } else {
            return pwidth.value;
        }
    };

    this.numDoors = function (s) {
        let numDoors = this.node.querySelector('.numDoors');
        if (s !== undefined) {
            numDoors.value = s;
        } else {
            return numDoors.value;
        }
    };

    this.isChecker = function(){
        let opt = this.node.querySelector('.numDoors');
        return opt.options[opt.selectedIndex].getAttribute('data-checker')
    };

    this.varWidth = function () {
        let opt = this.node.querySelector('.gpType');
        return opt.options[opt.selectedIndex].getAttribute('data-var');

    };
    this.insertVar = function () {
        let opt = this.node.querySelector('.gpType');
        return opt.options[opt.selectedIndex].getAttribute('data-insert');
    };
    this.horizVar = function () {
        let opt = this.node.querySelector('.gpType');
        return opt.options[opt.selectedIndex].getAttribute('data-horiz');
    };




};

Menu.prototype.init = function(){
    this.calcNumDoors();
    this.node.addEventListener('click', this.clickEventHandler.bind(this));
    this.node.addEventListener('change', this.changeEventHandler.bind(this));
    this.node.addEventListener('keyup', this.keyupEventHandler.bind(this));
    this.node.querySelector('.gpType').dispatchEvent(new Event('change', {bubbles: true}));

    document.getElementById('save').addEventListener('click', this.saveOrder.bind(this));
    document.getElementById('reset').addEventListener('click', this.resetOrder.bind(this));
    document.addEventListener('click', this.menusOff.bind(this));

    this.conMenu[0].addEventListener('click', this.conMenuEventHandler.bind(this));

    this.sizeMod[0].addEventListener('click', this.changeSizeHandler.bind(this));
    this.sizeMod[0].addEventListener('keyup', this.changeSizeHandler.bind(this));

    this.doorWidthMod[0].addEventListener('click', this.changeDoorWidthHandler.bind(this));
    this.doorWidthMod[0].addEventListener('keyup', this.changeDoorWidthHandler.bind(this));

    this.insertsMod[0].addEventListener('click', this.changeInsertHandler.bind(this));
    this.insertsMod[0].addEventListener('dblclick', this.changeInsertHandler.bind(this));

    this.parent.container.on('contextmenu dblclick', this.handleContextmenuEvent.bind(this));
};


Menu.prototype.handleContextmenuEvent = function(e){
    if (e.target.localName === 'rect') {
        let ar = this.parent.getAreaByRaphId(e.target.raphaelid);
        let div = this.parent.getDivByRaphId(e.target.raphaelid);

        if (ar || div) {
            e.preventDefault();
            e.stopPropagation();

            if (ar) {
                if(e.type === 'dblclick'){
                    this.activeId = e.target.raphaelid;
                    this.insertsMod.modal('show');
                    return true;
                }
                this.contextMenu(e, 'area', e.target.raphaelid);
            } else {
                this.contextMenu(e, 'div', e.target.raphaelid);

            }
        } else {
            return false;
        }
    }
};

Menu.prototype.conMenuEventHandler = function(e){
    e.preventDefault();
    if(e.target.tagName === 'A'){
        let item = e.target;
        if(item.classList.contains('menuSize')){

            let ar = this.parent.getAreaByRaphId(this.activeId);
            this.sizeMod.find('.manualHeight').val(ar.height.toFixed(0));
            this.sizeMod.find('.manualWidth').val(ar.width.toFixed(0));
            this.sizeMod.modal('show');

        }else if(item.classList.contains('menuInsert')){

            this.insertsMod.modal('show');

        }else if(item.classList.contains('menuCopy')){

            this.parent.handleDoorCopy(this.activeId);

        }else if(item.classList.contains('delDiv')){

            this.parent.handleDelDiv(this.activeId);

        }else if(item.classList.contains('doorWidth')){

            let door = this.parent.getDoorByRaphId(this.activeId);
            this.doorWidthMod[0].querySelector('.width').value = door.width.toFixed(2);
            this.doorWidthMod.modal('show');

        }
    }
};

Menu.prototype.changeInsertHandler = function(e){

    if(e.target.classList.contains('doorInsertSet') || (e.type == 'dblclick' && e.target.tagName == 'OPTION')){
        let item = this.insertsMod[0].querySelector('.insertList');

        let insVal = item.options[item.selectedIndex].value;
        let insType = item.options[item.selectedIndex].getAttribute('data-type');
        let insRotate =this.insertsMod[0].querySelector('.rotateTexture').checked;
        this.parent.handleAddInsert(this.activeId, insType, insVal, insRotate);

        this.insertsMod.modal('hide');

    }


};

Menu.prototype.changeSizeHandler = function(e){

    if(e.target.classList.contains('setSizes') || e.which == 13){
        let w = +this.sizeMod[0].querySelector('.manualWidth').value;
        let h = +this.sizeMod[0].querySelector('.manualHeight').value;
        let id = this.activeId;
        this.parent.handleNewSize(id, w, h);
        this.sizeMod.modal('hide');
    }
};

Menu.prototype.changeDoorWidthHandler = function(e){

    if(e.target.classList.contains('setWidth') || e.which == 13){

        let el = this.doorWidthMod[0].querySelector('.width');

        let w = +el.value;
        if(isNaN(w) || w > 1250 || w < 400){
            el.parentNode.classList.add('error');
            return false;
        }

        let id = this.activeId;
        this.parent.handleNewDoorWidth(id, w);
        this.doorWidthMod.modal('hide');
    }
};



Menu.prototype.menusOff = function(e){

    this.conMenu.hide();
    if(e.target.nodeName !== 'rect' || e.which === 3){
        this.resetDiv();
    }
};

Menu.prototype.contextMenu = function(e, which, id){
    let x = e.pageX;
    let y = e.pageY;
    let html;
    this.activeId = id;
    this.menusOff(e);
    if(id !== undefined && (which === 'area' || which === 'div')) {
        this.conMenu.html('');
        if (which === 'area') {


            html = [
                '<li style="border-radius: 4px;"><a href="#" class="menuSize">Размер</a> </li>',
                '<li style="border-radius: 4px;"><a href="#" class="menuInsert">Вставка</a> </li>',
                '<li style="border-radius: 4px;"><a href="#" class="menuCopy">Скопировать</a> </li>',
                '<li style="border-radius: 4px;"><a href="#" class="doorWidth">Ширина двери</a> </li>',
            ].join("\n");
            $(html).appendTo(this.conMenu);
        } else if (which === 'div') {

            html = [
                '<li style="border-radius: 4px;"><a href="#" class="delDiv">Удалить</a> </li>',
            ].join("\n");
            $(html).appendTo(this.conMenu);
        }
        this.conMenu.css('top', y + 15 + 'px').css('left', x + 'px').show();
        return true;
    }
    return false;
};


Menu.prototype.saveOrder = function(e){
    const order = this.parent.save();
    let postData = {
        'save': true,
        'order': JSON.stringify(order)
    };
    window.localStorage.setItem("COUPE", JSON.stringify(order));
    c.load("post", 'controller.php', postData)
        .then((data) => {
            $('#grey').hide();
            $('#loading').hide();
            const file = data.content;
            const name = data.name;

            const link = document.createElement('a');
            link.href = "data:application/zip;base64, " + file;
            link.target = "_blank";
            link.download = "order.nmc";

            if (name !== undefined) {
                link.download = name;
            }
            link.click();
        })
        .catch((error) => {
            Core.Alert(error);
        });
};

Menu.prototype.resetOrder = function(e){

    window.localStorage.removeItem("COUPE");
    window.location.reload();
};

Menu.prototype.calcOrder = function(e){

};



Menu.prototype.clickEventHandler = function(e){
    let el = e.target;

    if(el.classList.contains('dividers')){
        e.stopPropagation();
        if(el.classList.contains('active')){
            el.classList.remove('active');
            this.activeDivType = null;
        }else{

            let active = this.node.querySelector('.dividers').querySelector('.active');
            if(active){
                active.classList.remove('active');
            }
            el.classList.add('active');
            this.activeDivType = el.getAttribute('data-divtype');
        }
        return true;
    }

    if(el.classList.contains('reset')){
        this.node.dispatchEvent(this.resetEv);
        return true;
    }

    // if(el.classList.contains('calc')){
    //     this.calcOrder();
    //     return true;
    // }
    this.resetDiv();
};




Menu.prototype.changeEventHandler = function(e){
    let el = e.target;
    let chActiveList = [
        'gpType',
        'gpColor',
        'numDoors',
        'divType',
        'dov',
        'stub',
        'picture',
    ];
    let i;
    if(el.classList) {
        if (el.classList.contains('gpType')) {
            this.updateColor();
        }
        for (i in chActiveList) {
            if (el.classList.contains(chActiveList[i])) {
                this.node.dispatchEvent(this.updateEv);
            }
        }
    }

};

Menu.prototype.keyupEventHandler = function(e){
    let el = e.target;
    let success = false;
    if(el.classList){
        if(el.classList.contains('pheight')){
            success = this.checkHeight(el);
        }else if(el.classList.contains('pwidth')){
            success = this.checkWidth(el);
            if(success){
                this.calcNumDoors();
            }
        }

        if(success){
            this.node.dispatchEvent(this.updateEv);
        }
    }

};

Menu.prototype.checkHeight = function(el){
    let val = el.value;

    if (val > 5200 || val < 800) {
        el.parentNode.classList.add('error');
        return false;
    }

    el.parentNode.classList.remove('error');
    return true;

};

Menu.prototype.checkWidth = function(el){
    let val = el.value;

    if ( val < 800 || val > 5700) {
        el.parentNode.classList.add('error');
        return false;
    }

    el.parentNode.classList.remove('error');
    return true;


};

Menu.prototype.calcNumDoors = function(){
    let numDoors = this.node.querySelector('.numDoors');
    let initNumDoors = numDoors.value;
    let value = this.width();
    let min = Math.ceil(value / 1250);
    let max = Math.floor(value / 400);
    let x;
    let html = '';
    html +='<option value="' + 1 + '"  data-checker = "false">' + 1 + '</option>';
    html +='<option value="' + 2 + '"  data-checker = "false">' + 2 + '</option>';
    html +='<option value="' + 3 + '"  data-checker = "false">' + 3 + '</option>';
    if(min == 1){
        min = min + 1;
    }
    if(min == 2){
        min = min + 1;
    }
    if(min == 3){
        min = min + 1;
    }
    for (x = min; x <= max; x++){
        html +='<option value="' + x + '"  data-checker = "false">' + x + '</option>';
        if(!(x % 2) && x != 2){
            html +='<option value="' + x + '" data-checker = "true">=' + x + '=</option>';
        }
    }


    numDoors.innerHTML = html;
    for (let i in numDoors.options){
        if(numDoors[i].value == initNumDoors){
            numDoors.value = initNumDoors;
        }
    }

};



Menu.prototype.updateColor = function(){
    let i, html='';
    let id = this.node.querySelector('.gpType').value;
    let gpColor = this.node.querySelector('.gpColor');
    for (i in this.menuStruct[id]['color']) {
        html +='<option value="' + i + '">' + this.menuStruct[id]['color'][i] + '</option>'
    }
    gpColor.innerHTML = html;
};

Menu.prototype.config = function(){

    return {
        'type': +this.type(),
        'color': +this.color(),
        'gnu': +this.divType(),
        'dov': this.dov(),
        'stub': this.stub(),
        'picture': this.picture(),
        'pheight': +this.height(),
        'pwidth': +this.width(),
        'numDoors': +this.numDoors(),
        'gnuSize': ((this.divType() == 53) ? 1 : 7),
        'varWidth': +this.varWidth(),
        'insertVar': +this.insertVar(),
        'horizVar': +this.horizVar(),
        'checker': this.isChecker()
    };
};


Menu.prototype.resetDiv = function(){

    this.activeDivType = null;
    let active = this.node.querySelector('.dividers').querySelector('.active');
    if(active){
        active.classList.remove('active');
    }
};


