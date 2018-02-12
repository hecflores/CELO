/**
 * @param adapter function
 * @constructor
 */
function QuestionsUploader(adapter){
    this._adapter=adapter;
}
$.extend(QuestionsUploader.prototype,{
    upload:function(inputElement,callback){
        return this._adapter(inputElement,callback);
    }
});
$.extend(QuestionsUploader,
{
    zipFileFromPublisher:new QuestionsUploader(function(inputElement, callback)
    {
        /*******************************************************************/
        if(inputElement instanceof jQuery){
            inputElement=inputElement.get(0);
        }

        /*******************************************************************/
        /* Create a reader object                                          */
        /*******************************************************************/
        var reader = new FileReader();
        if (input.files.length)
        {
            var textFile = input.files[0];

            var text=reader.readAsText(textFile);

            $(reader).on('load', processFile);
        }
        else
        {
            alert('Please upload a file before continuing')
        }
    })
});

