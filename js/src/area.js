/**
 * Created by ruslan on 22.01.2016.
 */

'use strict';


var Area = function (parent, o) {
    this.door = parent;
    this.x = (o.x != null) ? o.x : this.door.x + (this.door.coupe.insertVar / 2);
    this.y = (o.y != null) ? o.y : this.door.y + 30;
    this.width = (o.width != null) ? o.width : this.door.width - (this.door.coupe.insertVar);
    this.height = (o.height != null) ? o.height : this.door.height - 60;

    this.panel = o.panel || 0;
    this.rotateTexture = o.rotateTexture || 0;
    this._before = (o._before != null)? o._before : null;
    this._after = (o._after != null)? o._after : null;

    if (o.aid != null) {
        this.aid = o.aid;
    }else{
        this.aid = Area._aid++;
    }
    this.isParent = o.isParent || false;
    this.parent = (o.parent != null) ? o.parent : null;
    //if (o.type == null) {
    //    console.log('null type given for area');
    //}
    this.imageName = o.imageName || "";
    this.type = o.type || false;
    this._first = (o._first != null) ? o._first : null;
    this._last = (o._last != null) ? o._last : null;
    this.div = (o.div != null) ? o.div : null;

};

Area._aid = 0;


Area.prototype.rem = function () {
    var o, idx;

    for (idx in this.image) {
        this.image[idx].remove();
    }


};

Area.prototype.recalcChildren = function (arType) {
    var node, i, j, ar, chAr, div, chNodes
        ;
    if(this.type == 'horiz'){
        node = this.door.getTreeNode(this.aid);

        for(i in node){
            ar = this.door.areas[i];
            ar.y = this.y;
            ar.height = this.height;
            ar.render();
            if(ar.div){
                div = this.door.divs[ar.div];
                div.y = this.y;
                div.height = this.height;
                div.render();
            }
            if(ar.isParent){

                chNodes = this.door.getTreeNode(ar.aid);
                for(j in chNodes){
                    chAr = this.door.areas[j];
                    if(chAr._first == true && arType == 'after'){
                        chAr.y = ar.y;
                        chAr.height = chAr.oheight + chAr.oy - ar.y;
                        chAr.render();
                    }
                    if(chAr._last == true && arType == 'bef'){

                        chAr.height = chAr.oheight + ar.height - ar.oheight;
                        chAr.render();

                    }
                    if(chAr.isParent){
                        chAr.recalcChildren(arType);
                    }



                }

            }
        }
    }else if(this.type == 'vert'){
        node = this.door.getTreeNode(this.aid);
        for(i in node){
            ar = this.door.areas[i];
            ar.x = this.x;
            ar.width = this.width;
            ar.render();
            if(ar.div){
                div = this.door.divs[ar.div];
                div.x = this.x;
                div.width = this.width;
                div.render();
            }
            if(ar.isParent){

                chNodes = this.door.getTreeNode(ar.aid);
                for(j in chNodes){
                    chAr = this.door.areas[j];
                    if(chAr._first == true && arType == 'after'){
                        chAr.x = ar.x;
                        chAr.width = chAr.owidth + chAr.ox - ar.x;
                        chAr.render();
                    }
                    if(chAr._last == true && arType == 'bef'){

                        chAr.width = chAr.owidth + ar.width - ar.owidth;
                        chAr.render();

                    }
                    if(chAr.isParent){
                        chAr.recalcChildren(arType);
                    }


                }

            }
        }
    }
};

Area.prototype.resize = function(w, h){
    var diffH, diffW, diff, bef;


    diffH = h - this.height;
    diffW = Math.round(w - this.width);

    console.log(diffH, diffW);
    if(this.type == 'horiz') {

        if (diffH != 0) {

            diff = diffH;

            if (this.div != null) {
                this.door.divs[this.div].start();
                this.door.divs[this.div].move(0, diff / this.door.coupe.c);

            } else if (this.parent != null && this.door.areas[this.parent].parent != null && this.door.areas[this.door.areas[this.parent].parent].div != null) {
                bef = this.door.areas[this.door.areas[this.parent].parent];

                this.door.divs[bef.div].start();
                this.door.divs[bef.div].move(0, diff / this.door.coupe.c);
            } else {

                bef = this.door.areas[this._before];
                this.door.divs[bef.div].start();
                this.door.divs[bef.div].move(0, (0 - diff) / this.door.coupe.c);
            }

        }

        if (diffW != 0) {

            diff = diffW;

            if (this.door.areas[this.parent].div != null) {
                this.door.divs[this.door.areas[this.parent].div].start();
                this.door.divs[this.door.areas[this.parent].div].move(diff / this.door.coupe.c, 0);

            } else if (this.parent != null && this.door.areas[this.parent].parent != null && this.door.areas[this.door.areas[this.parent].parent].div != null) {

                bef = this.door.areas[this.door.areas[this.parent].parent];

                this.door.divs[bef.div].start();
                this.door.divs[bef.div].move(diff / this.door.coupe.c, 0);
            } else {
                bef = this.door.areas[this._before];
                this.door.divs[bef.div].start();
                this.door.divs[bef.div].move((0 - diff) / this.door.coupe.c, 0);
            }
        }
    }else if(this.type == 'vert') {

        if (diffH != 0) {

            diff = diffH;

            if (this.door.areas[this.parent].div != null) {
                this.door.divs[this.door.areas[this.parent].div].start();
                this.door.divs[this.door.areas[this.parent].div].move(0, diff / this.door.coupe.c);

            } else if (this.parent != null && this.door.areas[this.parent].parent != null && this.door.areas[this.door.areas[this.parent].parent].div != null) {
                bef = this.door.areas[this.door.areas[this.parent].parent];

                this.door.divs[bef.div].start();
                this.door.divs[bef.div].move(0, diff / this.door.coupe.c);
            } else {

                bef = this.door.areas[this._before];
                this.door.divs[bef.div].start();
                this.door.divs[bef.div].move(0, (0 - diff) / this.door.coupe.c);
            }

        }

        if (diffW != 0) {

            diff = diffW;

            if (this.div != null) {
                this.door.divs[this.div].start();
                this.door.divs[this.div].move(diff / this.door.coupe.c, 0);

            } else if (this.parent != null && this.door.areas[this.parent].parent != null && this.door.areas[this.door.areas[this.parent].parent].div != null) {

                bef = this.door.areas[this.door.areas[this.parent].parent];

                this.door.divs[bef.div].start();
                this.door.divs[bef.div].move(diff / this.door.coupe.c, 0);
            } else {
                console.log(this);
                bef = this.door.areas[this._before];
                this.door.divs[bef.div].start();
                this.door.divs[bef.div].move((0 - diff) / this.door.coupe.c, 0);
            }
        }
    }
};



Area.prototype.render = function () {

    var image = this.image || {};
    var cp = this.door.coupe;
    var w;
    if (image._object == undefined || image._object.id == null) {

        image._object = cp.paper.rect(0, 0, 0, 0).attr({fill: "grey", opacity: 1, stroke: "black", 'stroke-width': 1});

        image.arrow = cp.paper.path("M0,0").attr({stroke: "#" + cp.colors[this.door.id], 'stroke-width': 1});
        image.barrow = cp.paper.path("M0,0").attr({stroke: "#" + cp.colors[this.door.id], 'stroke-width': 1});

        image.matBack = cp.paper.rect(0, 0, 0, 0).attr({'height': 75, fill: "white", opacity: 1, stroke: "white"});
        image.mat = cp.paper.text(0, 0, '').attr({'font-size': cp.fontSize, 'text-anchor': 'start'});


        image.sTextBack = cp.paper.rect(0, 0, 0, 0).attr({
            'width': 100,
            'height': 75,
            'fill': 'white',
            'stroke': 'white'
        });
        image.sText = cp.paper.text(0, 0, '').attr({
            'font-size': cp.fontSize,
            'cursor': 'pointer',
            'text-anchor': 'start'
        });
        image.bTextBack = cp.paper.rect(0, 0, 0, 0).attr({
            'width': 100,
            'height': 75,
            'fill': 'white',
            'stroke': 'white'
        });
        image.bText = cp.paper.text(0, 0, '').attr({
            'font-size': cp.fontSize,
            'cursor': 'pointer',
            'text-anchor': 'start'
        });
    }

    if (this.panel !== 0) {

        image._object.attr({fill: 'url("' + this.imageName + '")'});
        var name;
        for (var mid in insertList) {
            if (insertList[mid].goods_id == this.panel) {
                name = insertList[mid].name;
                break;
            }
        }

        image.mat.attr({'text': name.slice(0, 20)});
    } else {
        image.mat.attr({'text': this.aid});
    }

    image.mat.attr({
        x: this.x + 20,
        y: this.y + this.height / 2
    });


    if(image.mat.getBBox().width){
        w = image.mat.getBBox().width;
    }else{
        w =0;
    }

    if(this.type == 'vert'){
        if(image.mat.getBBox().height){
            w = image.mat.getBBox().height;
        }else{
            w =0;
        }
        image.mat.transform("r90," + (this.x + this.width / 2) + "," + (this.y + this.height / 2));
        image.matBack.transform("r90," + (this.x + this.width / 2) + "," + (this.y + this.height / 2));
    }
    image.matBack.attr({x: this.x + 20, y: this.y + this.height / 2 - 30, 'width': w});

    image._object.attr({'x': this.x, 'y': this.y, 'width': this.width, 'height': this.height});
    image.arrow.attr({'path': this.horizArrPath()});

    image.sText.attr({
        'x': cp.posx + 120 + cp.recPwidth + (100 * this.door.id),
        'y': this.y + this.height / 2,
        'text': this.height

    }).transform("r90," + (cp.posx + 160 + cp.recPwidth + (100 * this.door.id)) + "," + (this.y + this.height / 2));
    image.sTextBack.attr({
        //'x': cp.posx + 120 + cp.recPwidth + (100 * this.door.id),
        //'y': (this.y + this.height / 2) - parseFloat(cp.fontSize)
        'x' : image.sText.getBBox().x,
        'y' : image.sText.getBBox().y,
        'width' : image.sText.getBBox().width,
        'height' : image.sText.getBBox().height,
    });

    image.barrow.attr({'path': this.vertArrPath()});
    image.bText.attr({
        'x': this.x + (this.width / 2) - parseFloat(cp.fontSize),
        'y': cp.posy + cp.pheight + 165,
        'text': this.width.toFixed(2)
    });
    image.bTextBack.attr({
        //'x': this.x + (this.width / 2) - parseFloat(cp.fontSize),
        //'y': cp.posy + cp.pheight + 150
        x : image.bText.getBBox().x,
        y : image.bText.getBBox().y,
        'width' : image.bText.getBBox().width,
        'height' : image.bText.getBBox().height,

    });

    if(this.isParent){
        image._object.remove();
        //image.mat.attr({'text':''});
        //image.matBack.attr({fill:'none'});
        //image._object.toBack();
        //image.arrow.attr({stroke:'none'});
        //image.sText.attr({fill: 'none', stroke:'none'});
        //image.sTextBack.attr({fill: 'none', stroke:'none'});
        //image.barrow.attr({stroke:'none'});
        //image.bTextBack.attr({fill: 'none', stroke:'none'});
        //image.bText.attr({fill: 'none', stroke:'none'});

        image.mat.remove();
        image.matBack.remove();
        image._object.remove();
        image.arrow.remove();
        image.sText.remove();
        image.sTextBack.remove();
        image.barrow.remove();
        image.bTextBack.remove();
        image.bText.remove();
    }else{
        //image._object.attr({fill: "grey", opacity: 1, stroke: "black", 'stroke-width': 1});
        //image.matBack.attr({fill: "white"});
        //image.mat.attr({'text':''});
        ////image._object.toFront();
        //image.arrow.attr({stroke: "#" + cp.colors[this.door.id]});
        //image.sText.attr({fill: 'black', stroke:'black'});
        //image.sTextBack.attr({fill: 'white', stroke:'white'});
        //image.barrow.attr({stroke: "#" + cp.colors[this.door.id]});
        //image.bTextBack.attr({fill: 'white', stroke:'white'});
        //image.bText.attr({fill: 'black', stroke:'black'});
    }
    this.image = image;
    //this.door.divsToFront();
};

Area.prototype.horizArrPath = function () {
    var ad = this.door.coupe;
    return 'M' + ((ad.posx + 65 + ad.recPwidth) + 100 * this.door.id) + ',' +
        (this.y + this.height) +
        'l' + (100) + ',0' +
        'm 15,-15' + 'l -30,30' + 'm 15,-15' +
        'l 0,-' + (this.height) + ',0' +
        'm 15,-15' + 'l -30,30' + 'm 15,-15' +
        'l -' + (100) + ',0';
};
Area.prototype.vertArrPath = function () {
    var cp = this.door.coupe;
    return 'M' + this.x + "," + (cp.posy + cp.pheight + 65) +
        'l 0, 100' +
        'm 15,-15' + 'l -30,30' + 'm 15,-15' +
        'l ' + (this.width) + ',0' +
        'm 15,-15' + 'l -30,30' + 'm 15,-15' +
        'l 0, -100';
};

