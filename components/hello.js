export const name = "square";

class HelloWorldComponent extends HTMLElement {
    connectedCallback() {
        var s = this.textContent;

        this.textContent = 'hello '+s;

    }
}
export const registerHello = () => {
    customElements.define('x-hello-world', HelloWorldComponent);
}
