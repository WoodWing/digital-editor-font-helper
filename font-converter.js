class FontConverterService {
    constructor(DigitalEditorSdk, ContentStationSdk) {
        this.DigitalEditorSdk = DigitalEditorSdk;
        this.ContentStationSdk = ContentStationSdk;
        this.panels = [];
        this.activePanelData = null;
        this.article = null;
    }

    create() {
        const panelData = {
            panel: this.DigitalEditorSdk.addSidebarPanel({
                onInit: (panel) => {
                    this.activePanelData = panelData;

                    const body = $(panel.window.document).find('body');
                    body.append ('<iframe id="FontConverter" frameborder="0" style="margin: 0; padding: 0; height: 100%; width: 100%; background-color: #F2F3F5;"  src="' + this.getBaseURL() + 'index.html' + '"></iframe>');                    
                },
                onDestroy: (panel) => {
                    this.activePanelData = null;
                },
                button: {
                    badge: '',
                    icon: {
                        normal: this.getBaseURL() + 'file-font.svg',
                        activated: this.getBaseURL() + 'file-font.svg',
                    }
                },
            }),
        };
        
        this.panels.push(panelData);
    }    

    onArticleSave() {
    }

    getBaseURL()
	{	
        return "https://woodwing.github.io/digital-editor-font-helper/";
	}
}

(async function(DigitalEditorSdk) {
    

    DigitalEditorSdk.onOpenArticle(async function(article) {
        const fontConverterService = new FontConverterService(DigitalEditorSdk, ContentStationSdk);

        fontConverterService.article = article;        
        fontConverterService.create();
        
        article.onSave(async function() {
            fontConverterService.onArticleSave();
        });
    });

    
})(DigitalEditorSdk);