$(function() {
if (window.File && window.FileReader && window.FileList && window.Blob) {

    function upload() {
        var files = document.getElementById("files").files; // FileList object

        for (var i=0, f; f=files[i]; i++){
            var reader = new FileReader();
            reader.onload = function(progressEvent){
                console.log(this.result);
            };
            reader.readAsText(f)
        };
    };

    document.getElementById('submit-button').addEventListener("click", upload);
} else {
	alert('The File APIs are not fully supported in this browser.');
}

});
