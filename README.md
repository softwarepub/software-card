# Test

This repository hosts GitLab pages at: <https://pape58.pages.hzdr.de/software-card-gitlab-test/>

These pages contain:

- an app that represents a future "Software CaRD dashboard" which runs in your browser
- an example validation report that can be loaded by the app

## Host the Pages Locally

To run the code, serve the `public` directory with a web server and navigate to <http://127.0.0.1:8000>.

With Python:

```bash
python -m http.server -d public -b 127.0.0.1 8000
```

With PHP:

```bash
php -S 127.0.0.1:8000 -t public
```
