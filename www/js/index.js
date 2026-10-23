/*
 * $Id: index.html Oct 9, 2023 9:34:35 AM tta2627$
 * 
 * Copyright (C) 2023 Maider Huarte Arrayago
 * 
 * This file is part of TTA2627_08v3_www.zip.
 * 
 * TTA2627_08v3_www.zip is based on templates by Apache Software Foundation (ASF) 
 * and it is intended for learning purpouses only.
 *  
 * TTA2627_08v3_www.zip is free software: you can redistribute it and/or modify
 * it under the terms of the Apache License, Version 2.0.
 * 
 * TTA2627_08v3_www.zip is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
	// Cordova is now initialized. Have fun!

	console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

	appSession.loadSessionPages();

	// Lehen orriarekin honek arazoak eman ditzake, HTML injektatzen hasten bagara hemen.
	// Estilorik gabe kargatzen badira gauza batzuk, "enhancement" (dekorazio prozesuaren izena) egitera behartu daiteke lerro honekin:
	// $("#page-t-0").trigger("create");

    fileUtils.createStorageDirs_E(
        cordova.file.externalDataDirectory,
        ["audio"],
        "path",
        function() {
            console.log("Audio directory ready");
        },
        function(error) {
            console.error("Could not create audio directory:", error);
        }
    );
}

$(document).on("pagebeforecreate", "[data-role=page]", function () {
    var $page = $(this);

    // 1. Build header (identical on almost every page)
    if ($page.data("header") !== "custom") {
        $page.prepend(buildHeader());
    }

    // 2. Build footer from per-page data-attributes
    $page.append(buildFooter(
        $page.data("back"),        // e.g. "#page-t-1" or "back" (history) or "exit"
        $page.data("back-label"),  // e.g. "Atzera (P2)"
        $page.data("next"),        // e.g. "#page-t-4" or undefined
        $page.data("next-label"),  // e.g. "Sorta berria (P4)"
        $page.data("next-icon")    // e.g. "plus"
    ));
});

$(document).on("vclick", ".btn-exit", function (e) {
    e.preventDefault();
    if (navigator.app && navigator.app.exitApp) {
        navigator.app.exitApp();          // native exit
    } else {
        $(":mobile-pagecontainer").pagecontainer("change", "#page-t-0"); // browser fallback
    }
});