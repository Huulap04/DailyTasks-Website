document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await axios.post("https://dailytasks-website.onrender.com/auth/register", {
      username,
      email,
      password,
    });

    alert("Register successful");
    window.location.href = "login.html";
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Register failed");
  }
});