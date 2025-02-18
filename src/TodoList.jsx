// Import React library and images
import React, { useState } from 'react';
// React Date Picker credit to: Wojciech Maj
import { DatePicker } from 'react-date-picker';
import { CgTrash } from "react-icons/cg";
// Import React icons
import { BsExclamationCircleFill } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { MdOutlineCheck } from "react-icons/md";
import { MdOutlineClear } from "react-icons/md";
// Import CSS styling for calendar
import '/Users/c/Desktop/ToDoList/MHCGDGs24-25/src/DatePicker.css';
import '/Users/c/Desktop/ToDoList/MHCGDGs24-25/src/Calendar.css';
// Checkbox component credit to: LarvenLLC
import * as Icon from "react-icons/fi";
import Checkbox from "react-custom-checkbox";

/*
 * TodoList component that creates an interactive todo list
 */
function TodoList() {
    // Functions to set tasks
    const [tasksByDate, setTasksByDate] = useState({});
    const [newTask, setNewTask] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");

    // Helper function to format date
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Get tasks for current selected date
    const getCurrentTasks = () => {
        const dateKey = formatDate(selectedDate);
        return tasksByDate[dateKey] || [];
    };

    // Updates selected date in calendar
    function handleDateChange(date) {
        setSelectedDate(date);
        setEditIndex(null);
        setNewTask("");
    }

    // Shows text in textbox
    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    // Adds tasks to list
    function addTask() {
        if (newTask.trim() !== "") {
            const dateKey = formatDate(selectedDate);
            const currentTasks = tasksByDate[dateKey] || [];
            
            const task = {
                text: newTask,
                checked: false,
                isPriority: false
            };

            setTasksByDate({
                ...tasksByDate,
                [dateKey]: [...currentTasks, task]
            });
            setNewTask("");
        }
    }

    // Toggles checkboxes for completed tasks
    function checkTask(index) {
        const dateKey = formatDate(selectedDate);
        const currentTasks = [...tasksByDate[dateKey]];
        currentTasks[index].checked = !currentTasks[index].checked;
        
        setTasksByDate({
            ...tasksByDate,
            [dateKey]: currentTasks
        });
    }

    // Start editing a task
    function startEditing(index, text) {
        setEditIndex(index);
        setEditText(text);
    }

    // Save new edits to a task
    function saveEdit(index) {
        if (editText.trim() !== "") {
            const dateKey = formatDate(selectedDate);
            const currentTasks = [...tasksByDate[dateKey]];
            currentTasks[index].text = editText;
            
            setTasksByDate({
                ...tasksByDate,
                [dateKey]: currentTasks
            });
            setEditIndex(null);
            setEditText("");
        }
    }

    // Deletes tasks from list
    function deleteTask(index) {
        const dateKey = formatDate(selectedDate);
        const currentTasks = tasksByDate[dateKey].filter((_, i) => i !== index);
        
        setTasksByDate({
            ...tasksByDate,
            [dateKey]: currentTasks
        });
    }

    // Moves a task up or down list
    function togglePriority(index) {
        const dateKey = formatDate(selectedDate);
        const currentTasks = [...tasksByDate[dateKey]];
        const task = currentTasks[index];
        
        task.isPriority = !task.isPriority;
        currentTasks.splice(index, 1);
        
        if (task.isPriority) {
            currentTasks.unshift(task);
        } else {
            currentTasks.push(task);
        }
        
        setTasksByDate({
            ...tasksByDate,
            [dateKey]: currentTasks
        });
    }

    // Get tasks for the selected date
    const currentTasks = getCurrentTasks();

    // Creates buttons, checkboxes, and textboxes
    return (
        <div className='to-do-list'>
            <h1>
                <DatePicker 
                    onChange={handleDateChange} 
                    value={selectedDate}  
                />
                <button
                    className="notification-button"
                    onClick={addTask}>
                    <MdOutlineEmail />
                </button>
            </h1>
            
            <div>
                <input
                    type="text"
                    value={newTask}
                    placeholder='Enter task here...'
                    onChange={handleInputChange} 
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addTask();
                        }
                    }}
                />
            </div>

            <ol>
                {currentTasks.map((task, index) => (
                    <li key={index}>
                        <Checkbox 
                            icon={<Icon.FiCheck color="#090909" size={14} />}
                            checked={task.checked}
                            onChange={() => checkTask(index)}
                            borderColor="#090909"
                        />
                        
                        {editIndex === index ? (
                            <div style={{ display: 'inline-block' }}>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            saveEdit(index);
                                        }
                                    }}
                                />
                                <button onClick={() => saveEdit(index)}>
                                    <MdOutlineCheck />
                                </button>
                                <button onClick={() => setEditIndex(null)}>
                                    <MdOutlineClear />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="text">{task.text}</span>
                                <button 
                                    className="edit-task"
                                    onClick={() => startEditing(index, task.text)}>
                                    <FaPen />
                                </button>
                            </>
                        )}

                        <button 
                            className="delete-task"
                            onClick={() => deleteTask(index)}>
                            <CgTrash />
                        </button>
                        <button 
                            className="priority-task"
                            onClick={() => togglePriority(index)}>
                            <BsExclamationCircleFill style={{ color: task.isPriority ? 'red' : 'black' }}/>
                        </button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

// Export to App.jsx
export default TodoList;