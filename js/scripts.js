document.addEventListener('DOMContentLoaded', function() {
    var workLink = document.getElementById('work-link');
    var subNav = document.getElementById('sub-nav');
    var nav = document.querySelector('nav');
    var main = document.querySelector('main');

    workLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (subNav.style.display === 'block') {
            subNav.style.display = 'none';
            nav.style.width = '200px';
            main.style.marginLeft = '220px'; // Adjust for nav width
        } else {
            subNav.style.display = 'block';
            nav.style.width = '300px'; // Adjust width to accommodate sub-nav
            main.style.marginLeft = '320px'; // Adjust for expanded nav width
        }
    });

    // Add event listeners for project links
    var projectLinks = document.querySelectorAll('.sub-nav a');
    projectLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var projectId = this.getAttribute('href').substring(1);
            loadContent('projects/' + projectId + '.html');
        });
    });

    // Add event listeners for main nav links
    var mainNavLinks = document.querySelectorAll('nav > ul > li > a');
    mainNavLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var sectionId = this.getAttribute('href').substring(1);
            if (sectionId === 'home') {
                loadHomeContent();
            } else {
                loadContent('sections/' + sectionId + '.html');
            }
        });
    });

    function loadContent(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                main.innerHTML = data;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                main.innerHTML = `<h2>Error</h2><p>There was an error loading the content: ${error.message}. Please try again later.</p>`;
            });
    }

    function loadHomeContent() {
        main.innerHTML = `
            <section id="home">
                <h2>welcome to my portfolio</h2>
                <p>this is the home section of my portfolio. here you can find information about my work, background, and how to contact me.</p>
            </section>
        `;
    }
});
