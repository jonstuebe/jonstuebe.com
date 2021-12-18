export default async function markdownToHtml(markdown: string) {
  const remark = (await import("remark")).remark;
  const html = (await import("remark-html")).default;
  const externalLinks = (await import("remark-external-links")).default;
  const prism = (await import("remark-prism")).default;
  const slug = (await import("remark-slug")).default;
  const headings = (await import("remark-autolink-headings")).default;

  const result = await remark()
    .use(slug)
    .use(headings, {
      behavior: "append",
    })
    .use(externalLinks)
    .use(html)
    // @ts-expect-error
    .use(prism, {
      transformInlineCode: true,
    })
    .process(markdown);

  return result.toString();
}
