export default function showError(container, message) {
    container.innerHTML = `
        <div>
            <h2>An error occurred!</h2>
            <p><span class="bold">Error: </span><span class="italic">${message}</span></p>
        </div>
    `;
}
