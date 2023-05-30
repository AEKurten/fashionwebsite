let controller;
let slideScene;
let pageScene;
let detailScene;
const customCursor = document.querySelector(".cursor");
const customCursorText = customCursor.querySelector("span");
const menu = document.querySelector(".burger");
//Event listeners
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
menu.addEventListener("click", navToggle);
function animateSlides() {
  //Init Controller
  controller = new ScrollMagic.Controller();
  //Select elements
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");
  //Loop over ach slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //GSAP
    const slideTL = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTL.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTL.fromTo(img, { scale: 2 }, { scale: 1 }, "-=.75");
    slideTL.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    //create scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTL)
      //   .addIndicators({
      //     colorStart: "white",
      //     colorEnd: "white",
      //     colorTrigger: "white",
      //     name: "animation",
      //   })
      .addTo(controller);
    //new animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    //create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      //   .addIndicators({
      //     colorStart: "white",
      //     colorEnd: "white",
      //     colorTrigger: "white",
      //     name: "page",
      //     indent: 200,
      //   })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

function cursor(e) {
  customCursor.style.top = e.pageY + "px";
  customCursor.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    customCursor.classList.add("nav-active");
  } else {
    customCursor.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    customCursor.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    customCursorText.innerText = "Tap";
  } else {
    customCursor.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, { y: "100%" });
    customCursorText.innerText = "";
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, {
      rotate: "-45",
      y: -5,
      width: "3rem",
      background: "black",
    });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, {
      rotate: "0",
      y: 0,
      width: "2.5rem",
      background: "white",
    });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    document.body.classList.remove("hide");
  }
}

//barba page transitons
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailanimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100" },
          { x: "0%", onComplete: done },
          "-0.5"
        );
      },
      enter({ current, next }) {
        //scroll to top
        window.scrollTo(0, 0);
        let done = this.async();
        //animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "0%" },
          { x: "-100%", stagger: 0.25, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          ".nav-header",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2.inOut" },
          "-=1.5"
        );
      },
    },
  ],
});

function detailanimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTl.fromTo(nextImg, { x: "50% " }, { x: "0%" });
    //scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addTo(controller);
  });
}
