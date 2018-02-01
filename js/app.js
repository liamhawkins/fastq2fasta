if (window.File && window.FileReader && window.FileList && window.Blob) {
	var zip = new JSZip();
	var numRemaining = 0;

    document.getElementById('submit-button').addEventListener("click", uploadFiles);

    function isValidRead(read) {
        return read[0][0] == "@" && read[2][0] == "+" && read[1].length === read[3].length
    };

    function convert(fastq_reads) {
        var fasta_reads = [];

        for (var i = 0; i < fastq_reads.length; i++) {
            fastq_reads[i][0] = ">" + fastq_reads[i][0].substring(1);
            fastq_reads[i].splice(2,2)
        }
        return fastq_reads
    };

	function readsToString(reads) {
		return reads.map(e => e.join('\n')).join('\n\n');
	};

    function parseFile(file) {
        // Check if fastq/fq extension
        var file_ex = file.name.split('.')[1];
        var reader = new FileReader();

        if(file_ex != 'fastq' && file_ex != 'fq'){
           document.getElementById('error').innerHTML = file.name + " is not a fastq file" ;
           return true;
        };

		// When file has been loaded process it
        reader.onload = function(progressEvent){
			// Split file into array of lines
            var file_array = this.result.split('\n');
			var fastq_reads = [];
			var fasta_reads = [];
			var i = 0;

            // remove blank lines
            file_array = file_array.filter(function(elem){
                return elem !== "";
            });
			// Create array containing verified FASTQ reads (4 lines)
            for (i=0; i<file_array.length; i+=4) {
                if (isValidRead(file_array.slice(i,i+4))){
                    fastq_reads.push(file_array.slice(i,i+4))
                }else{
                    // TODO: DEAL WITH INVALID READS
                    console.log("INVALID READ")
                }
            };
			// Convert verified FASTQ reads to FASTA reads
            fasta_reads = convert(fastq_reads);
			// Add FASTA files to zip file
            zip.file(file.name.split('.')[0] + '.fa', readsToString(fasta_reads));
            numRemaining--;
			// When all FASTA files have been created and zipped, download zip
            if (numRemaining == 0) {
                zip.generateAsync({type:"blob"})
				.then(function (blob) {
					saveAs(blob, "fasta_files.zip");
				});
            }
        };

        reader.readAsText(file)
    };

    function uploadFiles() {
        var files = document.getElementById("files").files; // FileList object
		var i=0;
		var file;

        numRemaining = files.length;
        for (i=0; file=files[i]; i++){
            parseFile(file);
        };
    };


} else {
	alert('The File APIs are not fully supported in this browser.');
}
