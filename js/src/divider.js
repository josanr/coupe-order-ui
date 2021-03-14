/**
 * Created by ruslan on 25.01.2016.
 */

'use strict';

var Divider = function (x, y, parent, type, id) {
    this.divThick = 20;
    this.type = type;
    this.door = parent.door; //door of origin
    this.did = Divider._divId++;
    if(id != null){
        this.did = id;
    }


    if (type == 'horiz') {
        this.x = parent.x;
        this.y = (y != null)? (y-this.divThick) : (parent.y + parent.height - (this.divThick / 2));
        this.height = this.divThick;
        this.width = parent.width;

    } else if (type == 'vert') {
        this.x = (x != null)? (x-this.divThick) :  (parent.x + parent.width - (this.divThick / 2));
        this.y = parent.y;
        this.width = this.divThick;
        this.height = parent.height;
    }

    return this;

};


Divider._divId = 0;

Divider.prototype.rem = function () {
    var idx;
    for (idx in this.image){
        this.image[idx].remove();
    }
};

Divider.prototype.del = function(){
    var ar = this.door.getAreaByDivId(this.did);
    var nei, diff, parent, node, nodeId, chNode, i;
    if(ar._after != null){
        nei = this.door.areas[ar._after];
    }

//======================================================================================================================
    if(ar.isParent && nei.isParent){
        console.log('we have 2 parents - go down');
        if(this.type == 'horiz'){
            ar.height += nei.height + this.door.coupe.gnuSize;
            this.y += nei.height + this.door.coupe.gnuSize;
            this.render();

        }else if(this.type == 'vert'){
            ar.width += nei.width  + this.door.coupe.gnuSize;
            this.x += nei.width + this.door.coupe.gnuSize;
            this.render();
        }
        var delTree = function(th, tree){
            var i, j, node;
            for(i in tree){
                node = tree[i];
                if(th.door.areas[i].div!= null){
                    th.door.divs[th.door.areas[i].div].rem();
                    delete(th.door.divs[th.door.areas[i].div]);
                }
                th.door.areas[i].rem();
                delete(th.door.areas[i]);
                if (Object.keys(node).length != 0){
                    delTree(th, th.door.getTreeNode(i));
                }
            }
        };

        ar._last = nei._last;
        ar._after = nei._after;
        nodeId  = ar.parent;
        node = this.door.getTreeNode(nodeId);

        parent = this.door.areas[nodeId];

        this.door.divs[nei.div].rem();
        delete(this.door.divs[nei.div]);

        nei.rem();
        chNode = this.door.getTreeNode(nei.aid);
        ar.recalcChildren('bef');

        delTree(this, chNode);

        delete(this.door.areas[nei.aid]);
        delete(node[nei.aid]);
        parent.render();


//======================================================================================================================
    }else if(ar.isParent && !nei.isParent){
        console.log('top parent, bottom clean - go down');
        if(this.type == 'horiz'){
            ar.height += nei.height + this.door.coupe.gnuSize;
            this.y += nei.height + this.door.coupe.gnuSize;
            this.render();

        }else if(this.type == 'vert'){
            ar.width += nei.width  + this.door.coupe.gnuSize;
            this.x += nei.width + this.door.coupe.gnuSize;
            this.render();
        }

        nodeId  = ar.parent;
        node = this.door.getTreeNode(nodeId);
        if(Object.keys(node).length == 2){
            console.log('Leaving one and moving up the tree');
            parent = this.door.areas[nodeId];

            this.door.divs[ar.div].rem();
            delete(this.door.divs[ar.div]);
            nei.rem();
            delete(this.door.areas[nei.aid]);
            delete(node[nei.aid]);
            //chNode = this.door.getTreeNode(nei.aid);
            //
            //for(i in chNode){
            //    node[i]=chNode[i];
            //    this.door.areas[i].parent = parent.aid;
            //    delete(chNode[i]);
            //}
            //
            //delete(node[nei.aid]);
            //delete(node[ar.aid]);
            //delete(this.door.areas[nei.aid]);
            //delete(this.door.areas[ar.aid]);
            //if(parent.type == 'horiz'){
            //    parent.type = 'vert';
            //}else if(parent.type == 'vert'){
            //    parent.type = 'horiz';
            //}
            ar.recalcChildren('bef');
            parent._first = null;
            parent._last = null;
            parent.render();
        }else {
            ar._last = nei._last;
            ar._after = nei._after;

            if (nei.div) {
                this.door.divs[nei.div].rem();
                delete(this.door.divs[nei.div]);
            } else {
                this.door.divs[ar.div].rem();
                delete(this.door.divs[ar.div]);
            }

            ar.render();
            ar.recalcChildren('bef');
            nei.rem();

            delete(node[nei.aid]);
            delete(this.door.areas[nei.aid]);
        }

//======================================================================================================================
    }else if(!ar.isParent && nei.isParent){
        console.log('bottom parent, top clean - go up');
        if(this.type == 'horiz'){
            nei.height += ar.height + this.door.coupe.gnuSize;
            nei.y -= ar.height + this.door.coupe.gnuSize;

        }else if(this.type == 'vert'){
            nei.width += ar.width  + this.door.coupe.gnuSize;
            nei.x -= ar.width  + this.door.coupe.gnuSize;
        }
        this.door.divs[ar.div].rem();
        delete(this.door.divs[ar.div]);

        nodeId  = ar.parent;
        node = this.door.getTreeNode(nodeId);

        if(Object.keys(node).length == 2){
            console.log('Leaving one and moving up the tree');
            parent = this.door.areas[nodeId];
            //chNode = this.door.getTreeNode(nei.aid);
            //
            //for(i in chNode){
            //    node[i]=chNode[i];
            //    this.door.areas[i].parent = parent.aid;
            //    delete(chNode[i]);
            //}
            //
            //ar.rem();
            //delete(node[nei.aid]);
            //delete(node[ar.aid]);
            //delete(this.door.areas[nei.aid]);
            //delete(this.door.areas[ar.aid]);
            //
            //if(parent.type == 'horiz'){
            //    parent.type = 'vert';
            //}else if(parent.type == 'vert'){
            //    parent.type = 'horiz';
            //}
            ar.rem();
            delete(this.door.areas[ar.aid]);
            delete(node[ar.aid]);

            try {
                parent.recalcChildren('after');
            }catch (e){
                console.log(e);
            }
            parent._first = null;
            parent._last = null;
            parent.render();
        }else {

            nei._first = ar._first;
            nei._before = ar._before;




            nei.render();
            nei.recalcChildren('after');
            ar.rem();

            delete(node[ar.aid]);
            delete(this.door.areas[ar.aid]);
        }


//======================================================================================================================
    }else if(!ar.isParent && !nei.isParent){
        console.log('no parrents - go down');

        if(this.type == 'horiz'){
            ar.height += nei.height + this.door.coupe.gnuSize;
            this.y += nei.height + this.door.coupe.gnuSize;
            this.render();

        }else if(this.type == 'vert'){
            ar.width += nei.width  + this.door.coupe.gnuSize;
            this.x += nei.width + this.door.coupe.gnuSize;
            this.render();
        }

        nodeId  = nei.parent;
        node = this.door.getTreeNode(nodeId);
        if(Object.keys(node).length == 2){
            console.log('Leaving one');
            parent = this.door.areas[nodeId];
            parent.isParent = false;
            this.door.divs[ar.div].rem();
            delete(this.door.divs[ar.div]);
            ar.rem();
            nei.rem();
            delete(this.door.areas[ar.aid]);
            delete(this.door.areas[nei.aid]);
            delete(node[ar.aid]);
            delete(node[nei.aid]);
            if (parent.parent == null){
                parent.type = 'root';
            }
            parent._first = null;
            parent._last = null;
            parent.render();
        }else {
            ar._last = nei._last;
            ar._after = nei._after;

            if (nei.div) {
                this.door.divs[nei.div].rem();
                delete(this.door.divs[nei.div]);
            } else {
                this.door.divs[ar.div].rem();
                delete(this.door.divs[ar.div]);
            }

            ar.render();
            nei.rem();

            delete(node[nei.aid]);
            delete(this.door.areas[nei.aid]);
        }
    }
    //console.log(this.door.tree, this.door.areas, this.door.divs);
    this.door.divsToFront();

};



Divider.prototype.start = function(x, y, e){
    var cp = this.door.coupe;
    var idx, f;

    this.ox = this.x;
    this.oy = this.y;

    var ar = this.door.getAreaByDivId(this.did);

    var nei;
    if(ar._after != null){
        nei = this.door.areas[ar._after];
    }
    this.bef = ar.aid;
    this.aft = nei.aid;

    for (idx in this.door.areas){

        ar = this.door.areas[idx];
        ar.ox = ar.x;
        ar.oy = ar.y;
        ar.owidth = ar.width;
        ar.oheight = ar.height;
    }
    for (idx in this.door.divs){

        ar = this.door.divs[idx];
        ar.image._object.attr('fill', 'black');
    }
    this.image._object.attr('fill', 'green');
};

Divider.prototype.move = function(dx, dy, x, y, e){

    var idx, idy, f, binded, ar, nei,
        cp = this.door.coupe;

    if(this.type == 'horiz'){
        this.y = this.oy + Math.round(dy * cp.c);
        this.render();
        ar = this.door.areas[this.bef];
        nei = this.door.areas[this.aft];

        ar.x = ar.ox;
        ar.y = ar.oy;
        ar.height = ar.oheight + Math.round(dy * cp.c);
        ar.width = ar.owidth;
        ar.render();
        if(ar.isParent){
            ar.recalcChildren('bef');
        }
        nei.x = nei.ox;
        nei.y = nei.oy + Math.round(dy * cp.c);
        nei.height = nei.oheight - Math.round(dy * cp.c);
        nei.width = nei.owidth;
        nei.render();
        if(nei.isParent){
            nei.recalcChildren('after');
        }


    }else if(this.type == 'vert'){
        this.x = this.ox + Math.round(dx * cp.c);
        this.render();

        ar = this.door.areas[this.bef];
        nei = this.door.areas[this.aft];

        ar.x = ar.ox;
        ar.y = ar.oy;
        ar.height = ar.oheight;
        ar.width = ar.owidth + Math.round(dx * cp.c);
        ar.render();
        if(ar.isParent){
            ar.recalcChildren('bef');
        }
        nei.x = nei.ox + Math.round(dx * cp.c);
        nei.y = nei.oy;
        nei.height = nei.oheight;
        nei.width = nei.owidth - Math.round(dx * cp.c);
        nei.render();
        if(nei.isParent){
            nei.recalcChildren('after');
        }

    }

};

Divider.prototype.end = function(){
    //console.log("end");
};

Divider.prototype.render = function () {
    var image = this.image || {};
    if (image._object == undefined) {
        image._object = this.door.coupe.paper.rect(0, 0, 0, 0).attr({
            fill: "#000000",
            cursor: "pointer"
        })
            //.data('isDivider', true);
            .drag(this.move, this.start, this.end, this, this, this);
    }
    image._object.attr({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
    });

    this.image = image;
};