import {Howl, Howler} from 'howler';

var assetsToLoadURLs = {
    shrek: { url: 'http://localhost:3000/sh.png' },
    musiquegame: { url: 'http://localhost:3000/musiqueGame.mp3', buffer: false, loop: false, volume: 1.0 },
    shrek8bit: { url: 'http://localhost:3000/shrek8bit.mp3', buffer: false, loop: false, volume: 1.0 }
     // http://www.clipartlord.com/category/weather-clip-art/winter-clip-art/
};


function loadAssets(callback,tabAsset) {
    // here we should load the sounds, the sprite sheets etc.
    // then at the end call the callback function           
    loadAssetsUsingHowlerAndNoXhr(assetsToLoadURLs, callback,tabAsset);
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

            // We assume the asset is an audio file
           // console.log("loading " + name + " buffer : " + assetsToBeLoaded[name].loop);
          //  console.log([url])

            tabAsset[name] = new Howl({
            src: [url],
            autoplay: false,
            buffer: true,
            loop: true,
            volume: 1.0,
            onload: function() {
                ifLoad();
            }//, 
          /*  onend: function() {
                tabAsset[name].play();
            }*/
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


      /*  let asset = new Image();
        asset.onload = () => {
            let imgBit = createImageBitmap(asset, 0, 0, asset.width, asset.height);
            imgBit.then((data) => {
                this.bitMapShrek = data; 
                this.callbackView();
            })
        };
        asset.src = 'http://localhost:3000/sh.png';*/


        loadAssets(this.settingAsset,this.tabAsset);

    }

    getAsset(name){
        return this.tabAsset[name];
    }

    settingAsset = (assetsReadyToBeUsed) => {
        //console.log(assetsReadyToBeUsed)
        //this.loadAssets = assetsReadyToBeUsed;
        console.log(this.tabAsset)
        console.log("Finish load data")
        this.callbackView();
    }

}
export default LoaderManager;
