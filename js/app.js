if (window.File && window.FileReader && window.FileList && window.Blob) {

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

    function parse_file(file) {
    // TODO: Validate FASTQ format
    // TODO: Write to file


        // Check if fastq/fq extension
        var file_ex = file.name.split('.')[1];
        if(file_ex != 'fastq' && file_ex != 'fq'){
           document.getElementById('error').innerHTML = file.name + " is not a fastq file" ;
           return true;
        };

        var reader = new FileReader();
        reader.onload = function(progressEvent){

            var file_array = this.result.split('\n');

            // remove blank lines
            file_array = file_array.filter(function(elem){
                return elem !== "";
            });

            var fastq_reads = [];

            for (var i=0; i<file_array.length; i+=4) {
                if (isValidRead(file_array.slice(i,i+4))){
                    fastq_reads.push(file_array.slice(i,i+4))
                }else{
                    // TODO: DEAL WITH INVALID READS
                    console.log("INVALID READ")
                }
            };
            console.log("FASTQ reads:");
            console.log(fastq_reads);

            var fasta_reads = convert(fastq_reads);
            console.log("FASTA reads:");
            console.log(fasta_reads);
        };

        reader.readAsText(file)

    };

    function upload() {

        var files = document.getElementById("files").files; // FileList object

        for (var i=0, f; f=files[i]; i++){
            parse_file(f);
        };
    };

    document.getElementById('submit-button').addEventListener("click", upload);

} else {
	alert('The File APIs are not fully supported in this browser.');
}
