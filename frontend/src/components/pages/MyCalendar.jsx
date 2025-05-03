import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importation des styles de base
import { Button, TextField, Card, CardContent, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { green, orange, blue, grey } from '@mui/material/colors';

export default function MyCalendar() {
  const [date, setDate] = useState(new Date()); // État pour la date sélectionnée
  const [tasks, setTasks] = useState({}); // Tâches associées à chaque date
  const [newTask, setNewTask] = useState(""); // Nouvelle tâche à ajouter

  // Fonction pour gérer le changement de date
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // Fonction pour ajouter une tâche
  const handleAddTask = () => {
    if (!newTask.trim()) return; // Ne pas ajouter une tâche vide
    const taskDate = date.toDateString();
    
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      if (!updatedTasks[taskDate]) {
        updatedTasks[taskDate] = [];
      }
      updatedTasks[taskDate].push({ text: newTask, completed: false });
      return updatedTasks;
    });

    setNewTask(""); // Réinitialiser le champ de la tâche
  };

  // Fonction pour marquer la tâche comme terminée
  const toggleTaskCompletion = (taskDate, index) => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[taskDate][index].completed = !updatedTasks[taskDate][index].completed;
      return updatedTasks;
    });
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Calendrier */}
      <div className="mb-6">
        <Calendar onChange={handleDateChange} value={date} />
        <Typography variant="h6" className="mt-2 text-center">
          {date.toDateString()}
        </Typography>
      </div>

      {/* To-Do List */}
      <div className="w-full max-w-md mb-6">
        <Card sx={{ backgroundColor: grey[50], padding: 2 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: green[600], fontWeight: 'bold' }} gutterBottom>
              Tâches du Restaurant
            </Typography>
            {/* Liste des tâches */}
            {tasks[date.toDateString()] && tasks[date.toDateString()].length > 0 ? (
              tasks[date.toDateString()].map((task, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(date.toDateString(), index)}
                        color="success"
                      />
                    }
                    label={<Typography variant="body1" sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</Typography>}
                  />
                </div>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: grey[600], textAlign: 'center' }}>
                Aucune tâche pour cette date
              </Typography>
            )}
            {/* Ajouter une tâche */}
            <TextField
              label="Nouvelle tâche"
              variant="outlined"
              fullWidth
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              sx={{ marginTop: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              sx={{ marginTop: 2, backgroundColor: orange[600], '&:hover': { backgroundColor: orange[800] } }}
            >
              Ajouter la tâche
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
