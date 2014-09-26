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
    name: "enyo.sample.DeferHandlerSample",
    components: [

        //this button has a deferred job
        //events will not execute until the job completes
        {
            kind: "enyo.DeferHandler",

            //job is called before the event handler
            //this pattern specifies which code is going to
            //take time to complete before the event will
            //be able to call again, could be XHR
            //could check for out of bounds, and not resolve
            //until in bounds
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
                {kind:"Button", content: "Deferred Button", ontap: "handleTap", onenter: "handleEnter"}
            ],
      },

      //this button is not deferred
      {kind:"Button", content: "Not Deferred", ontap: "handleTap"}
    ],
    handleTap: function(sender, event) {
        console.log('this event was processed');
    }
});

enyo.kind({
    name: 'enyo.sample.DeferHandlerParent',
    components: [
        {kind:"enyo.sample.DeferHandlerSample", ontap: "handleTap"}
    ],
    handleTap: function(){
        console.log('parent');
    }
});