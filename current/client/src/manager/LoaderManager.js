import {Howl} from 'howler';
import Constants from '../shared/constants'

var assetsToLoadURLs = {
    shrek: { url: 'http://localhost:3000/sh.png' },
    musiquegame: { url: 'http://localhost:3000/musiqueGame.mp3', buffer: false, loop: false, volume: 0.5 },
    shrek8bit: { url: 'http://localhost:3000/shrek8bit.mp3', buffer: false, loop: false, volume: 0.5 }
};

function loadAssets(callback,tabAsset) {
    // here we should load the sounds, the sprite sheets etc.
    // then at the end call the callback function           
    loadAssetsUsingHowlerAndNoXhr(assetsToLoadURLs, callback,tabAsset);
}

function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
/*
function isAudio(url) {
    return (url.match(/\.(mp3|ogg|wav)$/) != null);
}*/

function imageToBitMap(name,url,tabAsset,callback){
    let asset = new Image();
    asset.onload = () => {
        let imgBit = createImageBitmap(asset, 0, 0, asset.width, asset.height);
        imgBit.then((data) => {
            //this.bitMapShrek = data; 
            tabAsset[name] = data;
            //this.callbackView();
            callback();
        })
    };
    asset.src = url;
}

function loadAssetsUsingHowlerAndNoXhr(assetsToBeLoaded, callback, tabAsset) {


    var assetsLoaded = {};
    var loadedAssets = 0;
    var numberOfAssetsToLoad = 0;

    // define ifLoad function
    var ifLoad = function () {
        if (++loadedAssets >= numberOfAssetsToLoad) {
            callback(assetsLoaded);
        }
        //console.log("Loaded asset " + loadedAssets);
    };

    // get num of assets to load
    for (var name in assetsToBeLoaded) { numberOfAssetsToLoad++; }

    for (name in assetsToBeLoaded) {
        
        var url = assetsToBeLoaded[name].url;
        if (isImage(url)) imageToBitMap(name,url,tabAsset,ifLoad);
        else {
                tabAsset[name] = new Howl({
                src: [url],
                autoplay: false,
                buffer: true,
                loop: true,
                volume: 1.0,
                onload: function() {
                    ifLoad();
                }
            });
        }
    }
}

class LoaderManager {

    constructor(callback){
        this.loadedAssets = undefined;
        this.tabAsset = [];
        this.bitMapShrek = undefined;
        this.callbackView = callback;
        loadAssets(this.settingAsset,this.tabAsset);
    }

    getAsset(name){
        return this.tabAsset[name];
    }

    settingAsset = (assetsReadyToBeUsed) => {
        this.callbackView();
    }

}

export default LoaderManager;
