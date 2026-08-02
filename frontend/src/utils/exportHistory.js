import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import autoTable from "jspdf-autotable";
import api from "../services/api";


// PDF Export


export const exportPDF = async (history, user) => {

  const pdf = new jsPDF();
  const drawCard = (
  pdf,
  x,
  y,
  w,
  h,
  title,
  value,
  color
) => {

  pdf.setFillColor(...color);

  pdf.roundedRect(
    x,
    y,
    w,
    h,
    4,
    4,
    "F"
  );

  pdf.setTextColor(255);

pdf.setFontSize(10);
pdf.setTextColor(255);
pdf.text(title,x+4,y+9);

pdf.setFontSize(22);
pdf.setFont(undefined,"bold");
pdf.text(String(value),x+4,y+22);

pdf.setFont(undefined,"normal");

};

// HEADER
// ============================

pdf.setFillColor(98,0,238);

pdf.roundedRect(
5,
5,
200,
22,
4,
4,
"F"
);

pdf.setTextColor(255);

pdf.setFontSize(24);

pdf.text(
"HabitMetric Analytics Report",
15,
20
);

// ============================
// PROFILE CARD
// ============================

pdf.setFillColor(245,245,245);

pdf.roundedRect(
10,
32,
190,
30,
4,
4,
"F"
);

pdf.setTextColor(40);

pdf.setFontSize(12);

pdf.text(
`Name : ${user?.name || "User"}`,
50,
42
);

pdf.text(
`Email : ${user?.email || "-"}`,
50,
49
);

pdf.text(
`Date : ${history.date}`,
130,
42
);

pdf.text(
`Generated : ${new Date().toLocaleString()}`,
130,
49
);
  

  // Profile Image
  if (user?.profileImage) {

   const imageUrl = `${import.meta.env.VITE_BACKEND_URL}${user.profileImage}`;

    const image = await fetch(imageUrl);
    const blob = await image.blob();

    const reader = new FileReader();

    const imageData = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    pdf.addImage(
      imageData,
      "JPEG",
      15,
      35,
      25,
      25
    );

  }

  // ============================

 
  const totalScore = history.habits.reduce(
  (score, habit) => {

    if(habit.category === "good"){
      return score + (habit.completed ? 10 : 0);
    }
    else{
      return score + (habit.completed ? -10 : 10);
    }

  },
  0
);


  // Summary
  drawCard(pdf,10,70,38,28,"Total",history.total,[98,0,238]);

drawCard(pdf,50,70,38,28,"Completed",history.completed,[34,197,94]);

drawCard(pdf,90,70,38,28,"Pending",history.pending,[239,68,68]);

drawCard(pdf,130,70,38,28,"Rate",`${history.completionRate}%`,[59,130,246]);

drawCard(pdf,170,70,30,28,"Score",totalScore,[255,165,0]);

pdf.setFontSize(16);

pdf.setTextColor(60);

pdf.text("Executive Summary",10,115);

pdf.setFontSize(11);

pdf.setTextColor(100);

pdf.text(
`You completed ${history.completed} out of ${history.total} habits today with a completion rate of ${history.completionRate}%.`,
10,
123
);  

autoTable(pdf, {
    startY: 128,
    margin: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10 },

      pageBreak:"auto",
  rowPageBreak:"avoid",

    head: [[
      "Habit",
      "Category",
      "Type",
      "Status",
      "Progress",
      "Score"
      
    ]],

    body: history.habits.map(habit => [
      habit.name,
      habit.category,
      habit.trackingType,
      habit.completed ? "Completed" : "Pending",
      habit.trackingType === "target"
        ? `${habit.progress}/${habit.target.value} ${habit.target.unit}`
        : "-",
    habit.category === "good"
        ? habit.completed
        ? "+10"
        : "0"
        : habit.completed
        ? "-10"
        : "+10"
        ]),

    styles:{
fontSize:8,
cellPadding:2,
valign:"middle",
lineColor:[220,220,220],
lineWidth:0.1
},

alternateRowStyles:{
fillColor:[250,250,250]
},

headStyles:{
fillColor:[98,0,238],
textColor:255,
fontStyle:"bold",
fontSize:11
}

  });

  

  // ============================
// Weekly + Pie Chart
// ============================
// Get the Y position where the table ended
const finalY = pdf.lastAutoTable.finalY || 130;

let graphY = finalY + 10;

const weeklyChart = document.getElementById("weekly-chart");
const pieChart = document.getElementById("pie-chart");

const wasDark = document.documentElement.classList.contains("dark");

if (wasDark) {
  document.documentElement.classList.remove("dark");

  // Wait for React and the browser to repaint
  await new Promise(resolve => setTimeout(resolve, 300));
}

if(
weeklyChart &&
pieChart
){

const weeklyCanvas = await html2canvas(weeklyChart, {
  scale: 2,
  backgroundColor: "#ffffff",
  useCORS: true
});

const pieCanvas = await html2canvas(pieChart, {
  scale: 2,
  backgroundColor: "#ffffff",
  useCORS: true
});

const weeklyImage =
weeklyCanvas.toDataURL("image/png");

const pieImage =
pieCanvas.toDataURL("image/png");

//const finalY = pdf.lastAutoTable.finalY || 130;

// If there is not enough space,
// create a new page.



if (graphY + 85 > 285) {
    pdf.addPage();
    graphY = 15;
}

pdf.setFillColor(245,247,250);

pdf.roundedRect(
8,
graphY,
94,
82,
5,
5,
"F"
);

pdf.roundedRect(
108,
graphY,
94,
82,
5,
5,
"F"
);
pdf.setFontSize(16);

pdf.setTextColor(80);

pdf.text(
"Weekly Completion",
18,
graphY + 8
);

pdf.text(
"Habit Status",
122,
graphY + 8
);

// Weekly Bar Chart
pdf.addImage(
  weeklyImage,
  "PNG",
  12,
  graphY + 12,
  86,
  62
);

pdf.addImage(
  pieImage,
  "PNG",
  112,
  graphY + 12,
  80,
  62
);

if (wasDark) {
  document.documentElement.classList.add("dark");

  await new Promise(resolve => setTimeout(resolve, 100));
}

}







// Position Insights below the charts

let insightY = graphY + 95;

// If there isn't enough space, create a new page

if (insightY > 240) {
    pdf.addPage();
    insightY = 20;
}

pdf.setFontSize(22);
pdf.setTextColor(98,0,238);
pdf.text("Insights",20,insightY);

insightY += 12;

pdf.setFontSize(12);
pdf.setTextColor(80);

pdf.text(
`• Completion Rate : ${history.completionRate}%`,
20,
insightY
);

insightY += 10;

pdf.text(
`• Total Score : ${history.score}`,
20,
insightY
);

insightY += 10;

pdf.text(
`• Total Habits : ${history.total}`,
20,
insightY
);

insightY += 10;

pdf.text(
`• Completed : ${history.completed}`,
20,
insightY
);

insightY += 10;

pdf.text(
`• Pending : ${history.pending}`,
20,
insightY
);

insightY += 15;

pdf.setFont(undefined,"bold");

pdf.text(
history.completionRate >= 80
    ? "Excellent consistency!"
    : history.completionRate >= 60
    ? "Good progress!"
    : "Keep improving every day!",
20,
insightY
);

pdf.setFont(undefined,"normal");
        

// Footer

pdf.setDrawColor(220);

const pageHeight = pdf.internal.pageSize.getHeight();

pdf.line(10,pageHeight-12,200,pageHeight-12);

pdf.setFontSize(9);

pdf.text(
"Generated by HabitMetric Analytics Engine",
10,
pageHeight-6
);

pdf.text(
`Date : ${new Date().toLocaleDateString()}`,
150,
pageHeight-6
);
  

  pdf.save(`Habit-History-${history.date}.pdf`);
};

















// Excel Export

export const exportExcel = async (history) => {

    const workbook = new ExcelJS.Workbook();


    // =========================
    // Sheet 1: Summary
    // =========================

    const summarySheet =
        workbook.addWorksheet("Summary");

    summarySheet.mergeCells("A1:B1");

const title = summarySheet.getCell("A1");

title.value = "HabitMetric Analytics Report";

title.font = {
    size:18,
    bold:true,
    color:{argb:"FFFFFFFF"}
};

title.alignment = {
    horizontal:"center"
};

title.fill = {
    type:"pattern",
    pattern:"solid",
    fgColor:{argb:"6200EE"}
};


    summarySheet.addRows([

        ["HabitMetric Report"],

        [],

        ["Date", history.date],

        ["Total Habits", history.total],

        ["Completed", history.completed],

        ["Pending", history.pending],

        [
            "Completion Rate",
            `${history.completionRate}%`
        ],

        [
            "Habit Score",
            history.score
        ]

    ]);

    for(let i=3;i<=8;i++){

    summarySheet.getCell(`A${i}`).font={
        bold:true
    };

}



    summarySheet.columns = [

        {
            width:25
        },

        {
            width:20
        }

    ];



    // =========================
    // Sheet 2: Habit Details
    // =========================


    const habitSheet =
        workbook.addWorksheet("Habit Details");


    habitSheet.addRow([

    "Habit",
    "Category",
    "Type",
    "Status",
    "Progress",
    "Score"

    ]);



    history.habits.forEach((habit)=>{


        habitSheet.addRow([

        habit.name,
        habit.category,
        habit.trackingType,
        habit.completed
        ? "Completed"
        : "Pending",

        habit.trackingType==="target"
        ?
        `${habit.progress}/${habit.target.value} ${habit.target.unit}`
        :
        "-",

        habit.category==="good"
        ?
        habit.completed
        ? "+10"
        : "0"
        :
        habit.completed
        ? "-10"
        : "+10"

        ]);

        habitSheet.getRow(1).font={
    bold:true,
    color:{argb:"FFFFFFFF"}
};

habitSheet.getRow(1).fill={

type:"pattern",

pattern:"solid",

fgColor:{
argb:"6200EE"
}

};


    });



    habitSheet.columns=[

{width:30},
{width:15},
{width:15},
{width:15},
{width:20},
{width:12}

];





    // =========================
    // Sheet 3: Weekly Analytics
    // =========================


    const weeklySheet =
        workbook.addWorksheet("Analytics");


    weeklySheet.addRow([

        "Day",

        "Completed"

    ]);

    weeklySheet.getRow(1).font={
    bold:true,
    color:{argb:"FFFFFFFF"}
};

weeklySheet.getRow(1).fill={

type:"pattern",

pattern:"solid",

fgColor:{
argb:"6200EE"
}

};



    const token = localStorage.getItem("token");
    

    console.log("Token:", token);

const weeklyResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/habits/weekly`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


    const weeklyData = await weeklyResponse.json();

console.log("Status:", weeklyResponse.status);
console.log("Response:", weeklyData);

    if (!Array.isArray(weeklyData)) {
    console.log("Weekly API Error:", weeklyData);
    return;
}

    weeklyData.forEach((item)=>{


        weeklySheet.addRow([

            item.day,

            item.completed

        ]);


    });

    weeklySheet.columns = [
    { width:18 },
    { width:18 },
    { width:5 },
    { width:25 },
    { width:25 },
    { width:25 },
    { width:25 }
];



    const insightSheet =
workbook.addWorksheet("Insights");

insightSheet.addRows([

["Metric","Value"],

["Total Habits",history.total],

["Completed",history.completed],

["Pending",history.pending],

["Completion Rate",`${history.completionRate}%`],

["Habit Score",history.score],

["Performance",

history.completionRate>=80
?
"Excellent"

:
history.completionRate>=60
?
"Good"

:
"Needs Improvement"

]

]);

insightSheet.getRow(1).font={
bold:true,
color:{argb:"FFFFFFFF"}
};

insightSheet.getRow(1).fill={

type:"pattern",

pattern:"solid",

fgColor:{
argb:"6200EE"
}

};



    // Download file


    const buffer =
        await workbook.xlsx.writeBuffer();



    const blob =
        new Blob(
            [buffer],
            {
                type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );



    const url =
        window.URL.createObjectURL(blob);



    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        `Habit-History-${history.date}.xlsx`;


    link.click();


    window.URL.revokeObjectURL(url);


};