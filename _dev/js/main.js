'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // Lory
    // ---------------
    var loryClass = document.querySelector('.js_slider');

    if (loryClass) {
        lory(loryClass, {
            rewind: true
        });
    }

    // Headroom
    // ---------------
    var headerBar = document.querySelector(".js-header"),
        navButton = document.querySelector('.js-nav-button'),
        navIcon   = document.querySelector('.js-nav-button > div'),
        mobileNav = document.querySelector('.js-nav'),
        headroom  = new Headroom(headerBar);

    navButton.onclick = function() {
        mobileNav.classList.toggle('concealed');
        navIcon.classList.toggle('nav-toggle--is-open');
    }

    headroom.init();

    // Stickyfill
    // ---------------
    var stickyElements = document.getElementsByClassName('sticky');

    if (stickyElements) {
        for (var i = stickyElements.length - 1; i >= 0; i--) {
            Stickyfill.add(stickyElements[i]);
        }
    }

    // Mini lightbox
    // ---------------
    MiniLightbox({
        selector: ".gallery-image img",
        delegation: "html"
    });

    MiniLightbox.customClose = function () {
        var self = this;

        self.img.classList.add("animated", "fadeOutDown");

        setTimeout(function () {
            self.box.classList.add("animated", "fadeOut");
            setTimeout(function () {
                self.box.classList.remove("animated", "fadeOut");
                self.img.classList.remove("animated", "fadeOutDown");
                self.box.style.display = "none";
            }, 500);
        }, 500);

        // Prevent default library behavior
        return false;
    };

    MiniLightbox.customOpen = function () {
        this.box.classList.add("animated", "fadeIn");
        this.img.classList.add("animated", "fadeInUp");
    };

    // Object fit polyfill
    // ---------------
    objectFit.polyfill({
        selector: 'img',
        fittype: 'cover',
        disableCrossDomain: 'true'
    });
});
