const navsForm = document.getElementById('header-search');
const navsList = document.getElementById('header-nav');


const controlNav = (e) => {
  e.preventDefault();
  
  if(navsForm.style.display == 'none') {
    navsForm.style.display = 'block';
    navsList.style.display = 'block';
  } else {
    navsForm.style.display = 'none';
    navsList.style.display = 'none';
  }
};

window.onload = controlNav;

document.getElementById('menu').addEventListener('click', controlNav);