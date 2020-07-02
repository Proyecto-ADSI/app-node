$(document).ready(function(){

    var CalendarId = document.getElementById('Calendar');
    var Calendar = new FullCalendar.Calendar(CalendarId, {  
      initialView: 'dayGridMonth',
      themeSystem: 'standart',
    //   plugins: [ 'dayGrid' ],
      locale:'es',
      weekNumbers: true,
      navLinks: true,

    //   dayMaxEventRows: true, // for all non-TimeGrid views
    // eventLimit: true,
    dayMaxEvents: 1,

    headerToolbar: {
        left: 'prevYear,prev,next,nextYear today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      
      events:[
          {
              title:"Primer evento",
              start:"2020-08-03"
          },
          {
            title:"Segun evento",
            start:"2020-08-03"
        },
        {
            title:"Tercer evento",
            start:"2020-08-03"
        },
        {
            title:"Cuarto evento",
            start:"2020-08-03"
        },
        
        
      ]
    });
    Calendar.render();

    Calendar.on('dateClick', function(){
        alert('a day has been clicked!');
    })

})