const nodemailer = require('nodemailer');
const prompt = require('prompt-sync')();
const tasks = [];
let task;

// Create a Nodemailer transporter

require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gdgmountholyoke@gmail.com',
        pass: 'wyhv pwxu rlhh dvbc',
    },
});

// Get the answer from the user
const email = prompt('What is your email? ');

// Check if the email is valid
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Print valid email address if it's written correctly, invalid otherwise
if (isValidEmail(email)) {
    console.log('Valid email address.');
} else {
    console.log('Invalid email address.');
}

// Ask the user for tasks until they press enter
do {
    task = prompt("Write a task or press x to exit: ");
    if (task !== "x") {
        const deadline = prompt("When is it due? (format: YYYY-MM-DD HH:MM): ");
        tasks.push({task, deadline});
    }
} while (task !== "x");


if (tasks.length > 0) {
    let emailBody = 'Here are your tasks:\n';
    tasks.forEach(item => {
        emailBody += `Task: ${item.task}, Deadline: ${item.deadline}\n`;
    });

    // Send the email
    transporter.sendMail({
        from: 'gdgmountholyoke@gmail.com',
        to: email,
        subject: 'Task Reminder',
        text: emailBody,
    }, (error, info) => {
        if (error) {
            return console.log('Error sending the email: ', error);
        }
        console.log('Email sent: ' + info.response);
    });
} else {
    console.log('No tasks entered.');
}

