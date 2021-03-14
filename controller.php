<?php

if($_POST["order"]){

    $order = $_POST["order"];

    $filename = "order";

    $zipfileName = tempnam(sys_get_temp_dir(), "zip");
    $zip = new ZipArchive();
    $zip->open($zipfileName, ZipArchive::OVERWRITE);
    $zip->addFromString($filename, $order);

    $zip->close();
    $handle = fopen($zipfileName, "rb");
    $contents = fread($handle, filesize($zipfileName));
    fclose($handle);
    unlink($zipfileName);

    echo json_encode([
        "content" => base64_encode($contents),
        "link" => "/"
    ]);


}