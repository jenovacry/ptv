import fs from 'fs';
import { chromium } from 'playwright';

const PROXIES_FILE = 'proxies.txt';
const TARGET_URL = 'https://reimagined-rotary-phone-wr5r5p9p7rqrc5rx-3000.app.github.dev/';

(async () => {
	const proxies = fs
		.readFileSync(PROXIES_FILE, 'utf-8')
		.split('\n')
		.filter((line) => line.trim() !== '');

	if (proxies.length === 0) {
		console.log('No proxies found in the file. Exiting...');
		process.exit(1);
	}

	console.log(`Found ${proxies.length} proxies. Starting browsers...`);

	const instances = [];

	for (const proxy of proxies) {
		const instance = (async () => {
			console.log(`Launching browser with proxy: ${proxy}`);

			const context = await chromium.launchPersistentContext(`./tmp/yummygame/${proxy}`, {
				headless: false,
				// proxy: { server: `http://${proxy}` },
                ignoreHTTPSErrors: true,
                args: [
                    '--mute-audio', 
                    '--disable-gpu', 
                    '--disable-extensions', 
                    '--ignore-certificate-errors', // Ignores SSL warnings
                    '--disable-web-security',     // Disables same-origin policy (use cautiously)
                    '--allow-insecure-localhost'  // Ignores warnings for localhost certificates
                  ],
			});

			try {
				const page = await context.newPage();

				// Block unnecessary resources
				await page.context().addCookies([
					{
						name: 'tunnel_phishing_protection',
						value: 'neat-dog-dqr1w2t.asse',
						domain: 'reimagined-rotary-phone-wr5r5p9p7rqrc5rx-3000.app.github.dev',
						path: '/',
						expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
					},
				]);

				await page.goto(TARGET_URL);

				// Set video quality and autoplay
				await page.evaluate(() => {
					const video = document.querySelector('video');
					if (video) {
						video.play();
						video.muted = true; // Mute audio
						video.playbackRate = 1; // Normal playback speed
					}
				});

				console.log(`Proxy: ${proxy} | Page title: ${await page.title()}`);
			} catch (error) {
				console.error(`Error with proxy ${proxy}:`, error);
			}
		})();

		instances.push(instance);
	}

	// Graceful shutdown
	const gracefulShutdown = async () => {
		console.log('Closing all browsers...');
		for (const instance of instances) {
			try {
				await instance; // Wait for each instance to finish or close
			} catch (err) {
				console.error('Error closing browser:', err);
			}
		}
		console.log('All browsers closed. Exiting...');
		process.exit(0);
	};

	process.on('SIGINT', gracefulShutdown);
	process.on('SIGTERM', gracefulShutdown);

	// Wait for all instances to run
	await Promise.all(instances);
})();
