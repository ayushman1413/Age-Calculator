document.addEventListener('DOMContentLoaded', function() {
//    default age ke liye 
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    
    const formattedDate = defaultDate.toISOString().split('T')[0];
    document.getElementById('birthdate').value = formattedDate;
    
    const calculateBtn = document.getElementById('calculate');
    const birthdateInput = document.getElementById('birthdate');
    const resultDiv = document.getElementById('result');
    const yearsEl = document.getElementById('years');
    const monthsEl = document.getElementById('months');
    const daysEl = document.getElementById('days');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const dateError = document.getElementById('date-error');
    
    calculateAge();
    
    calculateBtn.addEventListener('click', calculateAge);
    
    function calculateAge() {
        const birthdate = new Date(birthdateInput.value);
        const today = new Date();
        
        if (isNaN(birthdate.getTime()) || birthdate > today) {
            dateError.style.display = 'block';
            resultDiv.style.display = 'none';
            return;
        }
        
        dateError.style.display = 'none';
        
        let years = today.getFullYear() - birthdate.getFullYear();
        let months = today.getMonth() - birthdate.getMonth();
        let days = today.getDate() - birthdate.getDate();
        
        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        const birthdayThisYear = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
        const nextBirthday = birthdayThisYear <= today ? 
            new Date(today.getFullYear() + 1, birthdate.getMonth(), birthdate.getDate()) : 
            birthdayThisYear;
        const lastBirthday = birthdayThisYear <= today ? 
            birthdayThisYear : 
            new Date(today.getFullYear() - 1, birthdate.getMonth(), birthdate.getDate());
        
        const yearProgress = ((today - lastBirthday) / (nextBirthday - lastBirthday)) * 100;
        const roundedProgress = Math.round(yearProgress);
        
        animateNumber(yearsEl, years);
        animateNumber(monthsEl, months);
        animateNumber(daysEl, days);
        
        progressPercentage.textContent = `${roundedProgress}%`;
        progressFill.style.width = `${roundedProgress}%`;
        
        resultDiv.style.display = 'block';
        
        resultDiv.style.animation = 'none';
        void resultDiv.offsetWidth; // Trigger reflow
        resultDiv.style.animation = 'fadeIn 0.5s ease forwards';
    }
    
    function animateNumber(element, target) {
        const duration = 1000; 
        const frameDuration = 1000 / 60; 
        const totalFrames = Math.round(duration / frameDuration);
        
        let frame = 0;
        const currentValue = parseInt(element.textContent);
        const increment = (target - currentValue) / totalFrames;
        
        const animate = () => {
            frame++;
            const newValue = Math.floor(currentValue + (increment * frame));
            element.textContent = newValue;
            
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };
        
        animate();
    }
});