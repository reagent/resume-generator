# Résumé Generator

This is a commandline utility that allows you to generate a PDF résumé from a
collection of [Markdown] content and associated template(s).

- [Installation](#installation)
- [Quickstart](#quickstart)
- [Deeper Dive](#deeper-dive)
  - [Initializing the Directory](#initializing-the-directory)
  - [Working with Templates](#working-with-templates)
    - [Defining and Using Content Blocks](#defining-and-using-content-blocks)
    - [Using Custom Fonts](#using-custom-fonts)
    - [Configuring Output](#configuring-output)
  - [Generating Your PDF](#generating-your-pdf)
- [Contributing](#contributing)
- [Copyright](#copyright)

## Installation

Install globally with Yarn:

```
yarn global add @reagent/resume-generator
```

Or NPM:

```
npm install --global @reagent/resume-generator
```

## Quickstart

This tool ships with some sample files that will allow you to create and iterate
on your résumé:

```
resume init my-resume && resume generate my-resume
```

You can now open the generated PDF file to see the result (macOS):

```
open my-resume/output/resume.pdf
```

You can modify the included content and templates and re-run the `generate`
subcommand to generate a new PDF file.

## Deeper Dive

This tool is designed to separate the content of your résumé ([Markdown] files)
from the presentation ([EJS] template files) of said content. Your content files
and template file are combined to build an HTML document that can then be
rendered as a PDF.

### Initializing the Directory

Start by using the `init` subcommand to create the directory template:

```
resume init my-resume
```

This creates the following structure:

```
my-resume
├── assets
│   └── fonts
│       └── icons.ttf
├── config.json
├── content
│   └── readme.md
└── templates
    └── resume.html.ejs
```

The major components of importance are:

- `templates` - The location of template files that determine the pages and
  layout for your résumé. This becomes the HTML that is rendered and used to
  generate the final PDF. See [Working with Templates](#working-with-templates)
  for more details.
- `content` - Directory where Markdown-formatted source content is located. The
  content is designed to be modular in order to be mixed and matched inside of
  your template(s). See [Defining and Using Content Blocks](#defining-and-using-content-blocks)
  for more.
- `config.json` - Configuration file that determines the templates used, the
  output filename, and any additional PDF formatting options. See [Configuring Output](#configuring-output)
  for details.

### Working with Templates

The `templates` directory contains one or more [Embedded JavaScript templates][EJS]
that define the layout and formatting of any content you provide.

#### Defining and Using Content Blocks

Any Markdown files you add to the `content` directory will be available to embed
in your EJS templates. For example, this content file:

```md
<!-- content/summary.md -->

# Summary

I am a great ape characterized by my hairlessness, bipedalism, and high
intelligence. I have a large brain, which provides me with more advanced
cognitive skills that enable me to thrive and adapt in varied environments.
```

Can now be embedded and rendered as part of a template:

```ejs
<!-- templates/resume.html.ejs -->
<!doctype html>
<html>
  <head>
    <title>About Me</title>
  </head>
  <body>
    <%- content.render('summary') %>
  </body>
</html>
```

> _**Note**: Your content files must end with the `.md` extension in order to be
> discovered and rendered._

As you add more content to embed in your templates, you're not limited to a
single directory - you can nest content in subdirectories as well:

```md
<!-- content/experience/bigco.md -->

### Software Engineer

#### [BigCo] | January 2000 - Present

- Built a cutting-edge software platform to deliver widgets faster and at a
  lower cost to the company
- Improved throughput of our widget-ordering system by replacing our slow
  JSON-over-HTTP service layer with GRPC inside of an event-based architecture

[BigCo]: https://bigco.example
```

You need only to include the subdirectory when embedding the content:

```ejs
<%- content.render('experience/bigco') %>
```

#### Using Custom Fonts

You can further customize the formatting of your résumé by adding additional
font files and including them in your template. Simply drop your font file
(`.ttf`, `.woff`, or `.woff2`) in the `assets/fonts` directory and include it in
your template:

```ejs
<!doctype html>
<html>
  <head>
    <style>
      <%- fonts.embed('SuperSpecialCustomFont.ttf') %>

      body {
        font-family: "SuperSpecialCustomFont";
      }
    </style>
  </head>
  <body><%- content.render('summary') %></body>
</html>
```

This will create the necessary [`@font-face` CSS rule][@font-face] to make it
available in your rendered HTML document.

> _*Note*: You can find a additional web fonts on the Internet at places like
> [Google Fonts] or even icon fonts at [Fontello]._

### Configuring Output

The default `config.json` defines the input, output, and formatting of your
final PDF file:

```json
{
  "filename": "resume.pdf",
  "templates": ["resume.html.ejs"],
  "options": {
    "margins": {
      "top": "0.25in",
      "bottom": "0.25in",
      "left": "0.25in",
      "right": "0.25in"
    }
  }
}
```

By default, it generates a file named `output/resume.pdf` from the
`templates/resume.html.ejs` template file. You can change the output filename
as desired or even use different templates that will be combined into your
resulting PDF:

```json
{
  "filename": "my-awesome-resume.pdf",
  "templates": ["page-1.html.ejs", "page-2.html.ejs"]
}
```

You can also change the [margins to any values supported][PDFMargin] by
[Puppeteer] (used for HTML -> PDF rendering).

## Generating Your PDF

Once everything is configured, you need only to run the `generate` subcommand:

```
resume generate my-resume
```

The resulting PDF will appear in the `output` directory based on the `filename`
value in `config.json`.

## Contributing

If there is a feature or bug you would like to see addressed, open an [Issue] or
a [Pull Request].

## Copyright

&copy; 2023 Patrick Reagan.

[Markdown]: https://www.markdownguide.org/
[EJS]: https://ejs.co
[Google Fonts]: https://fonts.google.com/
[Fontello]: https://fontello.com/
[@font-face]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face
[PDFMargin]: https://pptr.dev/api/puppeteer.pdfmargin
[Puppeteer]: https://pptr.dev
[Issue]: https://github.com/reagent/resume-generator/issues
[Pull Request]: https://github.com/reagent/resume-generator/pulls
