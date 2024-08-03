function locoScroll() {
  gsap.registerPlugin(ScrollTrigger);
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}

locoScroll();

const load = gsap.timeline({})

const randomTimeLoader = Math.floor(Math.random() * 6) + 5;
console.log(randomTimeLoader);

load.to('#loader .loading-text h1 span',{
    delay: randomTimeLoader,
    display: 'block',
    fontSize: '10vw',
    x: '80%',
})

load.to('.vertical',{
    duration: randomTimeLoader,
    top: '-1540%',
    ease: "power1.inOut",
})
load.to('#loader',{
    top:'-100%'
})