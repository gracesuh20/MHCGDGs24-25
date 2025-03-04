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
 * TodoList component that creates an interactive todo list with tags
 */
function TodoList() {
    // Functions to set tasks
    const [tasksByDate, setTasksByDate] = useState({});
    const [newTask, setNewTask] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [availableTags, setAvailableTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [newTaskTags, setNewTaskTags] = useState([]);
    const [editTaskTags, setEditTaskTags] = useState([]);
    const [filterTag, setFilterTag] = useState("");

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
        setNewTaskTags([]);
        setFilterTag("");
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
                isPriority: false,
                tags: newTaskTags
            };

            setTasksByDate({
                ...tasksByDate,
                [dateKey]: [...currentTasks, task]
            });
            setNewTask("");
            setNewTaskTags([]);
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
    function startEditing(index, text, tags) {
        setEditIndex(index);
        setEditText(text);
        setEditTaskTags([...tags]);
    }

    // Save new edits to a task
    function saveEdit(index) {
        if (editText.trim() !== "") {
            const dateKey = formatDate(selectedDate);
            const currentTasks = [...tasksByDate[dateKey]];
            currentTasks[index].text = editText;
            currentTasks[index].tags = editTaskTags;
            
            setTasksByDate({
                ...tasksByDate,
                [dateKey]: currentTasks
            });
            setEditIndex(null);
            setEditText("");
            setEditTaskTags([]);
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

    // Add a new tag to available tags
    function addNewTag() {
        if (newTag.trim() !== "" && !availableTags.includes(newTag.trim())) {
            setAvailableTags([...availableTags, newTag.trim()]);
            setNewTag("");
        }
    }

    // Toggle tag for new task
    function toggleTagForNewTask(tag) {
        if (newTaskTags.includes(tag)) {
            setNewTaskTags(newTaskTags.filter(t => t !== tag));
        } else {
            setNewTaskTags([...newTaskTags, tag]);
        }
    }

    // Toggle tag for task being edited
    function toggleTagForEditTask(tag) {
        if (editTaskTags.includes(tag)) {
            setEditTaskTags(editTaskTags.filter(t => t !== tag));
        } else {
            setEditTaskTags([...editTaskTags, tag]);
        }
    }

    // Create a starry mouse cursor trail
    window.addEventListener('mousemove', function(e) {
        var arr = [1, 0.9, 0.8, 0.5, 0.2];
  
        arr.forEach(function(i) {
          var x = (1 - i) * 75;
          var star = document.createElement('div');
  
          star.className = 'star';
          star.style.top = e.pageY + Math.round(Math.random() * x - x / 2) + 'px';
          star.style.left = e.pageX + Math.round(Math.random() * x - x / 2) + 'px';
  
          document.body.appendChild(star);
  
          window.setTimeout(function() {
            document.body.removeChild(star);
          }, Math.round(Math.random() * i * 600));
        });
    }, false);

    // Get tasks for the selected date and filter by tag if needed
    const currentTasks = getCurrentTasks().filter(task => 
        filterTag === "" || task.tags.includes(filterTag)
    );

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

            <div className="task-input-container">
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
                
                <div className="tag-selector">
                    <div className="available-tags">
                        {availableTags.map((tag, idx) => (
                            <span 
                                key={idx} 
                                className={`tag ${newTaskTags.includes(tag) ? 'selected' : ''}`}
                                onClick={() => toggleTagForNewTask(tag)}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="new-tag-input">
                        <input
                            type="text"
                            value={newTag}
                            placeholder="Add new tag..."
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addNewTag();
                                }
                            }}
                        />
                        <button onClick={addNewTag}>+</button>
                    </div>
                </div>
            </div>
            
            <div className="filter-container">
                <label>Filter by tag: </label>
                <select 
                    value={filterTag} 
                    onChange={(e) => setFilterTag(e.target.value)}
                >
                    <option value="">All Tasks</option>
                    {availableTags.map((tag, idx) => (
                        <option key={idx} value={tag}>{tag}</option>
                    ))}
                </select>
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
                                
                                <div className="edit-tags">
                                    {availableTags.map((tag, idx) => (
                                        <span 
                                            key={idx} 
                                            className={`tag ${editTaskTags.includes(tag) ? 'selected' : ''}`}
                                            onClick={() => toggleTagForEditTask(tag)}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <button onClick={() => saveEdit(index)}>
                                    <MdOutlineCheck />
                                </button>
                                <button onClick={() => setEditIndex(null)}>
                                    <MdOutlineClear />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span 
                                    className="text" 
                                    style={{
                                        textDecoration: task.checked ? 'line-through' : 'none',
                                        color: task.checked ? '#a19f9f' : 'inherit'
                                    }}
                                >
                                    {task.text}
                                    <div className="task-tags">
                                        {task.tags.map((tag, idx) => (
                                            <span key={idx} className="tag-pill">{tag}</span>
                                        ))}
                                    </div>
                                </span>
                                <button 
                                    className="edit-task"
                                    onClick={() => startEditing(index, task.text, task.tags)}>
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