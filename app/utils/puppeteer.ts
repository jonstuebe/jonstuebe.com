export async function getPuppeteer(
  opts: { headless?: boolean } = { headless: true }
): Promise<{
  chrome: any;
  puppeteer: any;
  browser: any;
}> {
  let chrome: any = { args: [] };
  let puppeteer;

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = require("chrome-aws-lambda");
    puppeteer = require("puppeteer-core");
  } else {
    puppeteer = require("puppeteer");
  }

  const browser = await puppeteer.launch({
    args: [...chrome.args, "--hide-scrollbars"],
    executablePath: chrome ? await chrome.executablePath : undefined,
    ...opts,
  });

  return {
    chrome,
    puppeteer,
    browser,
  };
}
