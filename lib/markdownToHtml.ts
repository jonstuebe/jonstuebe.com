export default async function markdownToHtml(markdown: string) {
  const [
    { unified },
    { default: html },
    { default: externalLinks },
    { default: prism },
    { default: slug },
    { default: headings },
    { default: parse },
    { default: stringify },
  ] = await Promise.all([
    import("unified"),
    import("remark-html"),
    import("remark-external-links"),
    import("remark-prism"),
    import("remark-slug"),
    import("remark-autolink-headings"),
    import("remark-parse"),
    import("remark-stringify"),
  ]);

  const result = await unified()
    .use(parse)
    .use(stringify)
    .use(slug)
    .use(headings, {
      behavior: "append",
    })
    .use(externalLinks)
    .use(prism, {
      transformInlineCode: true,
    })
    .use(html, {
      sanitize: false,
    })
    .process(markdown);

  return result.toString();
}
