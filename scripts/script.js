// ! soomthing scrolling

function smootScorlling() {
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

smootScorlling();




// ! loading animation





const mousFollower = e => {
  const cursor = document.querySelector(`#cursor`);
  let start = new Date().getTime();

const originPosition = { x: 0, y: 0 };

const last = {
  starTimestamp: start,
  starPosition: originPosition,
  mousePosition: originPosition
}

// ! configuration of styling

const config = {
  starAnimationDuration: 1500,
  minimumTimeBetweenStars: 250,
  minimumDistanceBetweenStars: 75,
  glowDuration: 75,
  zIndex: 50,
  maximumGlowPointSpacing: 10,
  colors: ["249 146 253", "252 254 255"],
  sizes: ["1.2rem", ".8rem", "0.4rem"],
  animations: ["fall-1", "fall-2", "fall-3"]
}

let count = 0;

// ! function of star
  
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      selectRandom = items => items[rand(0, items.length - 1)];

const withUnit = (value, unit) => `${value}${unit}`,
      px = value => withUnit(value, "px"),
      ms = value => withUnit(value, "ms");

const calcDistance = (a, b) => {
  const diffX = b.x - a.x,
        diffY = b.y - a.y;
  
  return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
}

const calcElapsedTime = (start, end) => end - start;

const appendElement = element => document.body.appendChild(element),
      removeElement = (element, delay) => setTimeout(() => document.body.removeChild(element), delay);


// ! creating star element style

const createStar = position => {
  const star = document.createElement("span"),
        color = selectRandom(config.colors);
  
  star.className = "star fa-solid fa-star";
  
  star.style.left = px(position.x);
  star.style.top = px(position.y);
  star.style.zIndex = config
  star.style.fontSize = selectRandom(config.sizes);
  star.style.color = `rgb(${color})`;
  star.style.zIndex = config.zIndex;
  star.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
  star.style.animationName = config.animations[count++ % 3];
  star.style.starAnimationDuration = ms(config.starAnimationDuration);
  
  appendElement(star);

  removeElement(star, config.starAnimationDuration);
}


// ! styling for glow effect

const createGlowPoint = position => {
  const glow = document.createElement("div");
  
  glow.className = "glow-point";
  
  glow.style.left = px(position.x);
  glow.style.top = px(position.y);
  glow.style.zIndex = config.zIndex;
  glow.style.transform = `translate(50%, 50%)`;
  
  appendElement(glow)
  
  removeElement(glow, config.glowDuration);
}

const determinePointQuantity = distance => Math.max(
  Math.floor(distance / config.maximumGlowPointSpacing),
  1
);


//! create a glow effect

const createGlow = (last, current) => {
  const distance = calcDistance(last, current),
        quantity = determinePointQuantity(distance);
  
  const dx = (current.x - last.x) / quantity,
        dy = (current.y - last.y) / quantity;
  
  Array.from(Array(quantity)).forEach((_, index) => { 
    const x = last.x + dx * index, 
          y = last.y + dy * index;
    
    createGlowPoint({ x, y });
  });
}

const updateLastStar = position => {
  last.starTimestamp = new Date().getTime();

  last.starPosition = position;
}

const updateLastMousePosition = position => last.mousePosition = position;

const adjustLastMousePosition = position => {
  if(last.mousePosition.x === 0 && last.mousePosition.y === 0) {
    last.mousePosition = position;
  }
};

const handleOnMove = e => {
  const mousePosition = { x: e.clientX, y: e.clientY }

  //   gsap.to(cursor, {
  //   left: mousePosition.x + "px",
  //   top: mousePosition.y + "px",
  // });

  cursor.style.left = mousePosition.x + "px";
  cursor.style.top = mousePosition.y + "px";
  
  adjustLastMousePosition(mousePosition);
  
  const now = new Date().getTime(),
        hasMovedFarEnough = calcDistance(last.starPosition, mousePosition) >= config.minimumDistanceBetweenStars,
        hasBeenLongEnough = calcElapsedTime(last.starTimestamp, now) > config.minimumTimeBetweenStars;
  
  if(hasMovedFarEnough || hasBeenLongEnough) {
    createStar(mousePosition);
    
    updateLastStar(mousePosition);
  }
  
  createGlow(last.mousePosition, mousePosition);
  
  updateLastMousePosition(mousePosition);
}

document.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);

document.body.onmouseleave = () => updateLastMousePosition(originPosition);
}
mousFollower();



let index = 0,
    interval = 1000;

const rand = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const animate = star => {
  star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
  star.style.setProperty("--star-top", `${rand(-40, 80)}%`);

  star.style.animation = "none";
  star.offsetHeight;
  star.style.animation = "";
}

for(const star of document.getElementsByClassName("magic-star")) {
  setTimeout(() => {
    animate(star);
    
    setInterval(() => animate(star), 1000);
  }, index++ * (interval / 3))
}


//! LOADER

function loading(){
  document.addEventListener("DOMContentLoaded", function () {
      // GSAP Animation for loader entrance
      var tl = gsap.timeline();
      tl.from(".loader", {
        y: "-100%",
        duration: 0.7,
      });
      tl.from(".logo", {
        opacity: 0,
        duration: 0.6,
      });
      tl.from(".year", {
        opacity: 0,
        duration: 0.6,
        y: "100%",
        stagger: 0.1,
      });

      // Timer logic to increment the percentage
      let timerElement = document.querySelector(".timer");
      let percentage = 0;
      let interval = setInterval(function () {
        percentage += 2; // Increase by 2 every 0.1 second to reach 100% in 5 seconds
        if (percentage > 100) {
          percentage = 100;
          clearInterval(interval);
          tl.to(".loader", {
            top: "100%",
            duration: 0.7,
            ease: "power1.in",
            onComplete: function () {
              document.querySelector(".loader").style.display = "none";

              var tl = gsap.timeline();
              tl.to(".blink", {
                opacity: 1,
                duration: 0.1,
                ease: "power1.in",
                stagger: 0.05,
              });
              tl.to(".logo", {
                opacity: 0,
                display: "none",
                duration: 0.1,
                ease: "power1.in",
                // stagger: 0.05,
              });
            },
          });
        }
        timerElement.textContent = `${percentage}%`;
      }, 100); // Update every 0.1 second
    });

}
loading()
function page1() {
  // const mobNo = document.querySelectorAll(".mob-no");
  // mobNo.forEach((mobNo)=>{
// Create the info box div



// mobNo.addEventListener("mouseenter", (e) => {
//   infoBox.classList.remove("hidden");
//   infoBox.style.left = `${e.offsetX + 10}px`; // Offset to avoid covering the cursor
//   infoBox.style.top = `${e.offsetY + 10}px`;
// });

// mobNo.addEventListener("mousemove", (e) => {
//   infoBox.style.left = `${e.offsetX + 10}px`;
//   infoBox.style.top = `${e.offsetY + 10}px`;
// });

// mobNo.addEventListener("mouseleave", () => {
//   infoBox.classList.add("hidden");
// });
//   })
  
  // const locate = document.querySelectorAll(".locate");

  // Create the info box div
  locate.forEach((locate)=>{
    const locBox = document.createElement("div");
    locBox.className = "hidden absolute bg-black rounded-md p-1 w-32";
  
    // Set the inner HTML content
    locBox.innerHTML = `
        <div class="h-32 rounded-md w-full overflow-hidden bg-red-600">
          <img class="h-full w-full object-cover" src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" alt="">
        </div>
        <p class="text-xs text-white my-1 tracking-tighter font-extralight">53 Zambryaniska street, Lviv, Lviv, Oblast 47009</p>
        <p class="text-sm tracking-tighter my-1 font-extralight text-zinc-400">open on map</p>
      `;
  
    locate.appendChild(locBox);
  
    locate.addEventListener("mouseenter", (e) => {
      locBox.classList.remove("hidden");
      locBox.style.left = `${e.offsetX - locBox.offsetWidth - 10}px`; // Place the box to the left of the cursor
      locBox.style.top = `${e.offsetY}px`;
    });
  
    locate.addEventListener("mousemove", (e) => {
      locBox.style.left = `${e.offsetX - locBox.offsetWidth - 10}px`; // Update the left position to follow the cursor
      locBox.style.top = `${e.offsetY - 120}px`;
    });
  
    locate.addEventListener("mouseleave", () => {
      locBox.classList.add("hidden");
    });
  
  })
  
}
// page1()




// ! container first


const firstAnimation = () => {
  const swip = gsap.timeline({
    scrollTrigger: {
      trigger: "#container-first",
      scroller: "body",
      markers: true,
      start: "0% 0%",
      end: "100% -100%",
      pin: true,
      scrub: 1,
    },
  });
  swip
    .to(
      `.row-div`,
      {
        marginTop: "-30%",
      },
      "sam"
    )
    .to(
      `.rotate-div`,
      {
        transform: `rotate(-20deg) scale(.8)`,
        delay: 0.2,
        marginLeft: "10%",
      },
      "sam"
    )
    .to(
      `.containt-part1 h1`,
      {
        opacity: 1,
        // display: "block",
        delay: 0.1,
      },
      "sam"
    )
    .to(
      `.overlaye`,
      {
        backgroundColor: `rgba(0, 0, 0, 0.416)`,
      },
      "sam"
    )
    .to(
      `.inner-line`,
      {
        width: "100%",
      },
      ""
    );
};
// firstAnimation();