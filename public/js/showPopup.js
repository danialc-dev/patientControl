export function showPopup(message, color) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    popup.style.backgroundColor = color;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('show');
    }, 100);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}