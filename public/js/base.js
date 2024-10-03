const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro'];

let currentDate = new Date();
let appointments = {
    "3 Outubro 2024": [
        { time: "09:00", name: "João Valente", service: "Dry needling e ventosa terapia" },
        { time: "13:00", name: "Maria Silva", service: "Consulta de rotina" }
    ]
};

function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const monthYearElement = document.getElementById('month-year');
    const weekdaysElement = document.getElementById('weekdays');
    const calendarDaysElement = document.getElementById('calendar-days');

    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    weekdaysElement.innerHTML = weekdays.map(day => `<div>${day}</div>`).join('');

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarDaysElement.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
        calendarDaysElement.innerHTML += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.classList.add('day');

        const fullDate = `${day} ${monthNames[month]} ${year}`;

        if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayElement.classList.add('today');
        }

        dayElement.addEventListener('click', () => {
            document.getElementById('options-popup').classList.remove('hidden');
            document.getElementById('appointment-date').value = fullDate;

            // "Ver Agendamentos" action
            document.getElementById('view-appointments-button').onclick = () => {
                document.getElementById('appointments-list').innerHTML = '';
                const dailyAppointments = appointments[fullDate] || [];
                if (dailyAppointments.length === 0) {
                    document.getElementById('appointments-list').innerHTML = '<p>Nenhum agendamento para este dia.</p>';
                } else {
                    dailyAppointments.forEach(appointment => {
                        const appointmentElement = document.createElement('div');
                        appointmentElement.innerHTML = `
                                <p><strong>Horário:</strong> ${appointment.time}</p>
                                <p><strong>Nome:</strong> ${appointment.name}</p>
                                <p><strong>Serviço:</strong> ${appointment.service}</p>
                                <hr>
                            `;
                        document.getElementById('appointments-list').appendChild(appointmentElement);
                    });
                }
                document.getElementById('view-appointments-popup').classList.remove('hidden');
                document.getElementById('options-popup').classList.add('hidden');
            };

            // "Novo Agendamento" action
            document.getElementById('new-appointment-button').onclick = () => {
                document.getElementById('appointment-popup').classList.remove('hidden');
                document.getElementById('options-popup').classList.add('hidden');
            };
        });

        calendarDaysElement.appendChild(dayElement);
    }
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.querySelectorAll('.close-popup').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeBtn.closest('.popup').classList.add('hidden');
    });
});

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('popup')) {
        event.target.classList.add('hidden');
    }
});

renderCalendar();