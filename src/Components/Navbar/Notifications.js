
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [tasks, setTasks] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    // Fetch tasks from the server
    axios.get('http://localhost:3000/api/activities')
      .then(response => {
        // Filter tasks that are within the next hour
        const currentTime = new Date();
        const upcomingTasks = response.data.filter(task => {
          const taskTime = new Date(`${task.date} ${task.time}`);
          return taskTime <= new Date(currentTime.getTime() + 60 * 60 * 1000); // Check if within the next hour
        });

        setTasks(upcomingTasks);

        upcomingTasks.forEach(task => {
          const taskTime = new Date(`${task.date} ${task.time}`);
          const timeDiff = taskTime - currentTime;

          // Calculate the time difference in minutes
          const minutesLeft = Math.floor(timeDiff / (1000 * 60));

          // Update the time left for each task
          setTimeLeft(prevTimeLeft => ({
            ...prevTimeLeft,
            [task.name]: minutesLeft
          }));

          // If the task is within the next minute, announce it
          if (minutesLeft <= 1) {
            announceTask(task);
          } else {
            // Otherwise, schedule the announcement
            setTimeout(() => {
              announceTask(task);
            }, timeDiff);
          }
        });
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Function to announce the task using ResponsiveVoice
  const announceTask = (task) => {
    console.log(`Announcing task: ${task.name} at ${task.time}`);  // Log the announcement
    if (window.ResponsiveVoice) {
      window.ResponsiveVoice.speak(`${task.name} at ${task.time}`, 'UK English Male');
    } else {
      console.error("ResponsiveVoice is not available.");
    }
  };

  return (
    <div>
      <h1>Upcoming Tasks</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.name} at {task.time} - {timeLeft[task.name]} minutes left
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;