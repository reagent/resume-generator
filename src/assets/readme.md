# Résumé Generator

This is the content that can be rendered and inserted into your template to be
eventually rendered as a PDF. When writing your [EJS] templates, you can have
access to fonts and rendered content.

To embed a font file in your document, you can use the `fonts.embed` function
call:

```ejs
<html>
  <head>
    <style>
      <%- fonts.embed('Cambria.ttf') %>

      body {
        font-family: "Cambria";
      }
    </style>
  </head>
  <body>
    <!-- Your body content goes here -->
  </body>
</html>
```

Content is available using `content.render` with the ID of the file in the
from the location on the filesystem:

```ejs
<body>
  <%- content.render('readme') %>
</body>
```

[EJS]: https://ejs.co/
