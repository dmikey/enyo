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


        //move defered components into this component
        //so they are owned by this def
        this.createComponents(components);
    },
    catchEvent: function(sender, event) {
        //ref
        var _this = this;
        console.log('caught in defer', event.type)
        console.log(_this.promiseResolved[event.type]);

        //is the event undefined (first time) or if the promise is in resolved state,
        //it can be called
        if(typeof this.promiseResolved[event.type] == 'undefined' || this.promiseResolved[event.type]) {
            this.promise = new enyo.Promise({
                success: function(response){
                    enyo.log('success', response);

                    //todo use event dispatch
                    _this.parent.catchEvent(sender, event);

                    _this.promiseResolved[event.type] = true;
                },
                error: function(response){
                    enyo.log('error', response);
                },
                job: function(resolve, reject){

                    setTimeout(function(){
                       resolve('resolved');
                    }, 2000);

                }
            });
        }

        //if the promise is undefined, or has been resolved, set it to unresolved
        if(typeof this.promiseResolved[event.type] == 'undefined' || this.promiseResolved[event.type] == true) {
            this.promiseResolved[event.type] = false;
        }

    }
});

enyo.kind({
    name: "enyo.sample.DeferHandlerSample",
    components: [{
        kind: "enyo.DeferHandler",
        components:[
            {kind:"Button", content: "Test Button", ontap: "catchEvent"}
        ],
    }],
    catchEvent: function(sender, event) {
        console.log('caught in top');
    }
});