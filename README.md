# Software CaRD

Software CaRD: A curation and reporting dashboard for compliant FAIR software publications.

This repository hosts GitLab pages at: <https://software-metadata.pub/software-card/>

These pages contain:

- an app that represents a future "Software CaRD dashboard" which runs in your browser
- an example validation report that can be loaded by the app
- an example curation view
- an example reporting view

You can navigate to the [CI pipelines](https://codebase.helmholtz.cloud/pape58/software-card-gitlab-test/-/pipelines)
and within any `pages` job click the URL below "Generating dashboard URL ...".
This will load the associated pipeline into your Software CaRD dashboard.

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
