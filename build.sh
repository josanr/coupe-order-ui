#!/bin/bash

java -jar ../compiler.jar --js js/load.js --js_output_file js/load.min.js
java -jar ../compiler.jar --js js/core.js --js_output_file js/core.min.js
java -jar ../compiler.jar --js js/print_connect.js --js_output_file js/print_connect.min.js
java -jar ../compiler.jar --js js/tables.js --js_output_file js/tables.min.js


