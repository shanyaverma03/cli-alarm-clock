const readline = require("readline");

class Alarm {
  constructor(time, dayOfWeek) {
    this.time = time;
    this.dayOfWeek = dayOfWeek;
    this.snoozeCount = 0;
    this.active = true;
  }

  snooze() {
    if (this.snoozeCount < 3) {
      this.snoozeCount++;
      const [hours, minutes] = this.time.split(":").map(Number);
      const newMinutes = (minutes + 5) % 60;
      const newHours = minutes + 5 >= 60 ? (hours + 1) % 24 : hours;
      this.time = `${newHours < 10 ? "0" : ""}${newHours}:${
        newMinutes < 10 ? "0" : ""
      }${newMinutes}`;
      console.log(`Alarm snoozed to ${this.time}`);
    } else {
      console.log("Maximum snooze limit reached.");
    }
  }

  deactivate() {
    this.active = false;
    console.log("Alarm dismissed.");
  }
}

class AlarmClock {
  constructor() {
    this.alarms = [];
    this.checkInterval = null;
    this.isHandlingAlarm = false; // Flag to track if an alarm is being handled
  }

  displayCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;
    console.log(`Current time: ${formattedTime}`);
  }

  addAlarm(time, dayOfWeek) {
    this.alarms.push(new Alarm(time, dayOfWeek));
    console.log(`Alarm added for ${time} on day ${dayOfWeek}`);
  }

  deleteAlarm(index) {
    if (index >= 0 && index < this.alarms.length) {
      this.alarms.splice(index, 1);
      console.log("Alarm deleted.");
    } else {
      console.log("Invalid alarm index.");
    }
  }

  checkAlarms() {
    if (this.isHandlingAlarm) return; // Skip checking if an alarm is being handled

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHours < 10 ? "0" : ""}${currentHours}:${
      currentMinutes < 10 ? "0" : ""
    }${currentMinutes}`;
    const currentDay = ((now.getDay() + 6) % 7) + 1; // 1-7 (Mon-Sun)

    console.log(`Checking alarms at ${currentTime} on day ${currentDay}`);

    for (const alarm of this.alarms) {
      if (
        alarm.active &&
        alarm.time === currentTime &&
        alarm.dayOfWeek === currentDay
      ) {
        this.isHandlingAlarm = true; // Set flag to indicate alarm is being handled
        this.triggerAlarm(alarm);
        break; // Exit loop after triggering an alarm
      }
    }
  }

  triggerAlarm(alarm) {
    clearInterval(this.checkInterval); // Pause the alarm checks
    console.log("Alarm ringing!");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Snooze or Dismiss? (s/d): ", (answer) => {
      const input = answer.trim().toLowerCase();
      if (input.toLowerCase() === "s" || input.toLowerCase() === "ss") {
        console.log("in snooze");
        alarm.snooze();
      } else if (input.toLowerCase() === "d" || input.toLowerCase() === "dd") {
        alarm.deactivate();
      } else {
        console.log(input);
        console.log("in else");
        console.log("Invalid option.");
      }
      rl.close();
      this.isHandlingAlarm = false; // Reset flag
      this.startCheckingAlarms(); // Resume alarm checks
    });
  }

  startCheckingAlarms() {
    this.checkInterval = setInterval(() => {
      console.log("Running checkAlarms()...");
      this.checkAlarms();
    }, 60000); // Check every 60 seconds
  }
}

const alarmClock = new AlarmClock();
alarmClock.displayCurrentTime();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = () => {
  console.log("\n1. Display Current Time");
  console.log("2. Add Alarm");
  console.log("3. Delete Alarm");
  console.log("4. Exit");
  rl.question("Choose an option: ", (option) => {
    switch (option) {
      case "1":
        alarmClock.displayCurrentTime();
        menu();
        break;
      case "2":
        rl.question("Enter alarm time (HH:MM): ", (time) => {
          rl.question(
            "Enter day of week (1 for Monday, 7 for Sunday): ",
            (day) => {
              alarmClock.addAlarm(time, Number(day));
              console.log("Alarm added.");
              menu();
            }
          );
        });
        break;
      case "3":
        rl.question("Enter alarm index to delete: ", (index) => {
          alarmClock.deleteAlarm(Number(index));
          console.log("Alarm deleted.");
          menu();
        });
        break;
      case "4":
        rl.close();
        break;
      default:
        console.log("Thanks for your input");
        menu();
        break;
    }
  });
};

alarmClock.startCheckingAlarms(); // Start checking alarms when the program runs

menu();
