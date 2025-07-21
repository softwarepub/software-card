"""Helper script to generate and print a fake dashboard URL.

The script constructs a dashboard URL for the current environment using predefined CI
variables: https://docs.gitlab.com/ci/variables/predefined_variables/

The URL points to the GitLab pages of this repository which hosts the static pages for
the test app that can be found in the ``public`` directory.
"""

import os
import sys

pages_url = os.environ.get("CI_PAGES_URL")
if pages_url is None:
    print("CI_PAGES_URL ?", file=sys.stderr)
    sys.exit(1)

project_id = os.environ.get("CI_PROJECT_ID")
if project_id is None:
    print("CI_PROJECT_ID ?", file=sys.stderr)
    sys.exit(1)

pipeline_id = os.environ.get("CI_PIPELINE_ID")
if pipeline_id is None:
    print("CI_PIPELINE_ID ?", file=sys.stderr)
    sys.exit(1)

# good enough ;-)
print(
    f"{pages_url}/callback"
    f"?gitlab_project_id={project_id}"
    f"&gitlab_pipeline_id={pipeline_id}"
)
