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