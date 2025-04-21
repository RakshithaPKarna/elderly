import React, { useState, useEffect } from 'react';
import './Activities.css';
import axios from 'axios';

import med from "../../assets/med.png";
import calorie from "../../assets/calorie.png";
import todo from "../../assets/imp.png";
import physical from "../../assets/physical activities.jfif";

const Activities = () => {
  const [activityTypes, setActivityTypes] = useState(['Physical Activities', 'Important Tasks', 'Medicine', 'Calorie Counter']);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [activities, setActivities] = useState([]);
  const [activityName, setActivityName] = useState('');
  const [activityTime, setActivityTime] = useState('');
  const [reminder, setReminder] = useState(false);

  const selectActivityType = (type) => {
    setSelectedActivity(type);
    fetchActivities(type);
  };

  const activityInfo = {
    'Physical Activities': {
      image: physical,
    },
    'Important Tasks': {
      image: todo,
    },
    'Medicine': {
      image: med,
    },
    'Calorie Counter': {
      image: calorie,
    },
  };

  const addActivity = async () => {
    if (!activityName || !activityTime || !selectedActivity) {
      alert('Please enter activity type, name, and time.');
      return;
    }

    const newActivity = {
      type: selectedActivity,
      name: activityName,
      time: activityTime,
      reminder,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/activities', newActivity);
      setActivities([...activities, response.data]);
      setActivityName('');
      setActivityTime('');
      setReminder(false);
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Error adding activity. Please try again.');
    }
  };

  const deleteActivity = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/activities/${id}`);
      const updatedActivities = activities.filter((activity) => activity._id !== id);
      setActivities(updatedActivities);
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Error deleting activity. Please try again.');
    }
  };

  const fetchActivities = async (activityType) => {
    try {
      const response = await axios.get('http://localhost:3000/api/activities', {
        params: { type: activityType },
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className='activity'>
      <h1>Track and Manage Your Activities with Ease</h1>
      <div>
        <div className="activity-types">
          {activityTypes.map((type) => (
            <div
              key={type}
              className={`activity-type ${selectedActivity === type ? 'selected' : ''}`}
              onClick={() => selectActivityType(type)}
            >
              <img className='pic' src={activityInfo[type].image} alt={type} />
              <h4>{type}</h4>
            </div>
          ))}
        </div>
      </div>
      {selectedActivity && (
        <div className='activitydesc'>
          <div className='inputtext'>
            <input
              type="text"
              placeholder="Activity Name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
            <input
              className='clock'
              type="time"
              value={activityTime}
              onChange={(e) => setActivityTime(e.target.value)}
            />
            <label className='clock-label'>⏰ Select Time</label>
          </div>
          <button onClick={addActivity}>Add Activity</button>
        </div>
      )}
      <div className='list'>
        {activities.map((activity) => (
          <li key={activity._id}>
            {activity.name} at {activity.time}
            <button onClick={() => deleteActivity(activity._id)}>Delete</button>
          </li>
        ))}
      </div>
    </div>
  );
};

export default Activities;