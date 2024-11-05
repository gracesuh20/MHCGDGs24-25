// Import React library and images
import React, { useState } from 'react'
import { MdAddCircleOutline } from "react-icons/md"; 
import { CgTrash } from "react-icons/cg";
import { TbExclamationMark } from "react-icons/tb";
import { TbExclamationMarkOff } from "react-icons/tb";
import { MdOutlineEmail } from "react-icons/md";

// TodoList component that creates an interactive todolist
function TodoList() {

    // Gets current data
    function getDate() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${month}/${date}/${year}`;
    }

    // Functions to set tasks in list
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Shows text in textbox
    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    // Adds tasks to list
    function addTask() {
        if(newTask.trim() !== "") {
            setTasks(t => [...t, newTask]);
            setNewTask("");
        }
    }

    // Toggles checkboxes for completed tasks
    function checkTask(index) {
        const newTasks = [...tasks];
        newTasks[index].checked = !newTodos[index].checked;
        setTasks(newTasks);
    }

    // Deletes tasks from list
    function deleteTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    // Moves a task up on list
    function priority(index) {
        if(index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] 
            = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    // Moves a task down on list
    function removePriority(index) {
        if(index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] 
            = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    // Creates buttons, textboxes, and checkboxes for todolist
    return(
    <div className='to-do-list'>

        <h1>
            {getDate()}
            <button
                className = "notification-button"
                onClick = {addTask}>
                <MdOutlineEmail />
            </button>
        </h1>
        
        <div>
            <input
                type = "text"
                value = {newTask}
                placeholder= 'Enter task here...'
                onChange = {handleInputChange} />
            <button
                className = "add-task"
                onClick = {addTask}>
                <MdAddCircleOutline />
            </button>
        </div>

        <ol>
            {tasks.map((task, index) => 
                <li key = {index}>
                    <input 
                        type = "checkbox"
                        checked = {task.checked}
                        onChange = {checkTask} />
                    <span 
                        className = {"text"}
                        style = {{textDecoration: task.checked === true ? "line-through" : "none",}}>
                        {task} </span>
                    <button 
                        className = "delete-task"
                        onClick = {() => deleteTask(index)}>
                        <CgTrash />
                    </button>
                    <button 
                        className = "priority-task"
                        onClick = {() => priority(index)}>
                        <TbExclamationMark />
                    </button>
                    <button 
                        className = "remove-priority-task"
                        onClick = {() => removePriority(index)}>
                        <TbExclamationMarkOff />
                    </button>
                </li>
            )}
        </ol>

    </div>);
}

// Export to App.jsx
export default TodoList