type PDFOutputOptions = {
  margins: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
};

type Configuration = {
  filename: string;
  templates: string[];
  options: PDFOutputOptions;
};

export { Configuration, PDFOutputOptions };
