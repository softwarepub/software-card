class Dash extends HTMLElement {
    connectedCallback() {
        this.textContent = "hello";
        if (!this.querySelector('img')) {
            this.append(document.createElement('img'));
        }
        this.update();
    }

    static get observedAttributes() {
        return ['src', 'alt'];
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        const img = this.querySelector('img');
        if (img) {
            img.src = this.getAttribute('src');
            img.alt = this.getAttribute('alt') || 'dash';    
        }
    }
}
export const registerDashComponent = () => {
    customElements.define('x-dash', Dash);
}