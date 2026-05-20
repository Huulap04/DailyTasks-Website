document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await axios.post("http://localhost:5000/auth/register", {
      username,
      email,
      password
    });

    alert("Register success");
    window.location.href = "login.html";
  } catch (err) {
    console.log(err.reponse?.data ||  err.message);
    alert(err.reponse?.data?.message || " Register failed")
  }
});