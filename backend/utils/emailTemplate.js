const emailTemplate = ({
  title,
  heading,
  message,
  buttonText,
  buttonLink,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>

body{
    margin:0;
    padding:0;
    background:#f4f6fb;
    font-family:Arial,Helvetica,sans-serif;
}

.wrapper{
    width:100%;
    padding:40px 0;
}

.card{

    max-width:650px;
    margin:auto;
    background:#ffffff;
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 8px 30px rgba(0,0,0,.08);

}

.header{
    background:linear-gradient(135deg,#6D28D9,#7C3AED);
    padding:45px 30px;
    text-align:center;
}

.logo{
    width:100%;
    max-width:220px;
    height:auto;
    display:block;
    margin:0 auto 18px;
}

.tagline{

    color:white;
    opacity:.9;
    letter-spacing:2px;
    font-size:13px;

}

.content{

    padding:40px;

}

.title{

    font-size:28px;
    color:#111827;
    font-weight:bold;
    margin-bottom:20px;

}

.text{

    font-size:16px;
    line-height:1.8;
    color:#4B5563;

}

.button{

    display:inline-block;
    margin-top:35px;
    background:#6D28D9;
    color:white !important;
    text-decoration:none;
    padding:14px 32px;
    border-radius:10px;
    font-weight:bold;

}

.link{

    margin-top:30px;
    font-size:13px;
    color:#6B7280;
    word-break:break-all;

}

.footer{

    background:#F9FAFB;
    padding:25px;
    text-align:center;
    color:#6B7280;
    font-size:13px;

}

.footer strong{

    color:#6D28D9;

}

</style>

</head>

<body>

<div class="wrapper">

<div class="card">

<div class="header">

<img
class="logo"
src="https://res.cloudinary.com/swmv9f9z/image/upload/v1785669568/Untitled-1_duvz2o.png"
alt="HabitMetric"
/>

<div class="tagline">

TRACK • IMPROVE • REPEAT

</div>

</div>

<div class="content ">

<div class="title">

${heading}

</div>

<div class="text">

${message}

</div>

<a
class="button"
href="${buttonLink}">

${buttonText}

</a>

<div class="link">

If the button doesn't work, copy this link:<br><br>

${buttonLink}

</div>

</div>

<div class="footer">

<strong>HabitMetric</strong><br>

Track your habits. Build consistency. Become better every day.<br><br>

© 2026 HabitMetric

</div>

</div>

</div>

</body>

</html>

`;
};

module.exports = emailTemplate;