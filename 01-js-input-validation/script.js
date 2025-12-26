const validators = {
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    phone: (val) => /^\d{10}$/.test(val),
    password: (val) => val.length >= 8 && /[A-Z]/.test(val) && /\d/.test(val),
    url: (val) => /^https?:\/\/.+/.test(val)
};

const inputs = document.querySelectorAll('.input-field');

inputs.forEach(input => {
    const id = input.id;
    input.addEventListener('input', () => validate(id));
    input.addEventListener('blur', () => validate(id));
});

function validate(id) {
    const input = document.getElementById(id);
    const icon = document.getElementById(id + 'Icon');
    const feedback = document.getElementById(id + 'Feedback');
    const isValid = validators[id](input.value);
    
    input.classList.toggle('valid', isValid && input.value);
    input.classList.toggle('invalid', !isValid && input.value);
    
    if (input.value) {
        icon.classList.add('show');
        icon.textContent = isValid ? '✓' : '✗';
        icon.style.color = isValid ? '#4caf50' : '#f44336';
        
        feedback.classList.add('show');
        feedback.textContent = isValid ? 'Looks good!' : 'Invalid format';
        feedback.classList.toggle('valid', isValid);
        feedback.classList.toggle('invalid', !isValid);
    } else {
        icon.classList.remove('show');
        feedback.classList.remove('show');
    }
    
    if (id === 'password') {
        const strength = input.value.length / 12;
        document.getElementById('strengthFill').style.width = (strength * 100) + '%';
    }
}

document.getElementById('submitBtn').addEventListener('click', () => {
    Object.keys(validators).forEach(id => validate(id));
});

document.getElementById('resetLink').addEventListener('click', () => {
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('valid', 'invalid');
    });
    document.querySelectorAll('.feedback-icon').forEach(icon => {
        icon.classList.remove('show');
    });
    document.querySelectorAll('.feedback').forEach(fb => {
        fb.classList.remove('show');
    });
});
