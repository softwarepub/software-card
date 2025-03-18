import { showMessage } from './components/hello.js';

window.showImportedMessage = function showImportedMessage() {
    showMessage();
}

import { registerAvatarComponent } from './components/avatar.js';
const app = () => {
    registerAvatarComponent();
}
document.addEventListener('DOMContentLoaded', app);

