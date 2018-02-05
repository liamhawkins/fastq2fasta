if (window.File && window.FileReader && window.FileList && window.Blob) {

	var zip = new JSZip();
	var numRemaining = 0;

    document.getElementById('submit-button').addEventListener("click", convertButton);

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

		// When file has been loaded process it
        reader.onload = function(progressEvent){
			var files = document.getElementById("files").files;

			fastaReads = processFileOrText(this.result);
			if (files.length === 1 && fastaReads.length > 0) {
				var blob = new Blob([readsToString(fastaReads)], {type: "text/plain;charset=utf-8"});
				saveAs(blob, files[0].name.split('.')[0] + ".fa");
				clearInputs();
			} else {
				if (fastaReads.length > 0) {
					// Add FASTA files to zip file
					zip.file(file.name.split('.')[0] + '.fa', readsToString(fastaReads));
				} else {
					alert(file.name + ": NO VALID READS");
				}
				numRemaining--;
				// When all FASTA files have been created and zipped, download zip
				if (numRemaining == 0) {
					zip.generateAsync({type:"blob"})
					.then(function (blob) {
						saveAs(blob, "fasta_files.zip");
						clearInputs();
					});
				}
			}
		}
        reader.readAsText(file)
    };

    function processFileOrText(rawReads) {
        var rawReadArray = rawReads.split('\n');
        var fastqReads = [];
        var i = 0;

        rawReadArray = rawReadArray.filter(function(elem){
            return elem !== "";
        });

        for (i = 0; i < rawReadArray.length; i+=4) {
            if (isValidRead(rawReadArray.slice(i,i+4))) {
                fastqReads.push(rawReadArray.slice(i,i+4))
            } else {
                // TODO: DEAL WITH INVALID READS
                console.log("INVALID READ");
            }
        };
        // Convert verified FASTQ reads to FASTA reads
        fastaReads = convert(fastqReads);
        return fastaReads;

    };

    function parseText(text) {
        fastaReads = processFileOrText(text);
		if (fastaReads.length > 0) {
			var blob = new Blob([readsToString(fastaReads)], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "fastq2fasta.fa");
			clearInputs();
		} else {
			alert("NO VALID READS");
			clearInputs();
		}
    };
	function clearInputs() {
		$("#files").filestyle('clear');
		document.getElementById("fastqText").value = "";
        // jquery-loading-overlay
        $.LoadingOverlay("hide");
	};

    function convertButton() {
        // jquery-loading-overlay
        $.LoadingOverlay("show");
        var files = document.getElementById("files").files; // FileList object
        var text = document.getElementById("fastqText").value;
		var i=0;
		var file;

        if (files.length === 0 && text.length === 0) {
            alert("Please enter text or files");
        } else if (files.length > 0) {
            numRemaining = files.length;
            for (i=0; file=files[i]; i++){
                parseFile(file);
            };
		} else {
            parseText(text);
        }

    };


} else {
	alert('The File APIs are not fully supported in this browser.');
}
