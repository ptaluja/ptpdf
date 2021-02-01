let fileInput = document.getElementById('fileInput');
let entryList = document.getElementById('entryList');
let errorList = document.getElementById('errorList');
var i = 0;
var ans = 0;
var arr = [];
var rar = "";

function onArchiveLoaded(archive) {
    let is_error = false;
    console.log(archive.file_name);
    rar = archive.file_name;
    ans = archive.entries.length;
    archive.entries.forEach(function(entry) {
        if (!entry.is_file) return;
        if (is_error) return false;
        arr.push(entry);
        entry.readData(function(data, err) {
            if (err) {
                is_error = true;
                errorList.innerHTML = err;
                entryList.innerHTML = '';
                return;
            }

            entryList.innerHTML +=
                '<b>Name:</b> ' + entry.name + '<br />' +
                '<b>Compressed Size:</b> ' + entry.size_compressed + '<br />' +
                '<b>Uncompressed Size:</b> ' + entry.size_uncompressed + '<br />';

            let url = URL.createObjectURL(new Blob([data]));
            entryList.innerHTML += '<a class="done" href="' + url + '" download="' + entry.name + '" ><font color="white">download</font></a>' + '<br />';
            i++;
            entryList.innerHTML += '<hr />';
        });
    });

}


//download all

function download() {
    if (rar != "") {
        for (let index = 0; index < ans; index++) {
            var button = document.getElementsByClassName("done");
            button[index].click();
        }
    } else { alert("please enter the compressed file"); }


}



// Load all the archive formats
loadArchiveFormats(['rar', 'zip', 'tar'], function() {
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
