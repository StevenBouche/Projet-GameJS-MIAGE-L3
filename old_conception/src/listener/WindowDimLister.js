class WindowDimLister {

    constructor() {
      this.observer = [];
      this.state = { 
        height: window.innerHeight, 
        width: window.innerWidth
      };
      window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    addObserver(id,callbackFunction){
      var element = this.observer.find((element) => { return element.id == id;})
      if(element == undefined) this.observer.push({id: id, callback: callbackFunction});
    }

    removeObserver(id){
      this.observer.filter(element => element.id == id);
    }

    updateDimensions() {
        this.state = {
            height: window.innerHeight, 
            width: window.innerWidth
        };
        console.log(this.state)
        this.updateObserver();
    }

    updateObserver(){
      this.observer.forEach((element) => {element.callback(this.state.width,this.state.height)})
    }
    
  }

  var Singleton = (function () {
    var instance;
    
    function createInstance() {
        var object = new WindowDimLister();
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) { instance = createInstance();}
            return instance;
        }
    };
})();

export default Singleton;