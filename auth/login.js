document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password
    });

    localStorage.setItem("token", res.data.token);

    window.location.href = "./HomePage.html";
  } catch (err) {
    console.log(err.response?.data ||  err.message);
    alert(err.response?.data?.message || " Login failed")
  }
});