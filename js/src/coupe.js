/**
 * Created by ruslan on 21.01.2016.
 */

'use strict';
let cp = (function() {


    let Coupe = function () {


        this.posx = 200;
        this.posy = 200;
        this.pheight = 2500;
        this.pwidth = 3200;
        this.gnuSize = 1;
        this.varWidth = 26.1;
        this.insertVar = 35; // L 35
        this.horizVar = 50; //L 51
        this.type = 18;
        this.color = 22;
        this.gnu = 53;
        this.dov = false;
        this.stub = false;
        this.picture = false;
        this.checker = false;
        this.numDoors = 3;
        this.doorWidth = ((this.pwidth + (this.varWidth * (this.numDoors - 1))) / this.numDoors);


        this.recPwidth = this.doorWidth * this.numDoors;
        this.container = $('#svgCont');
        this.paper = new Raphael(this.container[0]);
        this.doors = [];


        this.colors = [
            'FF0000',
            '8000FF',
            'FF8000',
            'FF0080',
            '80FF00',
            '80FF00',
            '80FF00',
            '80FF00',
            '80FF00',
            '80FF00',
            '80FF00',
            '80FF00',
            '00FFFF'
        ];




    };

    Coupe.prototype.init = function () {

        let menuNode = document.getElementById('topMenu');

        this.menu = new Menu(this, menuNode, menuStruct);
        this.menu.init();

        menuNode.addEventListener('menuUpdated', this.recalc.bind(this));
        menuNode.addEventListener('menuReset', this.reset.bind(this));
        this.container.on('click', this.handleClickEvent.bind(this));
        const stored = JSON.parse(window.localStorage.getItem("COUPE"));


        if (stored !== null) {
            let ad = stored;
            this.menu.height(ad.pheight);
            this.menu.width(ad.pwidth);
            this.menu.calcNumDoors();
            this.menu.numDoors(ad.numDoors);
            this.menu.type(ad.type);
            this.menu.color(ad.color);
            this.menu.divType(ad.gnu);
            this.menu.dov(ad.dov);
            this.menu.stub(ad.stub);
            this.menu.picture(ad.picture);
            this.getConfig();
            this.load(JSON.parse(JSON.stringify(stored)));
        }else{
            this.getConfig();
            let x;
            for (x = 0; x < this.numDoors; x++) {
                let door = this.addDoor(x);

                door.addArea({type: 'root'});
                door.tree = {};
                door.tree[x] = {};
                door.render();
            }

        }



        this.render();


    };

    Coupe.prototype.load = function (data) {
        let idx, door, succ, aids = [];

        for (idx in data.doors) {
            door = data.doors[idx];

            if(this.doors[idx] === undefined){
                this.addDoor(idx);
            }
            // console.log(door);
            this.doors[idx].clear();
            this.doors[idx].divs = door.divs;
            this.doors[idx].areas = door.areas;
            this.doors[idx].tree = door.tree;
            for (let i in door.areas){
                aids.push(door.areas[i].aid);
            }
            succ = this.doors[idx].recalc(door.width);
            if (succ) {
                this.doors[idx].render();
            }
        }

        Area._aid = 1 + Math.max.apply(null, aids);

    };

    Coupe.prototype.handleDelDiv = function (id) {

        let div = this.getDivByRaphId(id);
        div.del();

    };

    Coupe.prototype.handleDoorCopy = function (rid) {

        let door = this.getDoorByRaphId(rid);
        let data = door.save();

        let x;
        for (x in this.doors) {
            this.doors[x].clone(data);
        }
    };

    Coupe.prototype.handleAddInsert = function (id, insType, insVal, insRotate) {

        let ar = this.getAreaByRaphId(id);


        if (insType === undefined) {
            return false;
        }

        ar.panel = insVal;
        if (insRotate) {
            ar.rotateTexture = 1;
        } else {
            ar.rotateTexture = 0;
        }

        switch (+insType) {
            case 10:
            case 9:
            case 56:
            case 54:
                if (ar.rotateTexture) {
                    ar.imageName = 'images/glass90.png';
                } else {
                    ar.imageName = 'images/glass.png';
                }
                break;
            case 1:
            default:
                if (ar.rotateTexture) {
                    ar.imageName = 'images/mat.png';
                } else {
                    ar.imageName = 'images/mat90.png';
                }
        }
        ar.render();
    };

    Coupe.prototype.handleNewSize = function (id, newHeight, newWidth) {

        if (isNaN(newHeight) || isNaN(newWidth)) {
            return false;
        }

        let ar = this.getAreaByRaphId(id);
        ar.resize(newHeight, newWidth);

    };

    Coupe.prototype.handleNewDoorWidth = function (id, newWidth) {

        if (isNaN(newWidth)) {
            return false;
        }

        let door = this.getDoorByRaphId(id);

        door.recalc(newWidth);
        door.render();
        // ar.resize(newHeight, newWidth);

    };


    Coupe.prototype.handleClickEvent = function(e){

        this.menu.conMenu.hide();

        let type = this.menu.activeDiv();

        if (e.target.raphael && type != null) {
            this.handleAddDiv(e, type);

        } else if(this.getDoorByRaphId(e.target.raphaelid)){

            // let door = this.getDoorByRaphId(e.target.raphaelid);
            // door.recalc(300);
            // door.render();
            // console.log(type, this.getAreaByRaphId(e.target.raphaelid));
        }
    };



    Coupe.prototype.handleAddDiv = function (e, type) {
        let offset = 0;
        let ar = this.getAreaByRaphId(e.target.raphaelid);

        if (!ar) {
            console.log('area not found: ' + e.target.raphaelid);
            return false;
        }
        let offsetX = Math.round(e.originalEvent.layerX * this.c);
        let offsetY = Math.round(e.originalEvent.layerY * this.c);

        ar.door.divide(offsetX, offsetY, type, ar.aid);
        return true;
    };

    Coupe.prototype.getAreaByRaphId = function (id) {
        for (var didx = 0; didx < this.doors.length; didx++) {
            var d = this.doors[didx];
            for (var aidx in d.areas) {
                var a = d.areas[aidx];

                if (a.image && a.image._object.id == id) {
                    return a;
                }
            }
        }
        return null;
    };

    Coupe.prototype.getDoorByRaphId = function (id) {
        for (var didx = 0; didx < this.doors.length; didx++) {
            var d = this.doors[didx];
            for (var aidx in d.areas) {
                var a = d.areas[aidx];
                if (a.image && a.image._object.id == id) {
                    return d;
                }
            }
        }
        return null;
    };

    Coupe.prototype.getDivByRaphId = function (id) {
        for (var didx = 0; didx < this.doors.length; didx++) {
            var d = this.doors[didx];
            for (var ddx in d.divs) {
                var div = d.divs[ddx];
                if (div.image._object.id == id) {
                    return div;
                }
            }
        }
        return null;
    };

    Coupe.prototype.addDoor = function (idx) {
        this.doors[idx] = new Door(this, idx);
        return this.doors[idx];
    };

    Coupe.prototype.remDoor = function (idx) {
        this.doors[idx].rem();
        delete(this.doors[idx]);
        this.doors.splice(idx, 1);
        return 1;
    };

    Coupe.prototype.render = function () {
        var arrSign = "m 15,-15 l -30,30 m 15,-15";


        //this.paper.clear();
        var outer = document.getElementById("svgCont");
        outer.style.width = this.paperWidth + 'px';
        outer.style.height = this.paperHeight + 'px';

        this.paper.setSize(this.paperWidth, this.paperHeight);
        this.paper.setViewBox(0, 0, this.recPwidth + 850, this.pheight + 500, true);
        this.paper.canvas.setAttribute('preserveAspectRatio', 'xMinYMin');
        this.paper.canvas.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
        var image = this.image || {};
        if (image.boxPath == undefined || image.boxPath.id == null) {
            image.boxPath = this.paper.path("M0,0").attr({fill: "#f9f9f1", "fill-rule": "nonzero", 'stroke-width': 1});
            image.arrowPath = this.paper.path("M0,0").attr({'stroke-width': 1});
            image.topTextBox = this.paper.rect(0, 0, 0, 0).attr({
                'fill': 'white',
                'stroke': 'white'
            });
            image.topText = this.paper.text(0, 0, '').attr({
                'font-size': this.fontSize,
                'text-anchor': 'start'
            });
            image.leftTextBox = this.paper.rect(0, 0, 0, 0).attr({
                'fill': 'white',
                'stroke': 'white'
            });
            image.leftText = this.paper.text(0, 0, '').attr({
                'font-size': this.fontSize,
                'text-anchor': 'start'
            });
        }
        //Draw outer box with arrows
        var box_path = "M " + (this.posx) + "," + (this.posy)
                + "l 0, " + (this.pheight)
                + "l " + (this.recPwidth) + ", 0"
                + "l 0, -" + (this.pheight)
                + "l -" + (this.recPwidth) + ", 0"
                + "m -65, -65"
                + "l " + (this.recPwidth + 130) + ", 0"
                + "l 0, " + (this.pheight + 130)
                + "l -" + (this.recPwidth + 130) + ",0"
                + "l 0, -" + (this.pheight + 130) + " z"
            ;

        var arrow_path = "M " + (this.posx - 65) + "," + (this.posy + this.pheight) +
            "l -50, 0" +
            arrSign +
            "l 0, -" + (this.pheight) + " " +
            arrSign +
            "l 50,0 " +
            "m 65,-65 " +
            "l 0,-120 " +
            arrSign +
            "l " + (this.recPwidth) + ",0" +
            arrSign +
            "l 0,120";

        image.boxPath.attr({'path': box_path});
        image.arrowPath.attr({'path': arrow_path});

        image.topText.attr({
            x: this.posx + (this.recPwidth / 2),
            y: 20,
            'text': this.pwidth
        });
        image.topTextBox.attr({
            //x: this.posx + (this.recPwidth / 2) - 10,
            //y: -10,
            //width: 120,
            //height: 60
            x: image.topText.getBBox().x,
            y: image.topText.getBBox().y,
            'width': image.topText.getBBox().width,
            'height': image.topText.getBBox().height,
        });

        image.leftText.attr({
            x: 20,
            y: this.posy + (this.pheight / 2),
            text: this.pheight
        });

        image.leftTextBox.attr({
            //x: 15,
            //y: this.posy + (this.pheight / 2) - 30,
            //width: 120,
            //height: 60
            x: image.leftText.getBBox().x,
            y: image.leftText.getBBox().y,
            'width': image.leftText.getBBox().width,
            'height': image.leftText.getBBox().height,
        });

        this.image = image;


    };



    Coupe.prototype.save = function () {

        var exp = {
            "pheight": this.pheight,
            "pwidth": this.pwidth,
            "gnuSize": this.gnuSize,
            "varWidth": this.varWidth,
            "insertVar": this.insertVar,
            "horizVar": this.horizVar,
            "type": this.type,
            "color": this.color,
            "gnu": this.gnu,
            "dov": this.dov,
            "stub": this.stub,
            "picture": this.picture,
            "svg": this.container.html(),
            "checker": this.checker,
            "numDoors": this.numDoors,
            "doors": []
        };
        console.log(exp);
        var x, y, z, door, div, area;
        for (x = 0; x < this.doors.length; x++) {
            door = this.doors[x];
            exp.doors[x] = {
                x: door.x,
                y: door.y,
                width: door.width,
                height: door.height,
                divs: {},
                areas: {},
                tree: door.tree
            };
            for (y in door.divs) {
                div = door.divs[y];
                exp.doors[x].divs[y] = {};
                for (z in div) {
                    if (z != 'door' && z != 'image') {
                        exp.doors[x].divs[y][z] = div[z];
                    }
                }

            }

            for (y in door.areas) {
                area = door.areas[y];

                exp.doors[x].areas[y] = {};
                for (z in area) {
                    if (z != 'door' && z != 'image') {
                        exp.doors[x].areas[y][z] = area[z];
                    }
                }

            }

        }

        return exp;
    };

    Coupe.prototype.getConfig = function () {

        let config = this.menu.config();
        this.pheight = config.pheight || 2600;
        this.pwidth = config.pwidth || 3200;
        this.gnuSize = config.gnuSize || 1;
        this.varWidth = config.varWidth || 26.1; ///L 51
        this.horizVar = config.horizVar || 50;
        this.insertVar = config.insertVar || 35;
        this.type = config.type || 18;
        this.color = config.color || 22;
        this.gnu = config.gnu || 53;
        this.dov = config.dov || false;
        this.stub = config.stub || false;
        this.picture = config.picture || false;
        this.checker = config.checker;
        this.numDoors = config.numDoors;

        if (config.numDoors == 1) {
            this.numDoors = config.numDoors;
            this.doorWidth = ((this.pwidth + this.varWidth) / 2);
            this.recPwidth = this.doorWidth * 2;
        } else {

            if (this.checker == 'true') {
                this.doorWidth = ((this.pwidth + (this.varWidth * (this.numDoors / 2))) / this.numDoors);
            } else {
                this.doorWidth = ((this.pwidth + (this.varWidth * (this.numDoors - 1))) / this.numDoors);
            }

            this.recPwidth = this.doorWidth * this.numDoors;
        }

        this.paperWidth = this.recPwidth / 5 + 400;
        this.paperHeight = this.pheight / 5 + 400;
        this.c = ((this.recPwidth + 850) / this.paperWidth);
        this.fontSize = (15 * this.c) + 'px';
    };

    Coupe.prototype.recalc = function () {

        let onumDoors = this.numDoors;
        let newar;
        let x;

        this.getConfig();


        if (onumDoors < this.numDoors) {
            for (x = 0; x < this.numDoors; x++) {
                if (x >= onumDoors) {
                    var door = this.addDoor(x);
                    newar = door.addArea({type: 'root'});
                    door.tree = {};
                    door.tree[newar.aid] = {};
                    door.render();
                }
            }
        } else if (onumDoors > this.numDoors) {

            for (x = this.doors.length - 1; x >= this.numDoors; x--) {
                this.remDoor(x);
            }

        }

        for (x in this.doors) {
            this.doors[x].clear();
            this.doors[x].recalc();
            this.doors[x].render();

        }
        this.render();

    };


    Coupe.prototype.reset = function () {

        this.getConfig();

        this.paper.clear();
        this.image = {};
        Area._aid = 0;
        Divider._divId = 0;
        this.doors = [];

        for (var x = 0; x < this.numDoors; x++) {
            var door = this.addDoor(x);

            door.addArea({type: 'root'});
            door.tree = {};
            door.tree[x] = {};
            door.render();
        }
        this.render();
    };

    return new Coupe();
}());
