import './App.css';
import { useState} from 'react';
import { eventsDB} from './db';
import { useLiveQuery } from "dexie-react-hooks";

var month_legnth = {0: ["January", 31], 1: ["Febuary", 28], 2: ["March", 31],
3: ["April", 30], 4: ["May", 31], 5: ["June", 30], 6: ["July", 31], 7: ["August", 31],
8: ["September", 30], 9: ["October", 31], 10: ["November", 30], 11: ["December", 31]}

var days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

var taskLog = {"demo": ["Confirm RSVPs", "2024-07-23", "Finance", "Company-Wide BBQ", "2024-08-01", "Ensure that everyone who wants to come to the event is accounted for, ensure that finance allocated enough funds for catering."],
  "demo2": ["Order Flowers", "2024-09-16", "Human Resources", "Company-Wide BBQ", "2024-08-01", "Order boquets for members of the team who've been there for more than 10 years, single flower for all other employees"],
  "demo3": ["Book Holiday Party Venue", "2024-09-24", "Accounting", "US Division Holiday Party", "Have accounting write a down payment check to book the Highlife Room at Kay-ce's"]
}


function getTaskValues(index) {
  var values = Object.keys(taskLog).map(function(key){
    return taskLog[key][index]})
  return values
}

function buildMonth() {
  var curr_date = new Date()
  var month = curr_date.getMonth()
  return month_legnth[month][0]
}

function buildCalander() {
  var curr_date = new Date()
  var month = curr_date.getMonth() + 1
  var year = curr_date.getFullYear()

  var first_day_month = new Date(year+"-"+month+"-1")
  if(year % 4 == 0) {
    month_legnth[1][1] = 29
  }
  var days_of_month = Array(month_legnth[first_day_month.getMonth()][1]).fill().map((_, index) => index + 1);
  var first_weekday = first_day_month.getDay()
  var week1 = days_of_month.slice(0 ,first_weekday -1)
  var first_week_legnth =  7 - week1.length
  var week2 = days_of_month.slice(7 - first_weekday, 7 - first_weekday + 7)
  var week3 = days_of_month.slice(14 - first_weekday, 14 - first_weekday + 7)
  var week4 = days_of_month.slice(21 - first_weekday, 21 - first_weekday + 7)
  var week5 =  days_of_month.slice(21 - first_weekday + 7)

  if (first_week_legnth != 0) {
    var empty_dates = Array(first_week_legnth).fill().map((x, i) => "0")
    week1 = empty_dates.concat(week1)
  }

  return [week1, week2, week3, week4, week5]
}

function dateToString(date) {
  var event_date = new Date(date)
  var weekday = days_of_week[event_date.getDay()]
  return weekday + ", " + month_legnth[parseInt(date.slice(5,7)) - 1][0] + " " + parseInt(date.slice(-2)) + ", " + date.slice(0,4)
}


function displayDay(day) {
  if (day == "0") {
    return " "
  }
  return day
}

function App() {

  //this is the display task
  const curr_date = new Date()
  const [curr_task, setCurr_Task] = useState(taskLog["demo"])
  //this is the current date
  const [display_date, setDisplayDate] = useState(month_legnth[curr_date.getMonth()][0]+ " "+ curr_date.getDate())
  const [day, setDay] = useState(String(curr_date.getMonth()+1)+"-"+String(curr_date.getDate()))
  const [dbstatus, setDBStatus] = useState("")

  //These are some hidden display elements
  const [new_event_display, setNewEventDisplay] = useState("none")

  //this sets the current event To Look At
  const [display_event, setDisplayEvent] = useState(taskLog["demo"][3])

  const ChangeTask = (date) => {
    const num_tasks = [...Array(Object.entries(taskLog).length).keys()]
    for (var i in num_tasks) {
      if ((Object.entries(taskLog)[i][1][1]).includes(date)) {
        setCurr_Task(Object.entries(taskLog)[i][1]);
      }
    }
  }

  const ChangeDisplayDate = (date) => {
    setDisplayDate(date)
  }

  function BuildWeek(week) {
    const weeks_of_month = buildCalander()
    const curr_date = new Date()
    const curr_month = curr_date.getMonth() + 1
    return (
      <tr>
        <th onClick={() => {
          setDay(String(curr_month+ "-" + weeks_of_month[week - 1][0]))
          setDisplayDate(month_legnth[curr_month - 1][0] + " " + weeks_of_month[week - 1][0])
          ChangeTask(day)
        }}>{displayDay(weeks_of_month[week - 1][0])}</th>
        <th
          onClick={() => {
            setDay(String(curr_month+ "-" + weeks_of_month[week - 1][1]))
            setDisplayDate(month_legnth[curr_month - 1][0] + " " + weeks_of_month[week - 1][1])
            ChangeTask(day)
          }}
        >{displayDay(weeks_of_month[week - 1][1])}</th>
        <th
          onClick={() => {
            setDay(String(curr_month+ "-" + weeks_of_month[week - 1][2]))
            setDisplayDate(month_legnth[curr_month - 1][0] + " " + weeks_of_month[week - 1][2])
            ChangeTask(day)
          }}
          >{displayDay(weeks_of_month[week - 1][2])}</th>
        <th
          onClick={() => {
            setDay(String(curr_month+ "-" + weeks_of_month[week - 1][3]))
            setDisplayDate(month_legnth[curr_month - 1][0] + " " + weeks_of_month[week - 1][3])
            ChangeTask(day)
          }}
          >{displayDay(weeks_of_month[week - 1][3])}</th>
        <th onClick={() => {
            setDay(String(curr_month+ "-" + weeks_of_month[week - 1][4]))
            setDisplayDate(month_legnth[curr_month - 1][0] + " " + weeks_of_month[week - 1][4])
            ChangeTask(day)
          }}>{displayDay(weeks_of_month[week - 1][4])}</th>
        <th onClick={() => {
            setDay(String(curr_month+ "-" + weeks_of_month[week - 1][5]))
            setDisplayDate(month_legnth[curr_month - 1][0] + " " + weeks_of_month[week - 1][5])
            ChangeTask(day)
          }}>{displayDay(weeks_of_month[week - 1][5])}</th>
        <th onClick={() => {
            setDay(String(curr_month+ "-" + weeks_of_month[week - 1][6]))
            setDisplayDate(month_legnth[curr_month - 1][0] + " " + weeks_of_month[week - 1][6])
            ChangeTask(day)
          }}>{displayDay(weeks_of_month[week - 1][6])}</th>
      </tr>
    );
  }

  function buildEvent() {
    return (
      <div className='taskDets'>
        <p className='title'>{curr_task[0]}</p>
        <p>{dateToString(curr_task[1])}</p>
        <p>{curr_task[2]}</p>
        <p>{curr_task[3]}</p>
        <p>{dateToString(curr_task[4])}</p>
        <p>{curr_task[5]}</p>
      </div>
    )
  }

  function Addtask() {
    var larger_events = [... new Set(getTaskValues(3))]

    function getSelectNewEvent() {
      const event_select = document.querySelector('#eventSelect');
      const output = event_select.value;
      if (output == "Create New Event") {
        document.getElementById("submitNewEvent").style.display = "block"
      }
    }

    function CreateDropdowns() {
      return (
        <select id="eventSelect" onChange={() => {getSelectNewEvent()}}>
          <option>Please Select an Event</option>
          <option value={"Create New Event"} onSelect={() => {console.log("changing display to show");document.getElementById("submitNewEvent").style.display = "block"}}>Create New Event</option>
          {larger_events.map(i => <option value={i} key={i}>{i}</option>)}
        </select>
      );
    }

    function AddNewTask() {
      const task_name = document.querySelector('#task_name').value;
      const task_date = document.querySelector('#task_date').value;
      const task_department = document.querySelector('#task_department').value;

      const events = useLiveQuery(() => eventsDB.events.toArray());

      for (let i = 0; i < events.length; i++) {
        if (events[i].eventName == task_name) {
          const id = await eventsDB.events.add({
            eventName,
            eventDate,
            associated_tasks
          });

          eventsDB.events.delete(eventsDB.events[i].id)
        }

      }

    }

    return (
      <div className='createTask'>
        <p>Want Help Generating Tasks For The {display_event}? Press The Button Below
          For AI Help To Come Up With Ideas To Make The {display_event} A Smashing Success!
          <br></br><button>Generate {display_event} Tasks</button><br></br>
          I'd Rather Do It On My Own
          <br></br><button onClick={() => {setNewEventDisplay("block")}}>Create My Own Tasks</button>
        </p>
        <div style={{display: new_event_display}} className='manual_task'>
        <p>Task Name</p>
        <input type="text" placeholder='Task Name' id="task_name"/>
        <br></br>
        <input placeholder='Department' type="text" id="task_department"/>
        <br></br>
        <input type='date' id="task_date"/>
        <br></br>
        {CreateDropdowns()}
        <br></br>
        <button onClick={() => AddNewTask()}>Submit Task</button>
        <p></p>
        <div id="submitNewEvent" style={{display: "none"}}>
          {AddEvent()}
        </div>
        </div>
      </div>
    )
    
  }

  function AddEvent() {
    const [eventDate, setEventDate] = useState("")
    const [eventName, setEventName] = useState("New Event Name")
    const associated_tasks = []
    
    async function addEvent() {
      try {
        const id = await eventsDB.events.add({
          eventName,
          eventDate,
          associated_tasks
        });
  
        setDBStatus(`${eventName}  on ${dateToString(eventDate.slice(0,10))} successfully added.`);
        setEventDate("");
        setEventName('New Event Name');
      } catch (error) {
        setDBStatus(`Failed to add ${eventName}: ${error}`);
      }
    }
   return (
    <div>
      <p>Event Name</p>
          <input type="text" onChange={(event) => {setEventName(event.target.value)}} placeholder={eventName}/>
          <br></br>
          <p>Event Date</p>
          <input type="datetime-local" onChange={(event) => {setEventDate(event.target.value)}}/> 
          <button onClick={() => addEvent()}>Submit</button>
          <br></br>
          <p>{dbstatus}</p>
    </div>
   )
  }

  function DisplayEvents() {
    const eventArray = eventsDB.events.toArray();
    const events = useLiveQuery(() => eventsDB.events.toArray());
    const upcoming_events = []
    const previous_events = []

  if (!events) return null;
  console.log(events[0].id)
  return (
    <ul>
      {events?.map((friend) => (
        <li key={friend.id}>
          {friend.eventName}, {dateToString(friend.eventDate.slice(0, 10))}, {friend.associated_tasks}
        </li>
      ))}
    </ul>
  );
  }


  function buildDailyOverview() {
    const num_tasks = [...Array(Object.entries(taskLog).length).keys()]
    var num_daily_task_count = 0
    for (var i in num_tasks) {
      if ((Object.entries(taskLog)[i][1][1]).includes(day)) {
        num_daily_task_count += 1
      }
    }

    if (num_daily_task_count == 1) {
      var message = "There is " + num_daily_task_count + " task planned for " + display_date
    }
    else {
      var message = "There are " + num_daily_task_count + " tasks planned for " + display_date
    }

    return (
      <div className='createDailyLog'>
        <p className='title'>{display_date}</p>
        <p>{message}</p>
      </div>
    )
  }

  return (

    <div className="App">
      <div className='calEvents'>
        <div className='month_cal'>
          <table>
                <caption>{buildMonth()}</caption>
                <thead>
                  <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tues</th>
                    <th>Wed</th>
                    <th>Thur</th>
                    <th>Fri</th>
                    <th>Sat</th>
                  </tr>
                </thead>
                <tbody>
                  {BuildWeek(1)}
                  {BuildWeek(2)}
                  {BuildWeek(3)}
                  {BuildWeek(4)}
                  {BuildWeek(5)}
                </tbody>
            </table>
            {DisplayEvents()}
        </div>
        <div className='task_cal'>
          {buildDailyOverview()}
          {buildEvent()}
          {Addtask()}
        </div>
      </div>
      </div>
  );
}

export default App;