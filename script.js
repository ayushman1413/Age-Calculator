document.addEventListener('DOMContentLoaded', function() {
    // Default age set karne ke liye (18 saal pehle ka)
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    
    // Date ko YYYY-MM-DD format me convert karke input field me daalna
    const formattedDate = defaultDate.toISOString().split('T')[0];
    document.getElementById('birthdate').value = formattedDate;
    
    // Important elements ko select karna
    const calculateBtn = document.getElementById('calculate');
    const birthdateInput = document.getElementById('birthdate');
    const resultDiv = document.getElementById('result');
    const yearsEl = document.getElementById('years');
    const monthsEl = document.getElementById('months');
    const daysEl = document.getElementById('days');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const dateError = document.getElementById('date-error');
    
    // Page load hote hi age calculate karo
    calculateAge();
    
    // Calculate button click pe age calculate function run hoga
    calculateBtn.addEventListener('click', calculateAge);
    
    // Age calculate karne ka function
    function calculateAge() {
        // Input se birthdate lo aur aaj ki date lo
        const birthdate = new Date(birthdateInput.value);
        const today = new Date();
        
        // Agar date invalid hai ya future ki date hai, error show karo
        if (isNaN(birthdate.getTime()) || birthdate > today) {
            dateError.style.display = 'block';
            resultDiv.style.display = 'none';
            return;
        }
        
        // Error ko hide kar do
        dateError.style.display = 'none';
        
        // Years, months, days calculate karo
        let years = today.getFullYear() - birthdate.getFullYear();
        let months = today.getMonth() - birthdate.getMonth();
        let days = today.getDate() - birthdate.getDate();
        
        // Days negative hue toh pichle mahine ke days add karo
        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        // Months negative hue toh years ko adjust karo
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Current year ke birthday aur next birthday calculate karo
        const birthdayThisYear = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
        const nextBirthday = birthdayThisYear <= today ? 
            new Date(today.getFullYear() + 1, birthdate.getMonth(), birthdate.getDate()) : 
            birthdayThisYear;
        
        // Last birthday calculate karo (aaj ke din ke basis pe)
        const lastBirthday = birthdayThisYear <= today ? 
            birthdayThisYear : 
            new Date(today.getFullYear() - 1, birthdate.getMonth(), birthdate.getDate());
        
        // Year progress calculate karo (kitna year guzar chuka)
        const yearProgress = ((today - lastBirthday) / (nextBirthday - lastBirthday)) * 100;
        const roundedProgress = Math.round(yearProgress);
        
        // Animation ke sath years, months, days update karega ye 
        animateNumber(yearsEl, years);
        animateNumber(monthsEl, months);
        animateNumber(daysEl, days);
        
        // Progress bar ko update karega
        progressPercentage.textContent = `${roundedProgress}%`;
        progressFill.style.width = `${roundedProgress}%`;
        
        // Result section ko dikhana aur animation apply karne ke lliye
        resultDiv.style.display = 'block';
        resultDiv.style.animation = 'none';
        void resultDiv.offsetWidth; // Animation reset hoga
        resultDiv.style.animation = 'fadeIn 0.5s ease forwards';
    }
    
    // Number ko smooth animation ke sath update karne ka function
    function animateNumber(element, target) {
        const duration = 1000; // Animation duration 1 second
        const frameDuration = 1000 / 60; // 60 FPS animation
        const totalFrames = Math.round(duration / frameDuration);
        
        let frame = 0;
        const currentValue = parseInt(element.textContent);
        const increment = (target - currentValue) / totalFrames;
        
        // Animation function
        const animate = () => {
            frame++;
            const newValue = Math.floor(currentValue + (increment * frame));
            element.textContent = newValue;
            
            // Animation complete hone tak repeat karega
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target; // Final value set karega
            }
        };
        
        animate();
    }
});
