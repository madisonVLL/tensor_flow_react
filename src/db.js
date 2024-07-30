// db.js
import Dexie from 'dexie';

export const eventsDB = new Dexie('eventDB');
eventsDB.version(2).stores({
  events: '++id, title, date, associated_tasks',
  tasks: '++id, task, task_date'
});


