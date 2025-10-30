const puppeteer = require("puppeteer")
const process = require("process")

class Reddit {
	flags = [];
	post_feed = [];
	pos = 0;
	subreddits = [];
	currentId = false;
	currentUrl = "https://old.reddit.com/"
	// browser = null
	// page = null
	constructor() {
		// 1280x853
		this.flags = ["hi"]
	};

	async init() {
		this.browser = await puppeteer.launch({headless: false});
		this.page = await this.browser.newPage();
		await this.page.setViewport({width: 1280, height: 853});
		await this.page.goto(this.currentUrl);

		// login
		await this.page.locator(".login-link").click();
		await this.page.waitForNavigation({waitUntil: "networkidle0"});

		// assuming reddit's layout doesn't change, this should work
		// I should really write some tests but it's late lol
		const loginInput = (await this.page.evaluateHandle(_=> document.querySelector("#login-username").shadowRoot.querySelector("input"))).asLocator();
		await loginInput.fill(process.env["REDDIT_USERNAME"]);
		const passwordInput = (await this.page.evaluateHandle(_=> document.querySelector("#login-password").shadowRoot.querySelector("input"))).asLocator();
		await passwordInput.fill(process.env["REDDIT_PASSWORD"]);
		await this.page.locator("button.login").click();
	}
}

module.exports = { Reddit };