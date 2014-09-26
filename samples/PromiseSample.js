enyo.kind({
	name: "enyo.sample.PromiseSample",
	components: [
        {kind:"Button", content: "Test Button", ontap: "handleOnTap"},
    ],
    handleOnTap: function(){
        enyo.log('hey');
    },
    create: function() {
        this.inherited(arguments);

        var _this = this;
        var ePromise = new enyo.Promise({
            success: function(response){
                enyo.log('success', response);
            },
            error: function(response){
                enyo.log('error', response);
            },
            job: function(resolve, reject){
                resolve(_this);
            }
        });

    }
});

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
                    this[nom] = this.createDefer(nom);
                }
            }
        }

        //move defered components into this component
        //so they are owned by this def
        this.createComponents(components);
    },
    createDefer: function(nom){
        return function(sender, event) {

            //ref
            var _this = this;

            //is the event undefined (first time) or if the promise is in resolved state,
            //it can be called
            if(typeof this.promiseResolved[event.type] == 'undefined' || this.promiseResolved[event.type]) {
                this.promise = new enyo.Promise({
                    success: function(response){
                        enyo.log('success', response);

                        //dispatch original event handler
                        //todo: use eventing for bubbling past this POC
                        if(_this.parent[nom]) _this.parent[nom](sender, event);

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

        }
    }
});

enyo.kind({
    name: "enyo.sample.DeferHandlerSample",
    components: [

        //this button has a deferred job
        //events will not execute until the job completes
        {
            kind: "enyo.DeferHandler",

            //job is called before the event handler
            //this pattern specifies which code is going to
            //take time to complete before the event will
            //be able to call again
            jobs: {
                handleTap: function(resolve, reject){

                    //this is a job that will take time to
                    //complete, XHR, or other background task
                    //could be a nested promise as well
                    console.log('job is running....');

                    //set a timeOut to report when the job is done 2 seconds
                    //later, simulates something doing some work
                    setTimeout(function(){
                       resolve('resolved');
                    }, 2000);
                }
            },
            components:[
                {kind:"Button", content: "Deferred Button", ontap: "handleTap"}
            ],
      },

      //this button is not deferred
      {kind:"Button", content: "Not Deferred", ontap: "handleTap"}
    ],
    handleTap: function(sender, event) {
        console.log('this event was processed only one time');
    }
});