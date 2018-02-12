

export class QuestionObject{

    constructor(object){
        this._object = object;
    }

    get object() {
        return this._object;
    }
    get QuestionID() {
        return this.object["QuestionID"];
    }
    get QuestionTypeID() {
        return this.object["QuestionTypeID"];
    }
    get Type() {
        return this.object["QuestionTypeID"];
    }
    get SrcDirectory() {
        return this.object["SrcDirectory"];
    }
    get Question() {
        return this.object["Question"];
    }
    get ExpectedAnswer() {
        return this.object["ExpectedAnswer"];
    }
    get CreatedBy() {
        return this.object["CreatedBy"];
    }
    get JSONParameters() {
        return this.object["JSONParameters"];
    }
}

export class QuestionObjects
{
    /**
     * @param questionsTemp QuestionObject[]
     * @constructor
     */
    constructor(questionsTemp) {
        let questions=questionsTemp;

        if(questionsTemp instanceof QuestionObjects){
            return new QuestionObjects(questionsTemp._questions);
        }
        if(questions.length>0){
            if(!(questions[0] instanceof QuestionObject)){
                questions=questions.map(function(question){
                    return new QuestionObject(question)
                })
            }
        }
        this._questions = questions;
        this._usePages=true;
        this._page=0;
        this._questionsPerPage=50;

    }
    /**
     *
     * @param value {bool}
     */
    set isPaged(value){
        this._usePages=value;
    }
    /**
     *
     * @return {bool}
     */
    get isPaged(){
        return this._usePages;
    }
    /**
     *
     * @return {number}
     */
    get Page(){
        return this._page;
    }
    /**
     *
     * @return {number}
     */
    get QuestionsPerPage(){
        return this._questionsPerPage;
    }

    /**
     *
     * @return {number}
     */
    get PagedQuestionsIndexStart()
    {
        return this.Page*this.QuestionsPerPage;
    }
    /**
     *
     * @return {number}
     */
    get PagedQuestionsIndexEnd()
    {
        return this.PagedQuestionsIndexStart+this.QuestionsPerPage;
    }
    /**
     * Gives the object used
     * @return QuestionObject[]
     */
    get PagedQuestions(){
        if(!this.isPaged){
            return this.Questions;
        }

        let newArray=[];
        for(let i=this.PagedQuestionsIndexStart;i<this.PagedQuestionsIndexEnd;i++){
            if(i>=this.Questions.length){
                break;
            }
            newArray.push(this.Questions[i]);
        }
        return newArray;
    }

    /**
     * Gives the object used
     * @return QuestionObject[]
     */
    get Questions(){
        return this._questions;
    }

    /**
     *
     * @param value {QuestionObject[]}
     */
    set Questions(value){
        this._questions=value;
    }

    /**
     * Gives the raw data that was given from the database
     * @return object[]
     */
    get QuestionsRaw(){
        return this.Questions.map(function(question){
            return question.object;
        });
    }

    /**
     * Gives the raw data that was given from the database
     * @return number[]
     */
    get Ids(){
        return this.map(function(question){
            return question.QuestionID;
        });
    }

    forEach(forEachFunction){
        this.Questions.forEach(forEachFunction);
    }

    /**
     *
     * @param question
     * @return {number}
     */
    indexOf(question)
    {
        let foundIndex=-1;
        this.QuestionsRaw.forEach(function(questionInList,index){
                if(questionInList.QuestionID==question.QuestionID && foundIndex<0){
                    foundIndex=index;
                    return true;
                }
            });
        return foundIndex;
    }
    /**
     *
     * @param question QuestionObject
     * @return bool
     */
    contains(question){
        return (this.indexOf(question)>=0);
    }
    remove(question){
        let index=this.indexOf(question);
        if(index<0){
            return false;
        }
        this._questions.splice(index,1);
        return true;
    }
    add(question){
        let index=this.indexOf(question);
        if(index>=0){
            return false;
        }

        this._questions.push(question);
        return true;
    }
    /**
     *
     * @param mapperFunc function
     */
    map(mapperFunc){
        return this.PagedQuestions.map(mapperFunc);
    }


}
export class SelectableQuestionObjects extends QuestionObjects
{
    constructor(questions,selected){
        super(questions);

        this._selected=new QuestionObjects(selected);
    }
    get Selected(){
        return this._selected.Questions;
    }

    /**
     *
     * @param question
     * @return bool
     */
    isSelected(question){
        return this._selected.contains(question);
    }

    AddSelection(question){
        if(this.isSelected(question)){
            return;
        }
        this._selected.add(question);
    }
    RemoveSelection(question){
        if(!this.isSelected(question)){
            return;
        }
        this._selected.remove(question);
    }


}
export default QuestionObject