import { useState } from "react";
import api from "../services/api";
import { Plus, ChevronDown } from "lucide-react";


function AddHabit({ onHabitAdded }) {


const [form,setForm] = useState({

    name:"",
    category:"good",
    trackingType:"boolean",
    targetValue:"",
    unit:""

});



const handleChange = (e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};




const handleSubmit = async(e)=>{

e.preventDefault();


if(!form.name.trim())
return;


try{


const response = await api.post(
"/habits",
{

name:form.name,


category:form.category,


trackingType:form.trackingType,


target:
form.trackingType==="target"
?
{
value:Number(form.targetValue),
unit:form.unit
}
:
{
value:0,
unit:""
}


}
);

console.log("Created Habit:", response.data);



onHabitAdded(response.data);



setForm({

name:"",
category:"good",
trackingType:"boolean",
targetValue:"",
unit:""

});


}
catch(error){

console.log(error);

}


};





return (

<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mt-8">


<h3 className="text-xl dark:text-white font-bold mb-5">
Add New Habit
</h3>



<form
onSubmit={handleSubmit}
className="grid  md:grid-cols-3 gap-6"
>



<div
>

<label className="font-semibold dark:text-white ">
Habit Name
</label>

<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Example: Drink 3L Water"
className="
w-full
rounded-xl
border
border-gray-300
px-4
py-3
focus:ring-2
focus:ring-purple-500
focus:outline-none
dark:text-gray-200
dark:border-gray-400
dark:bg-gray-700


"
/>

</div>





<div>


<label className=" font-semibold dark:text-white ">
Habit Category
</label>


<select

name="category"

value={form.category}

onChange={handleChange}

className="
w-full
rounded-xl
border
border-gray-300
px-4
py-3
focus:ring-2
focus:ring-purple-500
focus:outline-none
mt-1
dark:text-gray-300
dark:border-gray-400
dark:bg-gray-700
"

>


<option value="good">
Good Habit 
</option>


<option value="bad">
Bad Habit 
</option>


</select>


</div>






<div>


<label className="font-semibold dark:text-white ">
Tracking Type
</label>



<select

name="trackingType"

value={form.trackingType}

onChange={handleChange}

className="w-full
rounded-xl
border
border-gray-300
px-4
py-3
focus:ring-2
focus:ring-purple-500
focus:outline-none
mt-1
dark:text-gray-300
dark:border-gray-400
dark:bg-gray-700
"

>


<option value="boolean">
Yes / No
</option>


<option value="target">
Target Based
</option>


</select>


</div>







{
form.trackingType==="target" &&

<div className="md:col-span-2 grid md:grid-cols-2 gap-6">
<label className="font-semibold dark:text-white mt-5">
Target Value
</label>

<input

type="number"

name="targetValue"

value={form.targetValue}

onChange={handleChange}

placeholder="Target value"

className="
w-full
rounded-xl
border
border-gray-300
dark:border-gray-400
dark:text-gray-300
dark:bg-gray-700
px-4
py-3
focus:ring-2
focus:ring-purple-500
focus:outline-none
"

/>

<label className="font-semibold dark:text-white mt-5">
Measurement Unit
</label>

<input

name="unit"

value={form.unit}

onChange={handleChange}

placeholder="Unit (L, km, hrs)"

className="w-full
rounded-xl
border
border-gray-300
px-4
py-3
focus:ring-2
focus:ring-purple-500
focus:outline-none
dark:border-gray-400
dark:text-gray-300
mt-1
dark:bg-gray-700
"
/>


</div>

}






<div className="md:col-span-3 flex justify-end">

<button
type="submit"
className="
bg-gradient-to-r
from-purple-600
to-indigo-600
hover:from-purple-700
hover:to-indigo-700
text-white
font-semibold

px-8
py-3
rounded-xl
shadow-lg
transition
duration-300
"
>

Create Habit

</button>

</div>



</form>


</div>

);


}


export default AddHabit;