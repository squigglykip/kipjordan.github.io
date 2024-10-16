(function() {
    'use strict';

    // Main functions will go here

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        document.body.addEventListener('click', handleNavigation);
        window.addEventListener('popstate', handlePopState);
        loadInitialContent();
    }

    function handleNavigation(e) {
        if (e.target.closest('a')) {
            const link = e.target.closest('a');
            const href = link.getAttribute('href');
            if (!href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#')) {
                e.preventDefault();
                loadContent(href);
            }
        }
    }

    function handlePopState() {
        loadContent(location.pathname);
    }

    function setActiveNavItem(url) {
        const navItems = document.querySelectorAll('nav ul li a');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === url || (url === 'index.html' && item.getAttribute('href') === 'index.html')) {
                item.classList.add('active');
            }
        });
    }

    async function loadContent(url) {
        try {
            const basePath = '/kipjordan.github.io/';
            let fetchUrl;
            if (url === 'index.html' || url === '') {
                fetchUrl = basePath + 'index.html';
            } else if (url.startsWith('projects/')) {
                fetchUrl = basePath + url;
            } else if (url.startsWith('sections/') || url.endsWith('.html')) {
                fetchUrl = basePath + url;
            } else {
                fetchUrl = basePath + 'sections/' + url + '.html';
            }

            const response = await fetch(fetchUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            let newContent;
            if (url === 'index.html' || url === '') {
                newContent = doc.querySelector('main').innerHTML;
            } else {
                newContent = doc.body.innerHTML;
            }
            if (newContent && newContent.trim() !== '') {
                const main = document.querySelector('main');
                main.innerHTML = newContent;
                
                // Handle additional resources
                const links = doc.querySelectorAll('link[rel="stylesheet"]');
                links.forEach(link => {
                    if (!document.querySelector(`link[href="${link.getAttribute('href')}"]`)) {
                        document.head.appendChild(link.cloneNode(true));
                    }
                });

                // Set active nav item
                setActiveNavItem(url);
            } else {
                throw new Error('No content found in the loaded HTML');
            }
            
            updateURL(url);
            reinitializeScripts();
        } catch (error) {
            handleError(error);
        }
    }

    function updateContent(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const main = document.querySelector('main');
        main.innerHTML = doc.body.innerHTML;
    }

    function updateURL(url) {
        const basePath = '/kipjordan.github.io/';
        const newURL = url === 'index.html' || url === '' ? basePath + 'index.html' : basePath + url;
        history.pushState(null, '', newURL);
    }

    function loadInitialContent() {
        loadContent('index.html');
    }

    function reinitializeScripts() {
        if (typeof MathJax !== 'undefined' && typeof MathJax.typeset === 'function') {
            MathJax.typeset();
        }
        reinitializeGists();
    }

    function reinitializeGists() {
        const gistScripts = document.querySelectorAll('script[src*="gist.github.com"]');
        gistScripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.src = script.src;
            script.parentNode.replaceChild(newScript, script);
        });
    }

    function handleError(error) {
        console.error('There has been a problem with your fetch operation:', error);
        const main = document.querySelector('main');
        main.innerHTML = `<h2>Error</h2><p>There was an error loading the content: ${error.message}. Please try again later.</p>`;
    }

    function handleFadeIn() {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    function addFadeInClass() {
        const paragraphs = document.querySelectorAll('main p');
        paragraphs.forEach(p => {
            if (!p.classList.contains('fade-in')) {
                p.classList.add('fade-in');
            }
        });
    }

    addFadeInClass();
    handleFadeIn();
})();
