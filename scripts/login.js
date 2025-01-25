const urlLogin = 'https://script.google.com/macros/s/AKfycbwj1K6lkk5qU6BNPgIU1svQn8aqFQpZS8TvdxuigmkR37CunuZ-ataXIjPv0VnXs9M0/exec';

async function loginserver(url, IDS, pw) {
    try {
        const fullUrl = `${url}?action=login&IDS=${IDS}&pw=${pw}`;
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function loginaplikasi(event) {
    event.preventDefault(); // Prevent the default form submission

    const IDS = document.getElementById('IDS').value;
    const pw = document.getElementById('pw').value;

    const btnLogin = document.getElementById('btnLogin');
    const LoadingDownload = document.getElementById('loading'); // Corrected ID to match the HTML

    btnLogin.disabled = true;
    LoadingDownload.style.display = 'flex'; // Corrected display to flex

    try {
        const data = await loginserver(urlLogin, IDS, pw); // Use urlLogin instead of url
        if (data.success) {
            console.log("Login berhasil");
            console.log("Data Asatidz:", data.Asatidz);
        } else {
            console.log("Login gagal");
            console.log("Error:", data.errors);
            // Show the error message to the user
            //alert(data.errors);
            appendAlert(data.errors, 'danger');
            //exit the function
            LoadingDownload.style.display = 'none';
            btnLogin.disabled = false;
            return;
        }

        console.log("Data received for saving:", data);
        await saveDataToIndexedDB("Asatidz", data, "IDS");
        localStorage.setItem('IDS', IDS);
        window.location.href = 'index.html';
        LoadingDownload.style.display = 'none';
        btnLogin.disabled = false;
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        LoadingDownload.style.display = 'none';
        btnLogin.disabled = false;
    }
}


  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }



const alertTrigger = document.getElementById('liveAlertBtn')
if (alertTrigger) {
  alertTrigger.addEventListener('click', () => {
    appendAlert('Nice, you triggered this alert message!', 'success')
  })
}