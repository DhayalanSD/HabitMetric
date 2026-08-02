function StreakCard({streak}) {


return (

<div className="
bg-white
rounded-2xl
shadow-md
p-6
">

<h2 className="text-xl font-bold">
🔥 Habit Streak
</h2>


<div className="mt-5">

<p>
Current Streak:
<span className="font-bold text-purple-600">
 {streak.currentStreak} days
</span>
</p>


<p>
Best Streak:
<span className="font-bold text-green-600">
 {streak.bestStreak} days
</span>
</p>


<p>
Completed Days:
<span className="font-bold">
 {streak.totalCompletedDays}
</span>
</p>


</div>


</div>

);

}


export default StreakCard;