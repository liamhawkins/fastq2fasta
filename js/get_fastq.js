function get_fastq() {
    var fastq_text_box = document.getElementById("fastqText");
    var fastq_file = document.getElementById("fastq_file");
    var debug_file = document.getElementById("debug_file");
    var debug_text = document.getElementById("debug_text");

    debug_file.innerHTML = fastq_file.value;
    debug_text.innerHTML = fastq_text_box.value;

}


