const nodemailer = require('nodemailer');
const prompt = require('prompt-sync')();
const cron = require('node-cron');
const tasks = [];
let task;

// Create a Nodemailer transporter
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

// Ask the user for tasks until they press "x" to exit
do {
    task = prompt("Write a task or press x to exit: ");
    if (task !== "x") {
        const deadline = prompt("When is it due? (format: YYYY-MM-DD HH:MM): ");
        tasks.push({ task, deadline });
    }
} while (task !== "x");

// Function to filter tasks due today and send a daily reminder email
function sendDailyReminder() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Filter tasks due today
    const tasksDueToday = tasks.filter(item => item.deadline.startsWith(today));
    
    if (tasksDueToday.length > 0) {
        let emailBody = 'Here are your tasks due today:\n';
        tasksDueToday.forEach(item => {
            emailBody += `Task: ${item.task}, Deadline: ${item.deadline}\n`;
        });

        // Send the daily reminder email
        transporter.sendMail({
            from: 'gdgmountholyoke@gmail.com',
            to: email,
            subject: 'Daily Task Reminder',
            text: emailBody,
        }, (error, info) => {
            if (error) {
                return console.log('Error sending the daily reminder email: ', error);
            }
            console.log('Daily reminder email sent: ' + info.response);
        });
    } else {
        console.log('No tasks due today.');
    }
}

// Schedule the daily reminder at 7 am every day
cron.schedule('0 7 * * *', sendDailyReminder);

console.log('Daily task reminder scheduled for 7 am.');
