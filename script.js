import { name, registerHello } from './components/hello.js';
import { registerAvatarComponent } from './components/avatar.js';
const app = () => {
    registerHello();
    registerAvatarComponent();
}
document.addEventListener('DOMContentLoaded', app);

console.log(name);
document.getElementById('test').innerHTML = "script war hier "+name;

