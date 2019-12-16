import {Howl, Howler} from 'howler';

var assetsToLoadURLs = {
    shrek: { url: 'http://localhost:3000/sh.png' }, // http://www.clipartlord.com/category/weather-clip-art/winter-clip-art/
};


function loadAssets(callback) {
    // here we should load the sounds, the sprite sheets etc.
    // then at the end call the callback function           
    loadAssetsUsingHowlerAndNoXhr(assetsToLoadURLs, callback);
}

// You do not have to understand in details the next parts of the code...
// just use the above function

/* ############################
    BUFFER LOADER for loading multiple files asyncrhonously. The callback functions is called when all
    files have been loaded and decoded 
 ############################## */
function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function isAudio(url) {
    return (url.match(/\.(mp3|ogg|wav)$/) != null);
}

function loadAssetsUsingHowlerAndNoXhr(assetsToBeLoaded, callback) {
    var assetsLoaded = {};
    var loadedAssets = 0;
    var numberOfAssetsToLoad = 0;

    // define ifLoad function
    var ifLoad = function () {
        if (++loadedAssets >= numberOfAssetsToLoad) {
            callback(assetsLoaded);
        }
        console.log("Loaded asset " + loadedAssets);
        
    };

    // get num of assets to load
    for (var name in assetsToBeLoaded) {
        numberOfAssetsToLoad++;
    }

    console.log("Nb assets to load: " + numberOfAssetsToLoad);

    for (name in assetsToBeLoaded) {
        var url = assetsToBeLoaded[name].url;
        console.log("Loading " + url);
        if (isImage(url)) {
            assetsLoaded[name] = new Image();
            // will start async loading. 
            assetsLoaded[name].src = url;
            assetsLoaded[name].onload = ifLoad;
            
        } else {
            // We assume the asset is an audio file
            console.log("loading " + name + " buffer : " + assetsToBeLoaded[name].loop);
            assetsLoaded[name] = new Howl({
                urls: [url],
                buffer: assetsToBeLoaded[name].buffer,
                loop: assetsToBeLoaded[name].loop,
                autoplay: false,
                volume: assetsToBeLoaded[name].volume,
                onload: function () {
                    if (++loadedAssets >= numberOfAssetsToLoad) {
                        callback(assetsLoaded);
                    }
                    console.log("Loaded asset " + loadedAssets);
                }
            }); // End of howler.js callback
        } // if

    } // for
} // function


class LoaderManager {

    constructor(callback){
        this.loadedAssets = undefined;
        this.bitMapShrek = undefined;
        this.callbackView = callback;


        let asset = new Image();
        asset.onload = () => {
            let imgBit = createImageBitmap(asset, 0, 0, asset.width, asset.height);
            imgBit.then((data) => {this.bitMapShrek = data})
        };
        asset.src = 'http://localhost:3000/sh.png';


       // loadAssets(this.settingAsset);
    }

    settingAsset = (assetsReadyToBeUsed) => {
    //    console.log("LOAD")
      //  console.log(assetsReadyToBeUsed)
        this.loadAssets = assetsReadyToBeUsed;
        console.log(this.loadAssets)
        let imgBit = createImageBitmap(this.loadAssets, 0, 0, this.loadAssets.width, this.loadAssets.height);
      imgBit.then((data) => {
        this.bitMapShrek = data;
      })
        this.callbackView();
    }

}

export default LoaderManager;
