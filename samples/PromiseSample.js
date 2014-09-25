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
    create: function(){
        //move components off this component
        var components = this.components;

        //empty out components so they are not
        //owned by the parent.
        this.components = [];

        //create this component as normal
        this.inherited(arguments);

        //move defered components into this component
        //so they are owned by this def
        this.createComponents(components);
    },
    catchEvent: function() {
        console.log('caught in defer');
    }
});

enyo.kind({
    name: "enyo.sample.DeferHandlerSample",
    components: [{
        kind: "enyo.DeferHandler",
        components:[
            {kind:"Button", content: "Test Button", ontap: "catchEvent"}
        ]
    }],
    catchEvent: function(sender, event) {
        console.log(sender);
    }
});