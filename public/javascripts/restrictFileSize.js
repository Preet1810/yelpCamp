let input=document.querySelector('#image');
let span=document.querySelector('#FileError');
input.addEventListener('change', () => {
    let files=input.files;

    if (files.length>0) {
        if (files[0].size>2000000) { //2 MB
            span.innerText='File Size Exceeds 2 MB, You can not upload an Image above 2 MB';
            return;
        }
    }
    span.innerText='';
});

