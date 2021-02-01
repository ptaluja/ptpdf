// Copyright (c) 2017 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// This software is licensed under a MIT License
// https://github.com/workhorsy/uncompress.js

let fileInput = document.getElementById('fileInput');
let entryList = document.getElementById('entryList');
let errorList = document.getElementById('errorList');
var arr1 = [];
var arr2 = [];

var ans = 0;

function onArchiveLoaded(archive) {
    let is_error = false;
    ans = archive.entries.length;

    archive.entries.forEach(function(entry) {
        if (!entry.is_file) return;
        if (is_error) return false;

        entry.readData(function(data, err) {
            if (err) {
                is_error = true;
                errorList.innerHTML = err;
                entryList.innerHTML = '';
                return;
            }

            arr1.push(entry.name);
            arr2.push(data);
        });
    });

}


function zip() {
    var zip = new JSZip();
    for (var j = 0; j < ans; j += 1) {
        var file = arr2[j];
        zip.file(arr1[j], arr2[j]);

    }

    zip.generateAsync({
        type: "blob"
    }).then(function(content) {
        var a = URL.createObjectURL(content);
        saveAs(a, "download");
        location.reload();

    });
}

// Load all the archive formats
loadArchiveFormats(['rar'], function() {
    fileInput.onchange = function() {
        // Just return if there is no file selected
        if (fileInput.files.length === 0) {
            entryList.innerHTML = 'No file selected';
            return;
        }

        // Get the selected file
        let file = fileInput.files[0];

        let password = "";

        // Open the file as an archive
        archiveOpenFile(file, password, function(archive, err) {
            if (archive) {
                console.info('Uncompressing ' + archive.archive_type + ' ...');
                entryList.innerHTML = '';
                onArchiveLoaded(archive);
            } else {
                entryList.innerHTML = '<span style="color: red">' + err + '</span>';
            }
        });
    };

    fileInput.disabled = false;

});