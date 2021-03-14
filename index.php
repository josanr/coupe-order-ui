<?php
$insert = [];
$menu = [];

require_once ("components/header.php");
require_once ("db/db.php");
?>
<style>
    label, div.span2 {
        margin-left: 10px !important;
    }

</style>

<div class="alert alert-error" id="alertError" style="display: none;">

</div>

<div class="well well-small" id="topMenu">
    <div class="row-fluid">
        <div class="span2" style="margin: 0; text-align: center">Проём</div>
    </div>

    <div class="row-fluid">
        <label class="span1 control-group">
            Высота
            <input type="text" class="input-block-level pheight"/>
        </label>
        <label class="span1 control-group">
            Ширина
            <input type="text" class="input-block-level pwidth"/>
        </label>
        <label class="span1 control-group" style="white-space: nowrap;">Кол. двер:<br/>
            <select class="input-block-level numDoors">

            </select>
        </label>

        <label class="span2">
            Профиль:<br/>
            <select class="input-block-level gpType">

            </select>
        </label>
        <label class="span2">
            Цвет:<br/>
            <select class="input-block-level gpColor">

            </select>
        </label>


        <label class="span1">
            Разделитель
            <select class="input-block-level divType">
                <option value="53">1мм</option>
                <option value="38">7мм</option>
            </select>
        </label>
        <div class="span1">
            <label>
                Доводчик.
                <input type="checkbox" class="dov"/>
            </label>
        </div>

        <div class="span1">
            <label>
                Витраж<br/>
                <input type="checkbox" class="picture" name="picture"/>
            </label>
        </div>
        <div class="span1">
            <label>
                Заглушка.
                <input type="checkbox" class="stub"/>
            </label>
        </div>
        <div class="span2 dividers" style="margin:15px 0 15px 30px; width: 130px">
            <div class="btn-group input-block-level">
                <button type="button" class="btn dividers" data-divtype="horiz">Гориз</button>
                <button type="button" class="btn dividers" data-divtype="vert">Верт</button>
            </div>
        </div>


    </div>
    <div class="row-fluid">
        <div class="span2">
            <button class="btn reset">Сбросить вставки</button>
        </div>
        <div class="span2 price pull-right" style="display: none" >
            <button class="btn calc">Стоимость:</button>
        </div>
        <div class="span2 price pull-right" >
            <button id="reset" class="btn reset">Сбросить</button>
        </div>
    </div>


</div>


<div id="workarea">
    <div id="svgCont" style="margin:0 auto;">

    </div>
</div>


<button id="save" class="btn btn-primary pull-right">Сохранить</button>
<a style="display:none" href="#" id="showPdf" target="_blank">pdf</a>


<div class="modal hide" id="sizesPopMod">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Размер вставки</h3>
    </div>
    <div class="modal-body">
        <div class="span2">
            <label for="manualHeight">Высота:
                <input type="number" style="width: 120px;margin:0; " class="manualHeight"/>
            </label>
        </div>
        <div class="span2">
            <label>Ширина:
                <input type="number" style="width: 120px;margin:0; " class="manualWidth"/>
            </label>
        </div>
    </div>
    <div class="modal-footer">
        <a data-toggle="modal" data-target="#sizesPopMod" class="btn">Close</a>
        <a class="btn btn-primary setSizes">OK </a>
    </div>
</div>


<div class="modal hide" id="doorWidthMod">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Ширина двери</h3>
    </div>
    <div class="modal-body">
        <div style="width:200px; margin: 0 auto;">
            <input type="number" style="width: 120px;margin:0; " class="width" min="400" max="1250" step="0.01"/>
        </div>
    </div>
    <div class="modal-footer">
        <a data-toggle="modal" data-target="#doorWidthMod" class="btn">Close</a>
        <a class="btn btn-primary setWidth">OK </a>
    </div>
</div>

<div class="modal hide" id="doorInsertMod">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Добавить вставку</h3>
    </div>
    <div class="modal-body" style="height: 500px;max-height: 700px;">
        <div class="">
            <input type="text" class="filterQuery input-block-level" placeholder="Фильтр"/>
            <br/>
            <select size="23" class="insertList" style="width:100%">

            </select>
        </div>
        <label>Развернуть текстуру: <input type="checkbox" class="rotateTexture"/></label>
    </div>
    <div class="modal-footer">
        <a data-toggle="modal" data-target="#doorInsertMod" class="btn">Close</a>
        <a class="btn btn-primary doorInsertSet">OK </a>
    </div>
</div>


<div class="modal hide" id="priceModal" style="width: 900px; max-width: 900px;">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Цена.</h3>
    </div>
    <div class="modal-body" id="bodyPriceModal" style="height: 600px; max-height: 600px">

    </div>

    <div class="modal-footer">
        <a data-toggle="modal" data-dismiss="modal" class="btn">Close</a>
    </div>
</div>


<script>
    let menuStruct ={"18":{"name":"Открытый","variable":26.100000000000001,"insertDiff":35,"horizDiff":50,"color":{"22":"Серебро","23":"Золото","24":"Шампань","26":"Коньяк","25":"Венге","29":"Шампань глянец","30":"Венге глянец","58":"Белый глянец","184":"Графит"}},"19":{"name":"Закрытый","variable":32,"insertDiff":47,"horizDiff":62,"color":{"22":"Серебро","23":"Золото","24":"Шампань","26":"Коньяк","29":"Шампань глянец","30":"Венге глянец","25":"Венге","58":"Белый глянец"}},"20":{"name":"Плоский","variable":39,"insertDiff":63,"horizDiff":76,"color":{"22":"Серебро","23":"Золото","24":"Шампань","26":"Коньяк","29":"Шампань глянец","25":"Венге","30":"Венге глянец","184":"Графит"}},"21":{"name":"Contour","variable":41,"insertDiff":35,"horizDiff":50,"color":{"22":"Серебро","24":"Шампань","25":"Венге","29":"Шампань глянец","30":"Венге глянец"}},"178":{"name":"L","variable":26.100000000000001,"insertDiff":35,"horizDiff":50,"color":{"22":"Серебро","58":"Белый глянец","114":"Чёрный","24":"Шампань","184":"Графит"}}};
    let insertList =<?= $plateList ?>;


</script>


<script src="js/raphael-min.js" ></script>
<script src="js/index.min.js" ></script>



<?php
require_once ("components/footer.php");