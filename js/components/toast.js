/**
 * Shows a premium toast notification
 * @param {string} message - Content of the toast
 * @param {string} type - 'success', 'error', or 'info'
 * @param {number} duration - Time in ms before auto-removal
 */
export function showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toast-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Override duration if it's a cart notification
    const finalDuration = type === 'cart' ? 3000 : duration;

    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <span class="toast-close">&times;</span>
    `;

    container.appendChild(toast);

    // Trigger Entrance
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    const remove = () => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove()
        }, { once: true });
    };

    // Auto-remove
    const timer = setTimeout(remove, finalDuration);

    // Manual close
    toast.querySelector('.toast-close').onclick = () => {
        clearTimeout(timer);
        remove();
    };
}