(function() {
  let form: HTMLFormElement = document.querySelector('[data-js="form"]');
  let usernameInput: HTMLInputElement = document.querySelector('[data-js="input-username"]');
  let emailInput: HTMLInputElement = document.querySelector('[data-js="input-email"]');
  let passwordInput: HTMLInputElement = document.querySelector('[data-js="input-password"]');
  let passwordConfirmationInput: HTMLInputElement = document.querySelector('[data-js="input-password_confirmation"]');
  let roleSelect: HTMLSelectElement = document.querySelector('[data-js="input-role"]');

  form &&
    form.addEventListener('submit', async (e: Event) => {
      e.preventDefault();

      let hasEmptyField = [usernameInput, emailInput, passwordInput, passwordConfirmationInput].some(element => {
        return element.value === undefined || element.value === null || element.value === '';
      });

      if (hasEmptyField) {
        alert('Empty Field(s) are not allowed!');

        return;
      }

      if (passwordInput.value !== passwordConfirmationInput.value) {
        alert('Passwords dont match!');

        return;
      }

      let payload = {
        username: usernameInput.value,
        password: passwordInput.value,
        email: emailInput.value,
        role: roleSelect.value
      };

      console.log(payload);

      let response = await fetch('http://localhost:3005/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let json = await response.json();
      let { success, messages } = json;

      if (!success) {
        messages.forEach(element => {
          console.log(element.msg);
        });

        return;
      }

      window.location.replace(`http://localhost:3005${json.redirect}`);
    });
})();
