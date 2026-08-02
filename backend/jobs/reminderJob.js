const cron = require("node-cron");
const User = require("../models/User");
const Habit = require("../models/Habit");
const sendEmail = require("../config/email");
const emailTemplate = require("../utils/emailTemplate");

const startReminderScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      

      const now = new Date();

      const currentTime =
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        });

        const users = await User.find({
        reminder: true,
        reminderTime: currentTime,
      });

      if (process.env.NODE_ENV === "development") {
  console.log("⏰ Reminder Job Running:", currentTime);
}

      for (const user of users) {
        

        if (
          user.lastReminderSent &&
          user.lastReminderSent.toDateString() ===
            now.toDateString()
        ) {
          continue;
        }

        const habits = await Habit.find(
          { user: user._id } ,
          "name completed"
);

const completedHabits = habits.filter(
  (habit) => habit.completed
);

const remainingHabits = habits.filter(
  (habit) => !habit.completed
);

const completed = completedHabits.length;

const remaining = remainingHabits.length;

const completionRate =
habits.length === 0
? 0
: Math.round((completed / habits.length) * 100);

const remainingHabitList =
remainingHabits.length > 0
?
remainingHabits
.map(
(habit)=>`
<li style="
margin-bottom:10px;
font-size:16px;
">
☐ <strong>${habit.name}</strong>
</li>
`
)
.join("")
:
"<li>🎉 All habits completed!</li>";

const completedHabitList =
completedHabits.length > 0
?
completedHabits
.map(
(habit)=>`
<li style="
margin-bottom:10px;
font-size:16px;
color:#16A34A;
">
✅ <strong>${habit.name}</strong>
</li>
`
)
.join("")
:
"<li>No completed habits yet.</li>";

        if (remaining === 0) continue;

        await sendEmail({

    email: user.email,

    subject: "🔥 Don't Break Your Streak!",

    message: emailTemplate({

        title: "Daily Reminder",

        heading: "Keep Your Streak Alive 🔥",

message: `

<p>

Hello <strong>${user.name}</strong> 👋

</p>

<p>

You're making great progress, but your day isn't finished yet.

</p>

<div
style="
background:#F5F3FF;
border-left:5px solid #6D28D9;
padding:15px;
border-radius:10px;
margin:25px 0;
max-width:100%;
box-sizing:border-box;
overflow:hidden;
">

<h3
style="
margin:0 0 20px 0;
color:#6D28D9;
font-size:20px;
">

📊 Today's Progress

</h3>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:10px;
margin-bottom:25px;
text-align:center;
">

<tr>

<td
style="
width:33%;
padding:12px;
text-align:center;
word-break:break-word;
">

<div
style="
font-size:30px;
font-weight:bold;
color:#16A34A;
">

${completed}

</div>

<div
style="
font-size:14px;
color:#6B7280;
margin-top:6px;
">

Completed

</div>

</td>

<td
style="
width:33%;
padding:12px;
text-align:center;
word-break:break-word;
">

<div
style="
font-size:30px;
font-weight:bold;
color:#F59E0B;
">

${remaining}

</div>

<div
style="
font-size:14px;
color:#6B7280;
margin-top:6px;
">

Remaining

</div>

</td>

<td
style="
width:33%;
padding:12px;
text-align:center;
word-break:break-word;
">

<div
style="
font-size:30px;
font-weight:bold;
color:#6D28D9;
">

${completionRate}%

</div>

<div
style="
font-size:14px;
color:#6B7280;
margin-top:6px;
">

Progress

</div>

</td>

</tr>

</table>

<table
width="100%"
cellpadding="0"
cellspacing="0"
role="presentation"
style="border-collapse:collapse;"
>

<tr>

<td
style="
background:#ffffff;
border:1px solid #E5E7EB;
border-radius:10px;
padding:18px;
display:block;
margin-bottom:20px;
">

<h3
style="
margin:0;
color:#16A34A;
font-size:20px;
">
✅ Completed Habits
</h3>

<p
style="
margin:8px 0 15px;
font-size:13px;
color:#6B7280;
">
Great work! Keep it going.
</p>

<ul
style="
padding-left:20px;
margin:0;
line-height:1.8;
word-break:break-word;
">
${completedHabitList}
</ul>

</td>

</tr>

<tr>

<td
style="
background:#ffffff;
border:1px solid #E5E7EB;
border-radius:10px;
padding:18px;
display:block;
">

<h3
style="
margin:0;
color:#6D28D9;
font-size:20px;
">
📌 Remaining Habits
</h3>

<p
style="
margin:8px 0 15px;
font-size:13px;
color:#6B7280;
">
Complete these before midnight.
</p>

<ul
style="
padding-left:20px;
margin:0;
line-height:1.8;
word-break:break-word;
">
${remainingHabitList}
</ul>

</td>

</tr>

</table>

<p
style="
margin-top:25px;
font-size:15px;
">

Complete them before midnight to continue building your consistency.

</p>

</div>

<p>

💡 Remember

</p>

<blockquote
style="
border-left:4px solid #6D28D9;
padding-left:15px;
margin:20px 0;
color:#4B5563;
font-style:italic;
">

Success doesn't come from what you do occasionally.<br>

It comes from what you do consistently.

</blockquote>
`
        ,

        buttonText: "Complete Today's Habits",

        buttonLink: `${process.env.FRONTEND_URL}/dashboard`,

    }),

});

        user.lastReminderSent = now;
        await user.save();

        console.log(
          `📧 Reminder sent to ${user.email}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  });

  console.log("✅ Reminder Scheduler Started");
};

module.exports = startReminderScheduler;