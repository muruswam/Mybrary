const readStyle = window.getComputedStyle(document.documentElement)

if(readStyle.getPropertyValue('--book-cover-width-large') != null){
    read();
}else {
    document.getElementById('main-css').addEventListener('load', read);
}

function read(){
    const coverWidth = parseFloat(readStyle.getPropertyValue('--book-cover-width-large'));
    const coverAspectRatio = parseFloat(readStyle.getPropertyValue('--book-cover-aspect-ration'));

    const coverHeight = coverWidth / coverAspectRatio;

    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    )
    
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRatio,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })
    
    FilePond.parse(document.body)
}

