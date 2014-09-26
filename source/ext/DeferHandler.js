enyo.kind({
    name: "enyo.DeferHandler",
    promiseResolved: [],
    create: function(){
        //move components off this component
        var components = this.components;

        //empty out components so they are not
        //owned by the parent.
        this.components = [];

        //create this component as normal
        this.inherited(arguments);

        //loop through components to setup pass-through
        //event handlers
        for (i = 0; i < components.length; i++) {
            var component = components[i];

            for(var propertyName in component) {

                //get all on properties
                if(propertyName.substring(0,2) == "on"){

                    //create a method that will run the defer
                    var nom = component[propertyName];

                    //create a deferred method
                    this[nom] = this.createDefer(nom, propertyName);
                }
            }
        }

        //move defered components into this component
        //so they are owned by this def
        this.createComponents(components);
    },
    createDefer: function(nom, noe){
        return function(sender, event) {

            //ref
            var _this = this;

            //is the event undefined (first time) or if the promise is in resolved state,
            //it can be called
            if(typeof this.promiseResolved[event.type] == 'undefined' || this.promiseResolved[event.type]) {
                this.promise = new enyo.Promise({
                    success: function(response){

                        //need bubbling
                        //dispatch original event handler
                        _this.parent.dispatch(nom, sender, event);

                        //resolve promise for this event
                        _this.promiseResolved[event.type] = true;
                    },
                    error: function(response){
                        enyo.log('error', response);
                    },
                    job: _this.jobs[nom]
                });
            }

            //if the promise is undefined, or has been resolved, set it to unresolved
            if(typeof this.promiseResolved[event.type] == 'undefined' || this.promiseResolved[event.type] == true) {
                this.promiseResolved[event.type] = false;
            }

            //kills bubbling, but need to figure out bubbling with the promise
            return true;

        }
    }
});