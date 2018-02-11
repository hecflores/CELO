




function SpecialDatePicker() {
    this.on("setup", (new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), function (e) {
        e.date.element.css("border", "2px solid #337ab7");
    });
    
}
Tools.inheritsFrom(SpecialDatePicker, EventHandler);


SpecialDatePicker.pick = function (callback) {
    var picker = new SpecialDatePicker();
    picker.on("picked", callback);
    
    picker.show();
}
SpecialDatePicker.prototype.show = function (date) {
    if (typeof date == "undefined") {
        return this.show({ year: (new Date(Date.now())).getFullYear() });
    }
    if (typeof date.year == "undefined") {
        return this.show({ year: (new Date(Date.now())).getFullYear() });
    }
    if (typeof date.month == "undefined") {
        date.month=(new Date(Date.now())).getMonth();
    }
    if (typeof date.day == "undefined") {
        date.day = (new Date(Date.now())).getDate();
    }
    if (typeof this.model == "undefined") {
        
        this.open();
    }
    
    this.select(date);
    


}
SpecialDatePicker.prototype.select = function (date) {
    

    if (typeof date == "undefined") {
        return this.show({ year: (new Date(Date.now())).getFullYear() });
    }
    if (typeof date.year == "undefined") {
        return this.show({ year: (new Date(Date.now())).getFullYear() });
    }
    if (typeof date.month == "undefined") {
        date.month = (new Date(Date.now())).getMonth();
    }
    if (typeof date.day == "undefined") {
        date.day = (new Date(Date.now())).getDate();
    }
    var dateObject = new Date(date.year, date.month, date.day);
    date.year = dateObject.getFullYear();
    date.month = dateObject.getMonth();
    date.day = dateObject.getDate();

    this.renderCalander(date.year, date.month);
    this.month.select(date.day);
    
    

}
SpecialDatePicker.prototype.renderCalander = function (year, month) {
    if (typeof this.month == "undefined") {
        this.monthContainer.empty();
        this.month = new SpecialMonth(year, month, this.monthContainer, this);
        return;
    }
    if(this.month.year==year&&this.month.month==month){
        return;
    }
    
    this.monthContainer.empty();
    this.month = new SpecialMonth(year, month, this.monthContainer, this);
    this.trigger("month-changed", { year: year, month: month, monthRef: this.month });
}
SpecialDatePicker.prototype.open = function () {
    this.model = Tools.OpenModal("<div class='row'><div class='col-lg-12 calanderControls'></div><div class='col-lg-12 calanderMonth'></div></div>");
    this.controlContainer = this.model.find(".calanderControls");
    this.monthContainer = this.model.find(".calanderMonth");
    var thisInstance = this;
    this.model.on('hidden.bs.modal', function () {
        thisInstance.trigger("picked",thisInstance.month.selectedDay);
    });
    var html = '<nav>' +
      '<ul class="pager">' +
        '<li class="prevMonth previous"><a href="#"><span aria-hidden="true">&larr;</span> <span class="prevButtonTag"></span></a></li>' +
        '<li class="nextMonth next"><a href="#"><span class="nextButtonTag"></span> <span aria-hidden="true">&rarr;</span></a></li>' +
      '</ul>' +
    '</nav>';
    this.controlContainer.html(html);
    this.controlContainer.find(".prevMonth").click(function () {
        thisInstance.select({ year: thisInstance.month.year, month: thisInstance.month.month - 1, day: 1 });
    });
    this.controlContainer.find(".nextMonth").click(function () {
        thisInstance.select({ year: thisInstance.month.year, month: thisInstance.month.month + 1, day: 1 });
    });
    this.on("month-changed",function(event){
        var firstOfPrevMonth = new Date(event.year, event.month-1, 1);
        var firstOfNextMonth = new Date(event.year, event.month+1, 1);
        
        thisInstance.find(".prevButtonTag").text(firstOfPrevMonth.getMonthName());
        thisInstance.find(".nextButtonTag").text(firstOfNextMonth.getMonthName());
    });
    this.select({ year: (new Date()).getFullYear(), month: (new Date()).getMonth(), day: (new Date()).getDate() });
    
}

function SpecialMonth(year, month, element, datePicker) {
    this.datePicker = datePicker;
    this.year=year;
    this.month=month;
    this.days={};
    this.firstOfMonth = new Date(year, month, 1);
    this.lastOfMonth = new Date(year, month+1, 0);
    this.firstDayOfWeek = this.firstOfMonth.getDay();
    this.numberOfDays = this.lastOfMonth.getDate();
    
    for (var i = 0; i < this.firstDayOfWeek; i++) {
        $("<div class='col-cal-day'>").appendTo(element);
    }
    for (var i = 1; i <= this.numberOfDays; i++) {
        this.days[i] = SpecialDate.create(this,{ month: month, year: year, day: i },element);
    }
    for (var i = 0; i < 7-this.firstDayOfWeek; i++) {
        $("<div class='col-cal-day'>").appendTo(element);
    }
}
Tools.inheritsFrom(SpecialMonth, EventHandler);
SpecialMonth.prototype.select = function (day) {
    if (typeof this.selectedDay != "undefined") {
        this.selectedDay.unselect();
    }
    this.selectedDay = this.days[day];
    this.selectedDay.select();

}
function SpecialDate(month,date,element) {
    $.extend(this, date);

    this.monthRef = month;
    this.datePicker = this.monthRef.datePicker;
    this.element = element;
    this.isSelected = false;
    var thisInstance = this;
    element.click(function () {
        thisInstance.select();
    });

    this.on("setup", function (e) {
        thisInstance.element.text(e.sender.day);
        thisInstance.monthRef.triggerAll("setup", thisInstance.day, { date: thisInstance });
        thisInstance.datePicker.triggerAll("setup", thisInstance.year, thisInstance.month, thisInstance.day, { date: thisInstance });
    });
    console.log("Settup Up:\n" + JSON.stringify(date));
    this.trigger("setup");
}
Tools.inheritsFrom(SpecialDate, EventHandler);
SpecialDate.prototype.select = function () {
    if (this.isSelected) {
        return;
    }
    this.element.addClass("selected");
    this.isSelected = true;
    this.monthRef.select(this.day);
    this.trigger("selection-changed", { selected: this.isSelected, date: this });
    this.month.triggerAll("selection-changed", this.day, { selected: this.isSelected, date: this });
    this.datePicker.triggerAll("selection-changed", this.year, this.month, this.year, { selected: this.isSelected, date: this });
}
SpecialDate.prototype.unselect = function () {
    if (!this.isSelected) {
        return;
    }
    
    this.element.removeClass("selected");
    this.isSelected = false;
    this.trigger("selection-changed", { selected: this.isSelected, date: this });
    this.month.triggerAll("selection-changed", this.day,{ selected: this.isSelected, date: this });
    this.datePicker.triggerAll("selection-changed", this.year,this.month,this.year,{ selected: this.isSelected, date: this });
    
}
SpecialDate.create = function (month,date,container) {
    var element=$("<div class='col-cal-day'>").appendTo(container);
    return new SpecialDate(month,date, element);
}