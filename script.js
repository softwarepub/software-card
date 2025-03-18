import { registerHello } from './components/hello.js';

import { registerAvatarComponent } from './components/avatar.js';
const app = () => {
    registerHello();
    registerAvatarComponent();
}
document.addEventListener('DOMContentLoaded', app);

