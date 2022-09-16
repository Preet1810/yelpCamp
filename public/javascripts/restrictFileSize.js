let input = document.querySelector('#image');
let span = document.querySelector('#FileError');
input.addEventListener('change', () => {
    let files = input.files;

    if (files.length > 0) {
        if (files[0].size > 500000) { //500Kb
            span.innerText = 'File Size Exceeds 500 kb, You can not upload an Image above 500 kb';
            return;
        }
    }
    span.innerText = '';
});