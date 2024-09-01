class Calendar {
    // Property declarations
    private calendar: HTMLElement | null;
    private date: HTMLElement | null;
    private daysContainer: HTMLElement | null;
    private prev: HTMLElement | null;
    private next: HTMLElement | null;
    private todayBtn: HTMLElement | null;
    private gotoBtn: HTMLElement | null;
    private dateInput: HTMLInputElement | null;
    private eventDay: HTMLElement | null;
    private eventDate: HTMLElement | null;
    private eventsContainer: HTMLElement | null;
    private addEventSubmit: HTMLElement | null;
  
    private today: Date;
    private activeDay: number | null;
    private month: number;
    private year: number;
  
    private months: string[];
    private eventsArr: { day: number; month: number; year: number; events: { title: string; time: string }[] }[];
  
    constructor() {
      // Initialize properties
      this.calendar = document.querySelector(".calendar");
      this.date = document.querySelector(".date");
      this.daysContainer = document.querySelector(".days");
      this.prev = document.querySelector(".prev");
      this.next = document.querySelector(".next");
      this.todayBtn = document.querySelector(".today-btn");
      this.gotoBtn = document.querySelector(".goto-btn");
      this.dateInput = document.querySelector(".date-input") as HTMLInputElement;
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
      this.prev?.addEventListener("click", () => this.prevMonth());
      this.next?.addEventListener("click", () => this.nextMonth());
      this.todayBtn?.addEventListener("click", () => this.goToToday());
      this.gotoBtn?.addEventListener("click", () => this.gotoDate());
      this.addEventSubmit?.addEventListener("click", () => this.addEvent());
  
      this.dateInput?.addEventListener("input", (e) => this.handleDateInput(e as InputEvent));
  
      // Additional event listeners for the event form
      this.addEventListeners();
    }
  
    // Initialize calendar days and update the calendar header
    private initCalendar() {
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
        let event = this.eventsArr.some(eventObj =>
          eventObj.day === i && eventObj.month === this.month + 1 && eventObj.year === this.year
        );
  
        if (i === new Date().getDate() &&
          this.year === new Date().getFullYear() &&
          this.month === new Date().getMonth()) {
          this.activeDay = i;
          this.getActiveDay(i);
          this.updateEvents(i);
  
          if (event) {
            days += `<div class="day today active event">${i}</div>`;
          } else {
            days += `<div class="day today active">${i}</div>`;
          }
        } else {
          if (event) {
            days += `<div class="day event">${i}</div>`;
          } else {
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
    private prevMonth() {
      this.month--;
      if (this.month < 0) {
        this.month = 11;
        this.year--;
      }
      this.initCalendar();
    }
  
    // Move to the next month
    private nextMonth() {
      this.month++;
      if (this.month > 11) {
        this.month = 0;
        this.year++;
      }
      this.initCalendar();
    }
  
    // Go to today's date
    private goToToday() {
      this.today = new Date();
      this.month = this.today.getMonth();
      this.year = this.today.getFullYear();
      this.initCalendar();
    }
  
    // Handle date input for the 'Go to Date' functionality
    private handleDateInput(e: InputEvent) {
      if (!this.dateInput) return;
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
    private gotoDate() {
      if (!this.dateInput) return;
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
    private addEventListeners() {
      const addEventBtn = document.querySelector(".add-event");
      const addEventContainer = document.querySelector(".add-event-wrapper");
      const addEventCloseBtn = document.querySelector(".close");
      const addEventTitle = document.querySelector(".event-name") as HTMLInputElement;
      const addEventTimeFrom = document.querySelector(".event-time-from") as HTMLInputElement;
      const addEventTimeTo = document.querySelector(".event-time-to") as HTMLInputElement;
  
      addEventBtn?.addEventListener("click", () => {
        addEventContainer?.classList.toggle("active");
      });
  
      addEventCloseBtn?.addEventListener("click", () => {
        addEventContainer?.classList.remove("active");
      });
  
      document.addEventListener("click", (e) => {
        if (e.target !== addEventBtn && !addEventContainer?.contains(e.target as Node)) {
          addEventContainer?.classList.remove("active");
        }
      });
  
      addEventTitle?.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        target.value = target.value.slice(0, 50);
      });
  
        addEventTimeFrom?.addEventListener("input", (e) => this.formatTimeInput(e as InputEvent));
        addEventTimeTo?.addEventListener("input", (e) => this.formatTimeInput(e as InputEvent));

        this.eventsContainer?.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains("event")) {
              this.handleEventDeletion(target);
            }
          });
    }

    private handleEventDeletion(target: HTMLElement) {
        const eventTitle = (target.querySelector(".event-title") as HTMLElement)?.innerHTML;
        if (!eventTitle) return;
    
        this.eventsArr.forEach((event) => {
          if (
            event.day === this.activeDay &&
            event.month === this.month + 1 &&
            event.year === this.year
          ) {
            event.events.forEach((item, index) => {
              if (item.title === eventTitle) {
                event.events.splice(index, 1);
              }
            });
    
            // Remove the eventObj if no more events are associated with this day
            if (event.events.length === 0) {
              this.eventsArr.splice(this.eventsArr.indexOf(event), 1);
    
              // Remove the "event" class from the active day element if needed
              const activeDayElement = document.querySelector(".day.active") as HTMLElement;
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
    private formatTimeInput(e: InputEvent) {
      const target = e.target as HTMLInputElement;
      target.value = target.value.replace(/[^0-9:]/g, "");
      if (target.value.length === 2) {
        target.value += ":";
      }
      if (target.value.length > 5) {
        target.value = target.value.slice(0, 5);
      }
    }
  
    // Add an event to the calendar
    private addEvent() {
      const eventTitleInput = document.querySelector(".event-name") as HTMLInputElement;
      const eventTimeFromInput = document.querySelector(".event-time-from") as HTMLInputElement;
      const eventTimeToInput = document.querySelector(".event-time-to") as HTMLInputElement;
  
      const eventTitle = eventTitleInput?.value.trim();
      const eventTimeFrom = eventTimeFromInput?.value.trim();
      const eventTimeTo = eventTimeToInput?.value.trim();
  
      if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
        alert("Моля, попълнете всички полета.");
        return;
      }
  
      const eventTime = `${this.convertTime(eventTimeFrom)} - ${this.convertTime(eventTimeTo)}`;
      const eventObj = { title: eventTitle, time: eventTime };
  
      const existingEventIndex = this.eventsArr.findIndex(event =>
        event.day === this.activeDay &&
        event.month === this.month + 1 &&
        event.year === this.year
      );
  
      if (existingEventIndex > -1) {
        const existingEvent = this.eventsArr[existingEventIndex];
        const duplicate = existingEvent.events.some(e => e.title === eventTitle);
  
        if (duplicate) {
          alert("Вече съществува събитие със същото име.");
          return;
        }
  
        existingEvent.events.push(eventObj);
      } else {
        this.eventsArr.push({
          day: this.activeDay!,
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

     private padStart(str: string, length: number, padChar: string): string {
        while (str.length < length) {
          str = padChar + str;
        }
        return str;
      }
      
      private convertTime(time: string): string {
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${this.padStart(minutes.toString(), 2, "0")} ${period}`;
      }
  
    // Add event listeners to calendar days
    private addListener() {
        const days = document.querySelectorAll(".day");
        days.forEach((day) => {
          day.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
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
                  if (
                    !day.classList.contains("prev-date") &&
                    day.textContent === String(day)
                  ) {
                    day.classList.add("active");
                  }
                });
              }, 100);
            } else if (target.classList.contains("next-date")) {
              this.nextMonth();
              setTimeout(() => {
                const newActive = document.querySelectorAll(".day");
                newActive.forEach((day) => {
                  if (
                    !day.classList.contains("next-date") &&
                    day.textContent === String(day)
                  ) {
                    day.classList.add("active");
                  }
                });
              }, 100);
            } else {
              target.classList.add("active");
            }
          });
        });
      }
  
    // Retrieve and display events for the active day
    private updateEvents(day: number | null) {
      this.eventsContainer!.innerHTML = "";
      if (day === null) return;
  
      const eventsForDay = this.eventsArr.find(eventObj =>
        eventObj.day === day && eventObj.month === this.month + 1 && eventObj.year === this.year
      );
  
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
          this.eventsContainer!.appendChild(eventDiv);
        });
      } else {
        const noEventDiv = document.createElement("div");
        noEventDiv.className = "no-event";
        noEventDiv.innerHTML = "Няма събития";
        this.eventsContainer!.appendChild(noEventDiv);
      }
    }
  
    // Update the active day's label
    private getActiveDay(day: number) {
      const dayOfWeek = new Date(this.year, this.month, day).toLocaleString("bg-BG", { weekday: "long" });
      this.eventDay!.textContent = dayOfWeek;
      this.eventDate!.textContent = `${day} ${this.months[this.month]} ${this.year}`;
    }
  
    // Retrieve events from local storage
    private getEvents() {
      const storedEvents = localStorage.getItem("events");
      if (storedEvents) {
        this.eventsArr = JSON.parse(storedEvents);
      }
    }
  }
  
  // Instantiate the calendar
  new Calendar();
  