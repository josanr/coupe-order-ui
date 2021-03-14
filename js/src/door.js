/**
 * Created by ruslan on 22.01.2016.
 */

'use strict';

var Door = function (parent, idx) {
    this.coupe = parent;
    this.y = this.coupe.posy + 20;
    this.x = this.coupe.doorWidth * idx + this.coupe.posx;
    this.width = this.coupe.doorWidth;
    this.height = this.coupe.pheight - 40;
    this.areas = {};
    this.divs = {};
    this.tree = {};
    this.id = idx;
};


Door.prototype.addArea = function ( opt ) {
    var newAr = new Area(this, opt);
    this.areas[newAr.aid] = newAr;
    return newAr;
};

Door.prototype.getArea = function(aid){
    return this.areas[aid];
};


Door.prototype.getTreeNode = function(aid){

    function traverse(ob, aid) {
        var i;
        for (i in ob) {
            var t = ob[i];
            if (i == aid){
                return t;
            }
            var ret = traverse(t, aid);
            if(ret){
                return ret;
            }


        }
    }

    return traverse(this.tree, aid);
};




Door.prototype.divide = function (offsetX, offsetY, type, aid) {

    var x, y, h, w, ar, firstAr, secAr, div;

    ar = this.getArea(aid);
    if(ar.type == 'root'){
        if(type == 'horiz'){
            ar.type = 'vert';
        }else{
            ar.type = 'horiz';
        }
        ar.isParent = true;
        this.tree[aid]={};
    }

    div = new Divider(offsetX, offsetY, ar, type);
    this.divs[div.did] = div;

    if (type == 'horiz') {
        firstAr = this.addArea({
            x : ar.x,
            y : ar.y,
            height : offsetY - ar.y - this.coupe.gnuSize,
            width : ar.width,
            panel : ar.panel,
            rotateTexture : ar.rotateTexture,
            imageName : ar.imageName
        });

        secAr = this.addArea({
            x : ar.x,
            y : offsetY,
            height : ar.height - firstAr.height - this.coupe.gnuSize,
            width : ar.width
        });

    } else {

        firstAr = this.addArea({
            x : ar.x,
            y : ar.y,
            height : ar.height,
            width : offsetX - Math.round(ar.x) - this.coupe.gnuSize,
            panel : ar.panel,
            rotateTexture : ar.rotateTexture,
            imageName : ar.imageName
        });

        secAr = this.addArea({
            x : offsetX,
            y : ar.y,
            height : ar.height,
            width : ar.width - firstAr.width - this.coupe.gnuSize
        });

    }
    firstAr.type = type;
    secAr.type = type;


    var children;

    if(ar.type == type){
        //console.log('same type => create new node for parent delete this node');
        var newParent = ar.parent;
        children = this.getTreeNode(newParent);

        children[firstAr.aid] = {};
        children[secAr.aid] = {};
        firstAr.parent = newParent;
        secAr.parent = newParent;
        secAr._last = ar._last;
        firstAr._first = ar._first;
        if(this.areas[ar._before]) {
            this.areas[ar._before]._after = firstAr.aid;
        }
        firstAr._before = ar._before;
        firstAr._after = secAr.aid;
        secAr._after = ar._after;
        secAr._before = firstAr.aid;

        firstAr.div = div.did;
        secAr.div = ar.div;

        ar.rem();
        delete(children[ar.aid]);
        delete(this.areas[ar.aid]);
    }else{
        //console.log('diff type => make this parent node and ad 2 childs');
        ar.isParent = true;
        children = this.getTreeNode(ar.aid);
        children[firstAr.aid] = {};
        children[secAr.aid] = {};
        firstAr.parent = ar.aid;
        secAr.parent = ar.aid;
        firstAr._first = true;
        secAr._last = true;

        firstAr._before = null;
        firstAr._after = secAr.aid;
        secAr._after = null;
        secAr._before = firstAr.aid;

        firstAr.div = div.did;
        secAr.div = null;
        ar.rem();
    }

    div.render();
    firstAr.render();
    secAr.render();
    this.divsToFront();
    //console.log(this.areas);
};





Door.prototype.clear = function(){
    var i;
    for (i in this.areas){
        this.areas[i].rem();
    }
    for (i in this.divs){
        this.divs[i].rem();
    }

};

Door.prototype.clone = function(data){
    var x, y, j, z, newTree, sync = {}, ar;


    this.clear();

    this.areas = JSON.parse(JSON.stringify(data.areas));
    this.divs = JSON.parse(JSON.stringify(data.divs));

    var goTree = function(self, tree, areas){
        var i,  th = {}, temp, nId;
        for (i in tree) {

            nId = Area._aid++;
            temp = areas[i];

            self.areas[nId] = JSON.parse(JSON.stringify(temp));

            self.areas[nId].aid = nId;
            sync[i]=nId;

            delete(self.areas[i]);
            if (Object.keys(tree[i]).length != 0) {
                th[nId] = {};
                th[nId] = goTree(self, tree[i], areas);
            } else {
                th[nId] = {};
            }
        }
        return th;
    };

    newTree = goTree(this, data.tree, data.areas);

    this.tree = newTree;

    for(x in sync) {
        for (j in this.areas) {
            ar = this.areas[j];
            if (ar._before == x) {
                ar._before = sync[x];
            }
            if (ar._after == x) {
                ar._after = sync[x];
            }
            if (ar.parent == x) {
                ar.parent = sync[x];
            }
        }
    }




    this.recalc(data.width);
    //console.log(this.tree, this.areas, this.divs);
    this.render();
    //console.log(this);
};

Door.prototype.save = function(){
    var i, y, z, exp, div, area;

    exp = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        divs: {},
        areas: {},
        tree: this.tree
    };
    for (y in this.divs) {
        div = this.divs[y];
        exp.divs[y] = {};
        for (z in div){
            if(z != 'door' && z != 'image'){
                exp.divs[y][z] = div[z];
            }
        }

    }

    for (y in this.areas) {
        area = this.areas[y];

        exp.areas[y] = {};
        for (z in area){
            if(z != 'door' && z != 'image'){
                exp.areas[y][z] = area[z];
            }
        }

    }
    return JSON.parse(JSON.stringify(exp));

};

Door.prototype.recalc = function (implWidth) {
    var ox = this.x,
        oy = this.y,
        owidth = this.width,
        oheight = this.height,
        diffH, diffW;

    this.y = this.coupe.posy + 20;
    this.x = this.coupe.doorWidth * this.id + this.coupe.posx;
    this.width = implWidth || this.coupe.doorWidth;
    this.height = this.coupe.pheight - 40;

    diffW = this.width / owidth;
    diffH = this.height / oheight;


    //recreate objects if thei were loaded from json===================
    var recreate = function(th, tree){
        var i, t, ar;
        for (i in tree){
            t = tree[i];
            ar = th.addArea(th.areas[i]);

            if(Object.keys(t).length != 0){
                recreate(th, t);
            }
        }
    };


    //
    if(this.tree && this.areas[Object.keys(this.tree)[0]].image == undefined){

        // console.log('Recreate');
        recreate(this, this.tree);
    }else{
        // console.log('resize');
        this.clear();
    }

    //===================================================================
    var adx, didx, pid, d,
        tdivs = [],
        td,
        ar;

    function goTree(th, ob, x, y, w, h, difW, difH){
        var i, ar, ox, oy, ow, oh, d, a, j;

        for(i in ob){
            ar = th.areas[i];

            if(ar.type == 'horiz'){
                if(ar._first == true) {
                    ar.x = x;
                    ar.width = w;
                    ar.y = y;
                    ar.height = Math.round(ar.height * difH);

                    if(ar.div != null) {
                        d = new Divider(null, null, ar, ar.type, th.divs[ar.div].did);
                        th.divs[d.did] = d;
                    }
                    for(j = ar._after, oh = ar.height, oy = ar.y; j != null; j = a._after, oh = a.height, oy = a.y){
                        a = th.areas[j];
                        a.x = x;
                        a.width = w;
                        a.y = oy + oh + th.coupe.gnuSize;
                        if(a._last != true){
                            a.height = Math.round(a.height * difH);
                        }else{
                            a.height = y + h - a.y;
                        }
                        if(a.div != null) {
                            d = new Divider(null, null, a, a.type, th.divs[a.div].did);
                            th.divs[d.did] = d;
                        }


                    }
                }
            }else if(ar.type == 'vert'){
                if(ar._first == true) {
                    ar.x = x;
                    ar.width = Math.round(ar.width * difW);
                    ar.y = y;
                    ar.height = h;
                    if(ar.div != null) {
                        d = new Divider(null, null, ar, ar.type, th.divs[ar.div].did);
                        th.divs[d.did] = d;
                    }
                    for(j = ar._after, ow = ar.width, ox = ar.x; j != null; j = a._after, ow = a.width, ox = a.x){
                        a = th.areas[j];
                        a.y = y;
                        a.height = h;
                        a.x = ox + ow + th.coupe.gnuSize;
                        if(a._last != true){
                            a.width = Math.round(a.width * difW);
                        }else{
                            a.width = x + w - a.x;
                        }
                        if(a.div != null) {
                            d = new Divider(null, null, a, a.type, th.divs[a.div].did);
                            th.divs[d.did] = d;
                        }


                    }
                }
            }

            if(ar.isParent == true){
                ox = ar.x;
                oy = ar.y;
                ow = ar.width;
                oh = ar.height;
                goTree(th, ob[i], ox, oy, ow, oh, difW, difH);
            }
        }
    }
    for (adx in this.tree) {
        ar = this.areas[adx];
        ar.x = this.x + (this.coupe.insertVar / 2);
        ar.y = ar.y - oy + this.y;
        ar.width = this.width - (this.coupe.insertVar);
        ar.height = this.height - 60;
        //this.addArea(ar);
        goTree(this, this.tree[adx], ar.x, ar.y, ar.width, ar.height, diffW, diffH);

    }

    return true;


};


Door.prototype.rem = function () {
    var idx, idi, o;

    for (idx in this.areas) {
        o = this.areas[idx];
        for (idi in o.image) {
            o.image[idi].remove();
        }
        delete(this.areas[idx]);
    }
    for (idx in this.divs) {
        o = this.divs[idx];
        for (idi in o.image) {
            o.image[idi].remove();
        }
        delete(this.divs[idx]);
    }

    for (idi in this.image) {
        this.image[idi].remove();
    }

};

Door.prototype.divsToFront = function () {

    for (var idx in this.divs) {
        var d = this.divs[idx];
        if (d) {
            d.image._object.toFront();
        }
    }
};


Door.prototype.getAreaByDivId = function(id){
    var i;
    for(i in this.areas){
        if(this.areas[i].div == id){
            return this.areas[i];
        }
    }
    return null;
};


Door.prototype.render = function () {
    var image = this.image || {};
    var cp = this.coupe;

    if (image._object == undefined) {
        image._object = cp.paper.path("M0,0").attr({'stroke-width': 1});
        image.bottomArrow = cp.paper.path("M0,0").attr({stroke: "#" + cp.colors[this.id], 'stroke-width': 1});
        image.bottomArrowTextbg = cp.paper.rect(0, 0, 0, 0).attr({
            'fill': 'white',
            'stroke': 'white'
        });
        image.bottomArrowText = cp.paper.text(0, 0, '').attr({
            'font-size': cp.fontSize,
            'text-anchor': 'start'
        });

    }
    image._object.attr({
        'path': "M " + (this.x) + "," + (this.y) //start position
        + " l " + (this.width) + ", 0" //outer top line
        + " l 0, " + (this.height) //outer right line
        + " l " + (-this.width) + ", 0" //outer bottom line
        + " l 0, " + (-this.height) //outer left line
        + "m " + (this.coupe.insertVar / 2 ) + ", " + (30) //move to inner line
        + "l " + (this.width - this.coupe.insertVar) + ", 0" //inner top line
        + "l 0, " + (this.height - 60) //inner rigth line
        + "l -" + (this.width - this.coupe.insertVar) + ", 0" //inner bottom line
        + "l 0, -" + (this.height - 60) + " z" //inner left line
    });
    image.bottomArrow.attr({
        'path': "M " + (this.x) + "," + (cp.posy - 65 )
        + "l0,-50"
        + "m15,-15l-30,30m15,-15"
        + "l" + this.width + ",0"
        + "m15,-15l-30,30m15,-15"
        + "l0,50"
    });

    image.bottomArrowText.attr({
        x: this.x + (this.width / 2) - 75,
        y: cp.posy - 120, text: this.width.toFixed(2)
    });
    image.bottomArrowTextbg.attr({
        //x: this.x + (this.width / 2) - 85,
        //y: cp.posy - 120,
        //width: 150,
        //height: 50
        x : image.bottomArrowText.getBBox().x,
        y : image.bottomArrowText.getBBox().y,
        'width' : image.bottomArrowText.getBBox().width,
        'height' : image.bottomArrowText.getBBox().height,
    });

    this.image = image;
    var aidx;

    for (aidx in this.areas) {
        this.areas[aidx].render();
    }
    for (aidx in this.divs) {
        this.divs[aidx].render();

    }
    this.divsToFront();
};

