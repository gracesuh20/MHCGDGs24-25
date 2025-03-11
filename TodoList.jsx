// Import React library and images
import React, { useState } from 'react';
// React Date Picker credit to: Wojciech Maj
import { DatePicker } from 'react-date-picker';
import { CgTrash } from "react-icons/cg";
// Import React icons
import { BsExclamationCircleFill } from "react-icons/bs";
import { MdOutlineEmail, MdOutlineCheck, MdOutlineClear } from "react-icons/md";
import { FaPen } from "react-icons/fa";
// Import CSS styling for calendar
import './DatePicker.css';
import './Calendar.css';
// Checkbox component credit to: LarvenLLC
import * as Icon from "react-icons/fi";
import Checkbox from "react-custom-checkbox";

/*
 * TodoList component that creates an interactive todo list with tags
 */
function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [availableTags, setAvailableTags] = useState(["Work", "Personal", "Urgent"]);
    const [newTag, setNewTag] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskInput, setEditTaskInput] = useState("");
    const [editTaskTags, setEditTaskTags] = useState([]);

    // add task
    function addTask() {
        if (taskInput.trim() !== "") {
            const newTask = { id: Date.now(), text: taskInput, tags: [...selectedTags] };
            setTasks([...tasks, newTask]);
            setTaskInput("");
            setSelectedTags([]); // clear choosed labels
        }
    }

    // add new tags
    function addNewTag() {
        if (newTag.trim() !== "" && !availableTags.includes(newTag.trim())) {
            setAvailableTags([...availableTags, newTag.trim()]);
            setNewTag("");
        }
    }

    // select tags (used to create new tasks)
    function toggleTag(tag) {
        setSelectedTags(prevTags =>
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
        );
    }

    // start editing tasks
    function startEditingTask(task) {
        setEditingTask(task.id);
        setEditTaskInput(task.text);
        setEditTaskTags([...task.tags]); // duplicate labels
    }

    // save edited tasks
    function saveEditedTask() {
        setTasks(tasks.map(task =>
            task.id === editingTask ? { ...task, text: editTaskInput, tags: editTaskTags } : task
        ));
        setEditingTask(null);
        setEditTaskInput("");
        setEditTaskTags([]);
    }

    // choose lables (used to edit tasks)
    function toggleEditTag(tag) {
        setEditTaskTags(prevTags =>
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
        );
    }

    // delete tasks
    function deleteTask(taskId) {
        setTasks(tasks.filter(task => task.id !== taskId));
    }

    return (
        <div className="max-w-lg mx-auto p-5 font-sans">
            <h1 className="text-2xl font-bold mb-4 text-center">📋 To-Do List</h1>

            {/* Task Input */}
            <div className="mb-4">
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Enter a new task..."
                    className="border p-2 w-full rounded text-lg"
                />
                <button onClick={addTask} className="ml-2 bg-blue-500 text-white p-2 rounded text-lg">Add Task</button>
            </div>

            {/* Tag Selection for New Task */}
            <h2 className="text-lg font-semibold mb-2">🏷️ Select Labels:</h2>
            <div className="mb-4">
                {availableTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`m-1 px-3 py-1 rounded text-sm flex items-center 
                            ${selectedTags.includes(tag) ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                        {selectedTags.includes(tag) && <span className="mr-1">✅</span>}
                        {tag}
                    </button>
                ))}
            </div>

            {/* Add New Label */}
            <div className="mb-4 flex">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter new label..."
                    className="border p-2 rounded w-full text-lg"
                />
                <button onClick={addNewTag} className="ml-2 bg-purple-500 text-white p-2 rounded text-lg">Add Label</button>
            </div>

            {/* Task List */}
            <h2 className="text-lg font-semibold mb-2">📌 Task List:</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id} className="border p-3 mb-2 rounded flex flex-col items-start">
                        {editingTask === task.id ? (
                            <div className="w-full">
                                <input
                                    type="text"
                                    value={editTaskInput}
                                    onChange={(e) => setEditTaskInput(e.target.value)}
                                    className="border p-2 rounded w-full text-lg"
                                />
                                <div className="mt-2">
                                    {availableTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleEditTag(tag)}
                                            className={`m-1 px-3 py-1 rounded text-sm flex items-center 
                                                ${editTaskTags.includes(tag) ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'}`}
                                        >
                                            {editTaskTags.includes(tag) && <span className="mr-1">✅</span>}
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={saveEditedTask} className="mt-2 bg-green-500 text-white p-2 rounded w-full text-lg">Save</button>
                            </div>
                        ) : (
                            <div className="w-full">
                                <strong className="text-lg">{task.text}</strong>
                    
                                {/* 🛠 Edit the label part of the task */}
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {task.tags.length > 0 ? (
                                        task.tags.map(tag => (
                                            <span key={tag} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center whitespace-nowrap mr-2">
                                            {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm">No labels</span>
                                    )}
                                </div>

                                {/* Put the buttons into another line */}
                                <div className="mt-2 flex space-x-2">
                                    <button onClick={() => startEditingTask(task)} className="text-gray-600 hover:text-yellow-500 text-xl">
                                    <FaPen />
                                </button>
                                <button onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-500 text-xl">
                                    <CgTrash />
                                </button>
                            </div>
                        </div>
                    )}
                </li>
            ))}
            </ul>

        </div>
    );
}

// Export to App.jsx
export default TodoList;