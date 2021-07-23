Test Upload with cURL:

`curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImlhdCI6MTYyNjgyMDE3OCwiZXhwIjoxNjI5NDEyMTc4fQ.jZUOjaxpAvHbj6ybnn9gYC9XkysGEwaWfVj1FXSXC98" localhost:1337/graphql   -F operations='{ "query": "mutation test ($file: Upload!) { upload(file: $file) { id } }", "variables": { "file": null } }'   -F map='{ "0": ["variables.file"] }'   -F 0=@music.mp3`
