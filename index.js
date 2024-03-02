emailjs.init({
  publicKey: "F5Jdb-gpz4oSnhLqi",
});

const container = document.getElementById("container");

if (container) {
  container.style.height = window.innerHeight - 20 + "px";
}

const form = document.getElementById("form");

const nameEle = document.getElementById("name");

const email = document.getElementById("email");

const submit = document.getElementById("submit");

const loader = document.getElementById("loader");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validateInputs();
});

const validateInputs = () => {
  const nameValue = nameEle?.value?.trim() || "";
  const emailValue = email?.value?.trim() || "";
  let valid = true;

  if (!nameValue) {
    setError(nameEle, "Name is required!");
    valid = false;
  } else {
    setSuccess(nameEle);
  }

  if (!emailValue) {
    setError(email, "Email is required!");
    valid = false;
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Enter a valid email!");
    valid = false;
  } else {
    setSuccess(email);
  }

  if (valid) {
    const templateParams = {
      to_name: nameValue,
      message: "",
      user_email: emailValue,
    };

    fetchQuoteAndMail(templateParams);
  }
};

async function fetchQuoteAndMail(templateParams) {
  if (loader) loader.style.display = "block";
  const url = "https://api.quotable.io/random";
  const options = {
    method: "GET",
  };

  try {
    const quoteResponse = await fetch(url, options);
    const quoteResult = await quoteResponse.json();
    templateParams.message = quoteResult.content;
    const emailResponse = await emailjs.send(
      "service_19mf5oh",
      "template_fzex82c",
      templateParams
    );
    if (loader) loader.style.display = "none";
  } catch (error) {
    console.error(error);
    if (loader) loader.style.display = "none";
  }
}

const setError = (ele, msg) => {
  const inputControl = ele?.parentElement;
  const errorEle = inputControl?.querySelector(".error");
  if (errorEle) errorEle.innerText = msg;
  inputControl?.classList.add("error");
  inputControl?.classList.remove("success");
};

const setSuccess = (ele) => {
  const inputControl = ele?.parentElement;
  const errorEle = inputControl?.querySelector(".error");
  if (errorEle) errorEle.innerText = "";
  inputControl?.classList.add("success");
  inputControl?.classList.remove("error");
};

const isValidEmail = (email) => {
  const reg =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
  return reg.test(email);
};
