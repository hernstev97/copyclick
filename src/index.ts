// @TODO refactor -- export everything into separate files
// darkmode
const changeColorMode = (isDark: Boolean) => {
    if (isDark)
        document.body.classList.add('darkmode');
    else
        document.body.classList.remove('darkmode');
}

const mq = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = mq.matches;
changeColorMode(isDark);

mq.addEventListener('change', function (evt) {
    const isDark = evt.matches;
    changeColorMode(isDark);
});

// selectors
const pastearea = document.querySelector('textarea.pastearea') as HTMLTextAreaElement;
const copybox = document.querySelector('div.pastearea') as HTMLDivElement;
const clearPasteAreaButton = document.querySelector('#clear-pastearea') as HTMLButtonElement;
const copyTextButton = document.querySelector('#copy-text') as HTMLButtonElement;
const copyFeedbackBlip = document.querySelector('.copy-feedback') as HTMLParagraphElement;
const editModeCheckbox = document.querySelector('#editmode') as HTMLInputElement;

const displayPasteBoxClass = "paste-enabled" as string;
const displayCopyBoxClass = "copy-enabled" as string;
const localStorageItem = "pastedText" as string;
const pastedText = localStorage.getItem(localStorageItem) as string;

// event listeners
window.onload = function () {
    // if (pastedText) {
    //     pastearea.value = pastedText;
    //     copybox.innerHTML = pastedText;
    //     console.log(pastedText)
    // }
    pastearea.value = "";
    editModeCheckbox.checked = true;

    textBoxResizeToFitContent(pastearea, copybox);
}

if (pastearea.value == "") {
    editModeCheckbox.checked = true;
}

editModeCheckbox.addEventListener('change', () => {
    determineStateByEditCheckbox();
    copybox.setAttribute("style", `height:${pastearea.style.height}`);
})

pastearea.addEventListener('input', () => {
    textBoxResizeToFitContent(pastearea, copybox);

    // localStorage.setItem(localStorageItem, pastearea.value);

    copybox.innerHTML = pastearea.value;
});

pastearea.addEventListener('paste', () => {
    setTimeout(() => {
        console.log("text was pasted in: ", pastearea.value);

        // localStorage.setItem(localStorageItem, pastearea.value);
        editModeCheckbox.checked = false;
        setStateToCopy();
    })
})

clearPasteAreaButton.addEventListener('click', () => {
    pastearea.value = "";
    copybox.innerHTML = "";

    editModeCheckbox.checked = true;
    setStateToEdit();

    textBoxResizeToFitContent(pastearea, copybox);
});

copybox.addEventListener('click', () => copyTextToClipboard());

// functions
function textBoxResizeToFitContent(textarea: HTMLTextAreaElement, copybox: HTMLDivElement) {
    console.log("ping")
    textarea.style.height = "";
    textarea.style.height = textarea.scrollHeight + 10 +"px"
    
    copybox.style.height = "";
    copybox.setAttribute("style", `height:${pastearea.style.height}`);
}

function copyTextToClipboard() {
    navigator.clipboard.writeText(pastearea.value);
    console.log(pastearea.value)
    copyFeedbackBlip.classList.add("copied");

    setTimeout(() => {
        copyFeedbackBlip.classList.remove("copied");
    }, 300)
}

function setStateToEdit() {
    pastearea.classList.add(displayPasteBoxClass)
    copybox.classList.remove(displayCopyBoxClass)
}

function setStateToCopy() {
    pastearea.classList.remove(displayPasteBoxClass)
    copybox.classList.add(displayCopyBoxClass)
}

function determineStateByEditCheckbox() {
    if (editModeCheckbox.checked == false) {
        setStateToCopy();
    } else {
        setStateToEdit();
    }
}