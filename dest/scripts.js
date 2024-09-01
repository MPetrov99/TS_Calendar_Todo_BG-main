"use strict";
class Calendar {
    constructor() {
        var _a, _b, _c, _d, _e, _f;
        // Initialize properties
        this.calendar = document.querySelector(".calendar");
        this.date = document.querySelector(".date");
        this.daysContainer = document.querySelector(".days");
        this.prev = document.querySelector(".prev");
        this.next = document.querySelector(".next");
        this.todayBtn = document.querySelector(".today-btn");
        this.gotoBtn = document.querySelector(".goto-btn");
        this.dateInput = document.querySelector(".date-input");
        this.eventDay = document.querySelector(".event-day");
        this.eventDate = document.querySelector(".event-date");
        this.eventsContainer = document.querySelector(".events");
        this.addEventSubmit = document.querySelector(".add-event-btn");
        this.today = new Date();
        this.activeDay = null;
        this.month = this.today.getMonth();
        this.year = this.today.getFullYear();
        this.months = [
            "Януари", "Февруари", "Март", "Април", "Май", "Юни",
            "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"
        ];
        this.eventsArr = [];
        this.getEvents(); // Retrieve saved events
        // Initialize calendar
        this.initCalendar();
        // Event listeners for navigation buttons and interactions
        (_a = this.prev) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.prevMonth());
        (_b = this.next) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.nextMonth());
        (_c = this.todayBtn) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => this.goToToday());
        (_d = this.gotoBtn) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => this.gotoDate());
        (_e = this.addEventSubmit) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => this.addEvent());
        (_f = this.dateInput) === null || _f === void 0 ? void 0 : _f.addEventListener("input", (e) => this.handleDateInput(e));
        // Additional event listeners for the event form
        this.addEventListeners();
    }
    // Initialize calendar days and update the calendar header
    initCalendar() {
        const firstDay = new Date(this.year, this.month, 1);
        const lastDay = new Date(this.year, this.month + 1, 0);
        const prevLastDay = new Date(this.year, this.month, 0);
        const prevDays = prevLastDay.getDate();
        const lastDate = lastDay.getDate();
        const day = firstDay.getDay();
        const nextDays = 7 - lastDay.getDay() - 1;
        // Update the calendar header
        if (this.date) {
            this.date.innerHTML = `${this.months[this.month]} ${this.year}`;
        }
        // Create days in the calendar
        let days = "";
        // Days from the previous month
        for (let x = day; x > 0; x--) {
            days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
        }
        // Days from the current month
        for (let i = 1; i <= lastDate; i++) {
            let event = this.eventsArr.some(eventObj => eventObj.day === i && eventObj.month === this.month + 1 && eventObj.year === this.year);
            if (i === new Date().getDate() &&
                this.year === new Date().getFullYear() &&
                this.month === new Date().getMonth()) {
                this.activeDay = i;
                this.getActiveDay(i);
                this.updateEvents(i);
                if (event) {
                    days += `<div class="day today active event">${i}</div>`;
                }
                else {
                    days += `<div class="day today active">${i}</div>`;
                }
            }
            else {
                if (event) {
                    days += `<div class="day event">${i}</div>`;
                }
                else {
                    days += `<div class="day">${i}</div>`;
                }
            }
        }
        // Days from the next month
        for (let j = 1; j <= nextDays; j++) {
            days += `<div class="day next-date">${j}</div>`;
        }
        if (this.daysContainer) {
            this.daysContainer.innerHTML = days;
        }
        // Add event listeners to the newly created days
        this.addListener();
    }
    // Move to the previous month
    prevMonth() {
        this.month--;
        if (this.month < 0) {
            this.month = 11;
            this.year--;
        }
        this.initCalendar();
    }
    // Move to the next month
    nextMonth() {
        this.month++;
        if (this.month > 11) {
            this.month = 0;
            this.year++;
        }
        this.initCalendar();
    }
    // Go to today's date
    goToToday() {
        this.today = new Date();
        this.month = this.today.getMonth();
        this.year = this.today.getFullYear();
        this.initCalendar();
    }
    // Handle date input for the 'Go to Date' functionality
    handleDateInput(e) {
        if (!this.dateInput)
            return;
        this.dateInput.value = this.dateInput.value.replace(/[^0-9/]/g, "");
        if (this.dateInput.value.length === 2) {
            this.dateInput.value += "/";
        }
        if (this.dateInput.value.length > 7) {
            this.dateInput.value = this.dateInput.value.slice(0, 7);
        }
        if (e.inputType === "deleteContentBackward" && this.dateInput.value.length === 3) {
            this.dateInput.value = this.dateInput.value.slice(0, 2);
        }
    }
    // Go to the specified date
    gotoDate() {
        if (!this.dateInput)
            return;
        const dateArr = this.dateInput.value.split("/");
        if (dateArr.length === 2) {
            if (+dateArr[0] > 0 && +dateArr[0] < 13 && dateArr[1].length === 4) {
                this.month = +dateArr[0] - 1;
                this.year = +dateArr[1];
                this.initCalendar();
                return;
            }
        }
        alert("Въведената дата е невалидна.");
    }
    // Add event listeners for the event form
    addEventListeners() {
        var _a;
        const addEventBtn = document.querySelector(".add-event");
        const addEventContainer = document.querySelector(".add-event-wrapper");
        const addEventCloseBtn = document.querySelector(".close");
        const addEventTitle = document.querySelector(".event-name");
        const addEventTimeFrom = document.querySelector(".event-time-from");
        const addEventTimeTo = document.querySelector(".event-time-to");
        addEventBtn === null || addEventBtn === void 0 ? void 0 : addEventBtn.addEventListener("click", () => {
            addEventContainer === null || addEventContainer === void 0 ? void 0 : addEventContainer.classList.toggle("active");
        });
        addEventCloseBtn === null || addEventCloseBtn === void 0 ? void 0 : addEventCloseBtn.addEventListener("click", () => {
            addEventContainer === null || addEventContainer === void 0 ? void 0 : addEventContainer.classList.remove("active");
        });
        document.addEventListener("click", (e) => {
            if (e.target !== addEventBtn && !(addEventContainer === null || addEventContainer === void 0 ? void 0 : addEventContainer.contains(e.target))) {
                addEventContainer === null || addEventContainer === void 0 ? void 0 : addEventContainer.classList.remove("active");
            }
        });
        addEventTitle === null || addEventTitle === void 0 ? void 0 : addEventTitle.addEventListener("input", (e) => {
            const target = e.target;
            target.value = target.value.slice(0, 50);
        });
        addEventTimeFrom === null || addEventTimeFrom === void 0 ? void 0 : addEventTimeFrom.addEventListener("input", (e) => this.formatTimeInput(e));
        addEventTimeTo === null || addEventTimeTo === void 0 ? void 0 : addEventTimeTo.addEventListener("input", (e) => this.formatTimeInput(e));
        (_a = this.eventsContainer) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
            const target = e.target;
            if (target.classList.contains("event")) {
                this.handleEventDeletion(target);
            }
        });
    }
    handleEventDeletion(target) {
        var _a;
        const eventTitle = (_a = target.querySelector(".event-title")) === null || _a === void 0 ? void 0 : _a.innerHTML;
        if (!eventTitle)
            return;
        this.eventsArr.forEach((event) => {
            if (event.day === this.activeDay &&
                event.month === this.month + 1 &&
                event.year === this.year) {
                event.events.forEach((item, index) => {
                    if (item.title === eventTitle) {
                        event.events.splice(index, 1);
                    }
                });
                // Remove the eventObj if no more events are associated with this day
                if (event.events.length === 0) {
                    this.eventsArr.splice(this.eventsArr.indexOf(event), 1);
                    // Remove the "event" class from the active day element if needed
                    const activeDayElement = document.querySelector(".day.active");
                    if (activeDayElement && activeDayElement.classList.contains("event")) {
                        activeDayElement.classList.remove("event");
                    }
                }
            }
        });
        // Update events display after removal
        this.updateEvents(this.activeDay);
    }
    // Format time input for the event form
    formatTimeInput(e) {
        const target = e.target;
        target.value = target.value.replace(/[^0-9:]/g, "");
        if (target.value.length === 2) {
            target.value += ":";
        }
        if (target.value.length > 5) {
            target.value = target.value.slice(0, 5);
        }
    }
    // Add an event to the calendar
    addEvent() {
        const eventTitleInput = document.querySelector(".event-name");
        const eventTimeFromInput = document.querySelector(".event-time-from");
        const eventTimeToInput = document.querySelector(".event-time-to");
        const eventTitle = eventTitleInput === null || eventTitleInput === void 0 ? void 0 : eventTitleInput.value.trim();
        const eventTimeFrom = eventTimeFromInput === null || eventTimeFromInput === void 0 ? void 0 : eventTimeFromInput.value.trim();
        const eventTimeTo = eventTimeToInput === null || eventTimeToInput === void 0 ? void 0 : eventTimeToInput.value.trim();
        if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
            alert("Моля, попълнете всички полета.");
            return;
        }
        const eventTime = `${this.convertTime(eventTimeFrom)} - ${this.convertTime(eventTimeTo)}`;
        const eventObj = { title: eventTitle, time: eventTime };
        const existingEventIndex = this.eventsArr.findIndex(event => event.day === this.activeDay &&
            event.month === this.month + 1 &&
            event.year === this.year);
        if (existingEventIndex > -1) {
            const existingEvent = this.eventsArr[existingEventIndex];
            const duplicate = existingEvent.events.some(e => e.title === eventTitle);
            if (duplicate) {
                alert("Вече съществува събитие със същото име.");
                return;
            }
            existingEvent.events.push(eventObj);
        }
        else {
            this.eventsArr.push({
                day: this.activeDay,
                month: this.month + 1,
                year: this.year,
                events: [eventObj],
            });
        }
        alert("Събитието е добавено успешно.");
        this.updateEvents(this.activeDay);
        eventTitleInput.value = "";
        eventTimeFromInput.value = "";
        eventTimeToInput.value = "";
    }
    padStart(str, length, padChar) {
        while (str.length < length) {
            str = padChar + str;
        }
        return str;
    }
    convertTime(time) {
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${this.padStart(minutes.toString(), 2, "0")} ${period}`;
    }
    // Add event listeners to calendar days
    addListener() {
        const days = document.querySelectorAll(".day");
        days.forEach((day) => {
            day.addEventListener("click", (e) => {
                const target = e.target;
                const day = Number(target.textContent);
                this.updateEvents(day);
                this.activeDay = day;
                this.getActiveDay(day);
                days.forEach((day) => {
                    day.classList.remove("active");
                });
                if (target.classList.contains("prev-date")) {
                    this.prevMonth();
                    setTimeout(() => {
                        const newActive = document.querySelectorAll(".day");
                        newActive.forEach((day) => {
                            if (!day.classList.contains("prev-date") &&
                                day.textContent === String(day)) {
                                day.classList.add("active");
                            }
                        });
                    }, 100);
                }
                else if (target.classList.contains("next-date")) {
                    this.nextMonth();
                    setTimeout(() => {
                        const newActive = document.querySelectorAll(".day");
                        newActive.forEach((day) => {
                            if (!day.classList.contains("next-date") &&
                                day.textContent === String(day)) {
                                day.classList.add("active");
                            }
                        });
                    }, 100);
                }
                else {
                    target.classList.add("active");
                }
            });
        });
    }
    // Retrieve and display events for the active day
    updateEvents(day) {
        this.eventsContainer.innerHTML = "";
        if (day === null)
            return;
        const eventsForDay = this.eventsArr.find(eventObj => eventObj.day === day && eventObj.month === this.month + 1 && eventObj.year === this.year);
        if (eventsForDay && eventsForDay.events.length > 0) {
            eventsForDay.events.forEach((event) => {
                const eventDiv = document.createElement("div");
                eventDiv.className = "event";
                const eventTitle = document.createElement("div");
                eventTitle.className = "event-title";
                eventTitle.innerHTML = event.title;
                const eventTime = document.createElement("div");
                eventTime.className = "event-time";
                eventTime.innerHTML = event.time;
                eventDiv.appendChild(eventTitle);
                eventDiv.appendChild(eventTime);
                this.eventsContainer.appendChild(eventDiv);
            });
        }
        else {
            const noEventDiv = document.createElement("div");
            noEventDiv.className = "no-event";
            noEventDiv.innerHTML = "Няма събития";
            this.eventsContainer.appendChild(noEventDiv);
        }
    }
    // Update the active day's label
    getActiveDay(day) {
        const dayOfWeek = new Date(this.year, this.month, day).toLocaleString("bg-BG", { weekday: "long" });
        this.eventDay.textContent = dayOfWeek;
        this.eventDate.textContent = `${day} ${this.months[this.month]} ${this.year}`;
    }
    // Retrieve events from local storage
    getEvents() {
        const storedEvents = localStorage.getItem("events");
        if (storedEvents) {
            this.eventsArr = JSON.parse(storedEvents);
        }
    }
}
// Instantiate the calendar
new Calendar();
