class HelloWorldComponent extends HTMLElement {
    connectedCallback() {
        var s = this.textContent;

        this.textContent = 'hello '+s;
        
    }
}
customElements.define('x-hello-world', HelloWorldComponent);
