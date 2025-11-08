/**
 * Fetches the content from the root index.html, adjusts all relative paths
 * for the /en/ directory, and replaces the current document's content with it.
 * This way it doesn't need to maintain 2 index.html files.
 */
async function loadEnglishSite() {
    try {
        const response = await fetch('../index.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch index.html: ${response.statusText}`);
        }
        let html = await response.text();

        // 1. Adjust all relative asset paths (href="assets/..." or src="assets/...")
        // by prepending "../" to them.
        html = html.replace(/(href|src)="(assets\/)/g, '$1="../$2');

        // 2. Adjust the language switcher links for the English page.
        html = html.replace(/<li class="lang-switcher"><a href="en\/">🇬🇧 EN<\/a><\/li>/, '<li class="lang-switcher"><a href="../">🇭🇺 HU</a></li>');

        // 3. Update the canonical URL for the English page.
        html = html.replace(/<link rel="canonical" href="https:\/\/huki.hu" \/>/, '<link rel="canonical" href="https://huki.hu/en/" />');

        // 3. Replace the entire document with the modified HTML.
        document.open();
        document.write(html);

        // 4. Add a class to the body to make it visible.
        document.body.classList.add('content-loaded');
        document.close();
    } catch (error) {
        console.error("Failed to load page content:", error);
        document.body.innerHTML = `<p>Error loading page. Please try again later.</p>`;
    }
}

loadEnglishSite();
