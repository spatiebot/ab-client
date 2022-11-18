export class StylesRepository {

    private lastUrl = "styles/default/";

    public async loadStyle(url: string): Promise<any> {

        // replace all image files with this style
        const images = document.querySelectorAll("img");
        for (const img of images) {
            img.src = img.src.replace(this.lastUrl, url);
        }

        // replace css link in header
        const link = document.getElementById("ui-styling") as HTMLLinkElement;
        link.href = link.href.replace(this.lastUrl, url);

        this.lastUrl = url;
    }
}
