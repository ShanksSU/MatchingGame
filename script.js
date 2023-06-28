let checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));

checkboxes.forEach(checkbox => {
    checkbox.onclick = function() {
        if (this.checked) {
            this.disabled = true;
        }
    }
});

async function handleReset(name) {
    console.log(name);
    checkboxes.forEach(checkbox => {
        checkbox.disabled = false;
        checkbox.checked = false;
    });
    await play(name);
}

async function play(name) {
    const buffer = await getBuffer(name + ".aac");
    buffer && playAudio(buffer);
}

const audioContext = new AudioContext();
const playAudio = function (buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
};

const getBuffer = function (url) {
    const request = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = () => {
        audioContext.decodeAudioData(request.response, (buffer) =>
            buffer ? resolve(buffer) : reject("decoding error")
        );
        };
        request.onerror = (error) => reject(error);
        request.send();
    });
};
