(function(scope){
	/**
	* Creates a promise which will execute a specified job, a success and an error
	*
	*/
    enyo.kind({
        /**
		* @private
		*/
        name: 'enyo.Promise',
        success: function(response) {
            //what happens when the promise is resolved
            enyo.log('success:', response);
        },
        error: function(response) {
            //what happens when the promise is rejected
            enyo.log('error', response)
        },
        job: function(resolve, reject) {
            enyo.log('work started');

            //the work to be done that we are waiting on
            setTimeout(function(){
                reject('work was done');
            }, 1000);
        },
        create: function() {
            //create the control
            this.inherited(arguments);

            //ref to this for use inside promise
            var _this = this;
            var promise = function() {
                //return a new promise to use
                return new Promise(function(resolve, reject){
                    //kick off the defined job, pass it resolve
                    //and reject for the promise
                    _this.job(resolve, reject);
                });
            }

            //kick off promise, and que up what will happen
            //when the job is finished, or errors
            promise().then(this.success, this.error);
        }
    });

}(window))

