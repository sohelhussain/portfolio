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

function loading() {
  document.addEventListener("DOMContentLoaded", function () {
    const loader = document.querySelector(".loader");
    const enterBtn = document.getElementById("enter-btn");
    const audio = document.getElementById("bg-audio");
    const timerElement = document.querySelector(".timer");
    const loadingTimer = document.querySelector(".loading-timer");
    const overlayGrain = document.querySelector(".svg-box");

    const allPromises = [];

    // Gather all assets: images, videos, background images
    document.querySelectorAll("img").forEach((img) => {
      const p = new Promise((resolve) => {
        if (img.complete) return resolve();
        img.onload = img.onerror = resolve;
      });
      allPromises.push(p);
    });

    document.querySelectorAll("video").forEach((video) => {
      const p = new Promise((resolve) => {
        if (video.readyState >= 3) return resolve();
        video.onloadeddata = video.onerror = resolve;
      });
      allPromises.push(p);
    });

    document.querySelectorAll("*").forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== "none") {
        const url = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (url) {
          const img = new Image();
          const p = new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          });
          img.src = url[1];
          allPromises.push(p);
        }
      }
    });

    if (document.fonts) {
      allPromises.push(document.fonts.ready);
    }

    // Track progress (real or fake)
    let percent = 0;
    let fakeLoaderRunning = true;
    const total = allPromises.length;
    let loaded = 0;

    function updateProgress(p) {
      timerElement.textContent = `${p}%`;
    }

    //  Fake loader runs for full 5 seconds (100 / (5s / 100ms) = 2% every 100ms)
    const fakeInterval = setInterval(() => {
      if (!fakeLoaderRunning) return clearInterval(fakeInterval);
      percent += 2;
      if (percent >= 100) {
        percent = 100;
        updateProgress(percent);
        clearInterval(fakeInterval);
        showEnterButton();
      } else {
        updateProgress(percent);
      }
    }, 100); // 100ms * 50 steps = ~5 seconds

    //  Real loading starts after 5 seconds
    const realLoadTimeout = setTimeout(() => {
      Promise.all(allPromises).then(() => {
        fakeLoaderRunning = false;
        clearInterval(fakeInterval);
        updateProgress(100);
        showEnterButton();
      });

      allPromises.forEach((p) => {
        p.then(() => {
          loaded++;
          const realPercent = Math.round((loaded / total) * 100);
          updateProgress(realPercent);
        });
      });
    }, 5000); // Wait 5s before switching to real loading if not done

    function showEnterButton() {
      enterBtn.classList.remove("hidden");
      loadingTimer.classList.add("hidden");
    }
    // overlayGrain.classList.remove("hidden");

    // Animate loader in
    const tl = gsap.timeline();
    tl.from(".loader", { y: "-100%", duration: 0.7 });
    tl.from(".logo", { opacity: 0, duration: 0.6 });
    tl.from(".year", { opacity: 0, duration: 0.6, y: "100%", stagger: 0.1 });

    // Handle "Enter Site" click
    enterBtn.addEventListener("click", () => {
      const tl2 = gsap.timeline();

      tl2.to(".loader", {
        top: "100%",
        duration: 0.7,
        ease: "power1.in",
        onComplete: () => {
          loader.style.display = "none";

          if (audio) {
            audio.muted = false;
            audio.play().catch((e) => {
              console.warn("Audio play failed:", e);
            });
          }

          tl2.to(".hero-text", { opacity: 1, duration: 0.3, y: "0%", stagger: 0.1 });
          tl2.to(".hero-svg-cover", { opacity: 1, duration: 0.6, y: "0%", stagger: 0.1 });

          const tl3 = gsap.timeline();
          tl3.to(".blink", {
            opacity: 1,
            duration: 0.1,
            ease: "power1.in",
            stagger: 0.05,
          });
          tl3.to(".logo", {
            opacity: 0,
            display: "none",
            duration: 0.1,
            ease: "power1.in",
          });
        },
      });
    });
  });
}

loading();





const textUpperMove = () => {
  const hed = document.querySelectorAll(".fo-hed .hedText");

  hed.forEach(function (elem) {
    var elemText = elem.textContent;
    var splited = elemText.split("");
    var clutter = "";
    splited.forEach(function (e) {
      clutter += `<span>${e}</span>`;
    });
    elem.innerHTML = clutter;
  });

  const foHed = document.querySelector(".fo-hed");

  foHed.addEventListener("mouseenter",function(){
    gsap.to(".fo-hed h1 span",{
        opacity:0,
        stagger:0.1,
        duration:0.5
    })
    gsap.to(".fo-hed h2 span",{
        opacity:1,
        delay:0.4,
        duration:0.5,
        stagger:0.1
    })
  })

  foHed.addEventListener("mouseleave",function(){
    gsap.to(".fo-hed h2 span",{
        opacity:0,
        stagger:0.05,
        duration:0.3
    })
    gsap.to(".fo-hed h1 span",{
        opacity:1,
        delay:0.4,
        duration:0.3,
        stagger:0.05
    })
  })

};
// textUpperMove();

//! video smoothning

function videoEffect(){
  const video = document.getElementById('bg-video');
video.src = 'assets/videos/back.mp4';

video.addEventListener('ended', () => {
  video.currentTime = 0;
  video.play();
});
}

videoEffect();

function heroSvg(){
 // Register MorphSVGPlugin with GSAP
        gsap.registerPlugin(MorphSVGPlugin);

        // Get references to the SVG path
        const morphingPath = document.getElementById('morphing-path');

        // Store the 'd' attributes for the two shapes
        const shape1D = `
            M347.468628,1025.000000
            C351.194916,1009.100464 355.134033,993.128174 359.631531,977.314697
            C374.571686,924.784363 397.449097,875.543823 422.457153,827.221375
            C430.839539,811.024292 439.692383,795.071289 448.201447,778.938843
            C451.877838,771.968689 453.782776,764.603943 453.083923,756.537415
            C451.927551,743.190491 460.069855,734.468750 468.921661,726.226135
            C470.380371,724.867737 471.917542,723.585571 473.295410,722.150024
            C476.278595,719.041870 476.305298,716.127075 474.319550,711.961853
            C468.480469,699.714172 463.064819,687.230774 458.196564,674.565613
            C454.800385,665.730225 450.118256,658.224915 443.222748,651.638672
            C431.783813,640.712830 426.668610,626.479675 423.936371,611.182251
            C421.747467,598.926697 415.164795,591.684082 406.251404,591.768677
            C400.963379,591.818848 395.675201,592.644226 390.401367,593.245789
            C377.244690,594.746338 364.121613,597.152771 350.935059,597.554382
            C342.775177,597.803040 334.188782,596.046509 326.384247,593.429382
            C310.821930,588.210693 304.157043,575.355286 305.743652,555.990295
            C306.158661,550.924683 307.072021,545.891602 307.925415,540.872253
            C309.031952,534.364258 306.263702,529.157532 299.826233,526.032837
            C285.730011,519.190613 283.082794,509.847992 291.463593,496.518951
            C281.625610,494.048920 276.983521,486.025940 279.379242,475.329224
            C280.095917,472.129242 281.230316,469.019409 282.235138,465.888092
            C284.503021,458.820435 282.350372,454.594696 275.292938,452.820099
            C271.145935,451.777313 266.821167,451.380280 262.739197,450.151703
            C249.675919,446.219971 243.847992,434.638306 248.481613,421.866821
            C249.699799,418.509125 251.324097,415.218658 253.252579,412.212067
            C263.938324,395.552429 274.787140,378.997437 285.550049,362.387177
            C287.428314,359.488525 289.285248,356.563873 290.941986,353.536255
            C295.634033,344.961823 294.948639,342.888550 288.806580,335.258392
            C281.334503,325.975861 280.281281,314.811157 281.513550,303.385345
            C282.076355,298.167053 283.164886,293.005493 284.090942,287.354675
            C273.595428,298.748199 261.450073,298.230865 249.080353,292.840515
            C240.651062,289.167328 236.705551,281.371521 233.926224,272.944214
            C233.329041,271.133484 232.070709,268.849609 230.507233,268.153870
            C211.040421,259.491272 205.790787,234.526520 213.000397,217.083099
            C215.002472,212.239182 217.942276,207.782852 220.628189,202.823120
            C207.589005,177.005447 213.429367,154.696060 239.488800,138.806519
            C242.204926,137.150375 243.395340,135.743637 242.984558,132.338425
            C242.053497,124.620384 244.085785,117.590202 249.684830,111.910919
            C250.826706,110.752670 252.164291,109.590591 253.639755,109.016243
            C254.972702,108.497383 256.617615,108.779945 258.124939,108.709091
            C257.732452,109.997536 257.602539,111.454353 256.902802,112.545799
            C253.555115,117.767235 254.125549,124.189583 258.480286,128.627960
            C262.176788,125.293755 265.500763,121.366867 269.655548,118.768570
            C275.692535,114.993210 274.868835,108.560509 276.806580,103.269043
            C281.090424,91.570992 287.977997,82.028580 298.323456,75.048203
            C305.525055,70.189079 313.013947,69.056084 321.187988,72.798508
            C322.436920,73.370323 324.882965,72.171806 326.388519,71.195572
            C333.683533,66.465439 340.460388,60.752953 348.182251,56.924065
            C354.043762,54.017612 359.706146,51.536598 364.928314,47.193520
            C373.655396,39.935493 384.382965,40.767239 394.687683,43.804604
            C399.698151,45.281464 404.348511,47.946724 409.256714,49.826389
            C410.545135,50.319794 412.621094,50.437397 413.533691,49.714924
            C414.303284,49.105621 413.994843,47.028427 413.993744,45.601097
            C413.993256,44.982655 413.518585,44.377918 413.340271,43.744186
            C411.580719,37.490658 412.806580,35.752316 419.356140,36.029758
            C422.260864,36.152802 425.368805,36.596161 427.957977,37.806549
            C431.508270,39.466232 434.030670,38.719540 436.927338,36.487076
            C444.663086,30.525160 453.595764,26.922941 463.231873,26.241713
            C468.152527,25.893843 473.329468,27.500784 478.218445,28.848627
            C483.016479,30.171404 487.329254,30.330963 492.074066,28.284746
            C506.545197,22.043978 528.272827,27.023504 538.196716,38.449909
            C540.709106,41.342644 543.124268,39.894230 545.659851,38.322708
            C557.731262,30.841032 570.068909,30.127434 582.673035,37.019016
            C589.001282,40.479103 594.035645,45.315948 596.446716,52.103619
            C598.237183,57.144020 601.050781,57.598732 605.571716,56.383423
            C619.478333,52.645065 633.448547,52.922794 647.204529,57.048790
            C655.833862,59.637100 661.594421,65.442657 664.067139,74.312798
            C664.429016,75.610802 665.188416,77.531113 666.158081,77.814491
            C677.337891,81.081802 680.964844,90.412979 683.474365,100.068161
            C684.489380,103.973404 686.633972,105.286499 689.525818,106.974251
            C698.182800,112.026649 707.289429,116.575142 715.107300,122.733589
            C725.809692,131.164230 729.479553,143.421036 728.768188,156.729462
            C728.512573,161.512619 729.168396,164.870071 732.765747,168.496994
            C738.415405,174.193054 744.151428,180.315796 747.852356,187.314621
            C753.680298,198.335663 752.681152,210.002838 745.970642,220.689102
            C744.076294,223.705719 744.267822,225.662888 746.096558,228.575089
            C749.397827,233.832321 752.490601,239.308487 754.900696,245.018127
            C759.273010,255.376663 758.323730,265.569855 752.325989,275.162659
            C746.298462,284.802979 741.024353,295.015747 742.543030,306.601562
            C744.892761,324.526550 739.773987,340.013794 730.075989,354.639221
            C728.124451,357.582336 727.420959,361.328857 725.939148,364.613434
            C723.849243,369.245972 721.635498,373.826019 719.354736,378.368256
            C716.773743,383.508545 714.313293,388.735107 711.346680,393.650238
            C706.489014,401.698212 700.333313,409.087982 696.373657,417.528687
            C685.524841,440.654388 673.525635,463.172699 666.563843,488.173309
            C661.581543,506.064941 665.134033,522.609985 667.825378,539.647278
            C671.125488,560.538696 677.905701,580.340149 687.911682,598.999634
            C689.626282,602.197144 691.237305,605.532898 693.479980,608.338074
            C695.231750,610.529358 697.660156,613.048096 700.184326,613.596313
            C709.018005,615.514832 714.841919,621.072998 719.168335,628.302551
            C731.799500,649.409668 751.818542,663.515198 768.436218,680.833923
            C777.529236,690.310486 787.044922,699.380554 796.180786,708.817200
            C818.858521,732.241699 837.650696,758.579529 853.738525,786.853027
            C870.269531,815.905334 881.621033,847.012329 888.926697,879.556702
            C893.648010,900.588623 898.080505,921.705872 901.833618,942.927979
            C904.583069,958.474487 906.317871,974.222595 907.937744,989.939331
            C909.104919,1001.263916 909.338562,1012.684753 909.994263,1024.531250
            C549.979126,1025.000000 364.958221,1025.000000 179.468658,1025.000000
            z`;

        const shape2D = `
            M179.468658,1025.000000
            C181.050293,1008.047363 182.391174,990.971191 185.318512,974.171326
            C189.623978,949.462585 194.287704,924.763550 200.194290,900.398560
            C209.611755,861.550964 222.079407,823.739563 243.064728,789.254578
            C257.852692,764.953613 276.351685,743.674561 296.110199,723.428406
            C317.747986,701.256592 338.911316,678.684998 357.763458,654.046204
            C363.068542,647.112671 370.036102,642.627502 378.349030,640.061462
            C379.756409,639.627014 381.429535,638.775146 382.156708,637.604736
            C395.442780,616.220032 401.951324,592.789429 403.034424,567.730591
            C403.229950,563.207153 401.415222,560.127686 397.478546,558.049072
            C395.588928,557.051331 393.462982,556.116333 392.096832,554.574524
            C383.222839,544.559448 374.535065,534.379517 365.772614,524.265442
            C360.596100,518.290466 355.506592,512.233582 350.139832,506.433868
            C348.392883,504.545929 345.892700,503.354950 343.730591,501.840668
            C337.588348,510.907135 334.177368,511.604858 326.269745,504.435608
            C320.121887,498.861877 314.253479,492.858887 309.068848,486.398285
            C306.712341,483.461853 306.362061,478.938416 304.997955,475.172455
            C304.362000,473.416718 303.831421,471.444427 302.654816,470.089935
            C287.192169,452.289764 271.878632,434.394318 260.269318,413.696014
            C246.651382,389.416473 237.424301,363.622284 234.080994,335.934662
            C230.242584,304.146759 235.334518,273.260620 247.324127,243.983139
            C280.660645,162.578537 340.188354,109.655350 424.979797,86.404335
            C465.674438,75.245308 506.191925,80.671989 545.585327,94.451721
            C557.336914,98.562408 568.592102,104.131714 579.941406,109.324272
            C582.687012,110.580444 584.393555,110.570610 586.908997,108.743858
            C615.211853,88.189369 643.602234,67.754799 672.039185,47.385891
            C678.903564,42.469074 686.099609,38.101086 694.760315,36.981773
            C709.233643,35.111240 719.692627,41.686249 727.897095,52.809551
            C735.108582,62.586452 739.008972,73.883049 740.766296,85.663589
            C744.249451,109.014771 742.683899,131.840347 732.053589,153.561096
            C719.192932,179.839218 699.015625,198.898132 674.253235,213.631180
            C672.273804,214.808914 670.268433,215.943085 668.457214,216.992020
            C669.253235,222.673584 670.227722,228.149094 670.741394,233.667465
            C671.391174,240.648865 675.386658,244.551331 681.558105,247.065948
            C698.456177,253.951248 715.303040,260.962738 732.142639,267.990540
            C738.224487,270.528717 744.367737,272.978516 750.239014,275.950714
            C764.551819,283.196259 767.509033,296.070557 757.658142,308.773895
            C753.902649,313.616821 749.270325,317.775757 745.083862,322.289276
            C738.701721,329.170166 738.717163,332.728638 745.137756,339.589966
            C748.096436,342.751740 751.131897,345.841461 754.104370,348.990479
            C760.132568,355.376862 760.902710,360.964111 756.819641,368.827576
            C755.845703,370.703339 754.746155,372.513977 753.366760,374.951141
            C760.411133,373.411621 764.393494,377.125214 767.854675,381.855347
            C770.458496,385.413849 770.873901,389.255402 768.757690,393.051300
            C763.986084,401.610229 765.140503,408.941467 772.091370,415.947845
            C775.792603,419.678680 778.940491,424.132782 781.603088,428.689941
            C794.040222,449.976624 788.910583,471.144043 768.149719,484.504883
            C754.977173,492.982178 740.006287,497.177856 725.313660,502.035797
            C712.688782,506.210022 699.987549,510.236542 687.627258,515.107849
            C669.502686,522.251038 661.146851,536.581726 661.137573,555.545410
            C661.130615,569.805237 662.953430,584.074524 662.748108,598.322083
            C662.644165,605.542725 661.616455,613.806458 657.973816,619.735474
            C642.851318,644.349976 634.402710,671.906799 622.030640,697.697632
            C617.417603,707.313904 612.997864,717.029968 608.772705,726.822449
            C606.636230,731.773987 608.000427,736.265991 612.167786,739.740295
            C614.844788,741.972046 617.613953,744.096069 620.386169,746.210083
            C625.026428,749.748657 628.596863,754.114502 629.440002,759.985046
            C631.588562,774.944763 638.244446,788.217834 644.715759,801.539124
            C660.498535,834.028076 677.059021,866.154541 692.169250,898.950745
            C710.090149,937.847534 724.244934,978.188904 734.404358,1019.860962
            C734.756165,1021.303894 735.037720,1022.763977 735.176025,1024.608032
            C549.979126,1025.000000 364.958221,1025.000000 179.468658,1025.000000
            z`;

        // Create a GSAP timeline for the morph animation
        const morphTimeline = gsap.timeline({
            repeat: -1,      // Repeat 9 times, meaning 10 total cycles (initial + 9 repeats)
            yoyo: true,     // Makes the animation play forward then reverse
            repeatDelay: 2  // 2-second delay after each full forward-reverse cycle
        });

        // Add the morph animation to the timeline
        // The path will morph from its current D (shape1D) to shape2D, and then back automatically due to yoyo: true
        morphTimeline.to(morphingPath, {
            duration: 1.5,      // Animation duration for one direction (e.g., shape1 to shape2)
            morphSVG: shape2D,  // Target D attribute for the morph
            ease: "power1.inOut", // Easing function for smooth animation
            fill: "#000000"     // Change fill color to orange when morphed to shape2D
        });

        // The animation will start automatically when the page loads.
}
heroSvg();



//! second container effect 

function secondContainer(){
  const container = document.querySelector("#container-second");
  const textFirst = document.querySelector(".second-text-fi");
  const textSecond = document.querySelector(".gred-text");
  const textLast = document.querySelector(".last-sec");
  container.style.backgroundColor = "#BCBBBD";

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scroller: "#main",
      start: "0% 90%",
      end: "90% 80%",
      scrub: true,
      // markers: true,
    }
  });

  tl.to(container, {
    backgroundColor: "rgb(35, 35, 31)",
  },"c");
tl.to(textFirst, {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "power1.out"
}, "c");
tl.to(textSecond, {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "power1.out"
});
tl.to(textLast, {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "power1.out"
});

}
secondContainer();


function thirdContainer(){
  const container = document.querySelector("#container-third");
  const textFirst = document.querySelector(".third-text-fi");
  const textSecond = document.querySelector(".gred-text-third");
  const textLast = document.querySelector(".last-sec-third");
  container.style.backgroundColor = "#BCBBBD";

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scroller: "#main",
      start: "0% 90%",
      end: "90% 80%",
      scrub: true,
      // markers: true,
    }
  });

  tl.to(container, {
    backgroundColor: "rgb(35, 35, 31)",
  },"c");
tl.to(textFirst, {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "power1.out"
}, "c");
tl.to(textSecond, {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "power1.out"
});
tl.to(textLast, {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "power1.out"
});

}
thirdContainer();




function frontendProd() {
  const project1CardData = [
    {
        id: "1",
        smallCard: { title: "Cue", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
            imageSrc: "https://res.cloudinary.com/dayqxxsip/image/upload/v1639839066/App%20Images/Blog%20Images/Article%20Images/Improving%20System%20Design%20Skills/system-design-example-wide.drawio_bjeg1k_hhit1q.png",
            mainTitle: "Cue",
            techStack: "HTML, CSS, JavaScript, GSAP, ScrollTrigger, and Lenis",
            description: "Cue is a modern, animation-rich web portfolio for a modeling agency, featuring smooth scrolling, creative transitions, and interactive visual effects. Built with HTML, CSS, JavaScript, GSAP, ScrollTrigger, and Lenis.",
            learning: "While building this website using HTML, CSS, JavaScript, ScrollTrigger, GSAP, and Lenis, I learned several new concepts and techniques. One of the key skills I picked up was image masking animation using GSAP in combination with ScrollTrigger. I also learned how to integrate the Lenis smooth scrolling library to create a seamless, fluid scrolling experience across the site. A major highlight of my learning was exploring the pin property in ScrollTrigger, which I used extensively in this project. This feature allowed me to create engaging, scroll-based animations where elements stay fixed in place while the rest of the content moves, adding depth and interactivity to the design. This project not only improved my technical skills but also deepened my understanding of advanced web animation techniques. It showed me how powerful modern animation libraries can be when building creative and interactive web experiences.",
            liveLink: "https://sohelhussain.github.io/cue/",
            githubLink: "https://github.com/sohelhussain/cue"
        }
    },
    {
        id: "2",
        smallCard: { title: "Refocus", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
            imageSrc: "https://raw.githubusercontent.com/karanpratapsingh/portfolio/master/public/static/courses/system-design/chapter-I/load-balancing/redundant-load-balancer.png",
            mainTitle: "Refocus",
            techStack: "React, framer-motion, typescript",
            description: "Refocus is an animation-rich website built with React, TypeScript, and Framer Motion. Inspired by the work of Refokus — a boutique agency supporting B2B startups, VC firms, and innovative large organizations with strategy, branding, web design, and development. Nominated as Agency of the Year, Refokus delivers high-end quality at speed using a combination of Webflow, AI, and proprietary frameworks.",
            learning: "While building this project, I learned how to create mouse-based animations using Framer Motion. I also explored how to effectively integrate Framer Motion into a React project with reusable components. Compared to plain HTML, CSS, and JavaScript projects—where I would code every animation from scratch—using Framer Motion in React made complex animations much easier and more maintainable.",
            liveLink: "https://refokus.onrender.com/",
            githubLink: "https://github.com/sohelhussain/refokus"
        }
    },
    {
        id: "3",
        smallCard: { title: "Obys Agency", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
            imageSrc: "https://placehold.co/600x400/87ceeb/ffffff?text=Image+3",
            mainTitle: "Obys Agency",
            techStack: "HTML, CSS, JavaScript, Shery.js, Three.js",
            description: "Obys Agency is a 3D water animation website built with HTML, CSS, JavaScript, Shery.js, and Three.js. It’s inspired by a digital design agency that focuses on creative UI/UX design, branding, and interactive experiences.",
            learning: "In this project, I learned how to create a custom loader and integrate Shery.js with Three.js to build water ripple animations on images. I also implemented a mouse follower effect inside a video container and experimented with various text animations to enhance the site’s visual appeal.",
            liveLink: "https://sohelhussain.github.io/obys-Agency/",
            githubLink: "https://github.com/sohelhussain/obys-Agency"
        }
    },
    {
        id: "4",
        smallCard: { title: "Brandbeet", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
            imageSrc: "https://placehold.co/600x400/87ceeb/ffffff?text=Image+4",
            mainTitle: "Brandbeet",
            techStack: "HTML, CSS, JavaScript, GSAP, ScrollTrigger, and Lenis",
            description: "Brandbeet is a ScrollTrigger-powered animation website built with HTML, CSS, JavaScript, GSAP, ScrollTrigger, and Lenis. The Brandbeet team designs solutions that directly contribute to revenue growth and business success, specializing in Graphic Design, Motion Design, Social Media Ads, and Print Designs. Their redesigned website blends elegance with innovation to captivate both clients and team members.",
            learning: "In this project, I learned how to create a bubble effect using div elements, implement advanced scroll-based animations, and build reverse-cut transitions to reveal images. I also explored ScrollTrigger’s powerful pin property to create interactive, section-based animations.",
            liveLink: "https://sohelhussain.github.io/Brandbeet/",
            githubLink: "https://github.com/sohelhussain/Brandbeet"
        }
    },
    {
        id: "5",
        smallCard: { title: "Sundown", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
            imageSrc: "https://placehold.co/600x400/87ceeb/ffffff?text=Image+5",
            mainTitle: "Sundown",
            techStack: "HTML, CSS, JavaScript, GSAP, ScrollTrigger, Swiper.js and Locomotive Scroll",
            description: "Sundown is a multi-disciplinary studio focused on creating unique, end-to-end experiences and environments that inspire and engage.",
            learning: "In this project, I learned how to create a water blob effect using div elements with CSS animations, use ScrollTrigger’s pin property to hold a section in place during scrolling, and implement Swiper.js animations for interactive sliders.",
            liveLink: "https://sohelhussain.github.io/sundown/",
            githubLink: "https://github.com/sohelhussain/sundown"
        }
    },
    {
        id: "6",
        smallCard: { title: "Pony", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "assets/videos/Pony-Video.mp4",
            // imageSrc: "",
            mainTitle: "Pony",
            techStack: "HTML, CSS, JavaScript,ScrollTrigger, Gsap, and Locomotive Scroll",
            description: "Pony is a Locomotive Scroll-powered animation website built with HTML, CSS, and JavaScript. Pony is a creative agency born from the dream of telling beautiful stories about inspiring brands. Their mission is to give deeper meaning to what you do and reveal it to the world through thoughtful words, inspiring visuals, and impactful actions.",
            learning: "In this project, I learned how to create smooth, continuous animations using Locomotive Scroll to achieve an elegant scrolling experience.",
            liveLink: "https://sohelhussain.github.io/pony/",
            githubLink: "https://github.com/sohelhussain/pony"
        }
    },
];

// --- Data for the second set of cards (e.g., in #project-container2) ---
// Note: I've kept the content similar to what you provided earlier for project2CardData
// You should update these with the actual details for your "Medium", "MediVault", "Notion" projects.
const project2CardData = [
    {
        id: "1",
        smallCard: { title: "Medium", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
            imageSrc: "https://placehold.co/600x400/87ceeb/ffffff?text=Medium+Image",
            mainTitle: "Medium Project",
            techStack: "Turborepo, Rust, Next.js, Axum, Typescript.", 
            description: "On Medium, anyone can share insightful perspectives, useful knowledge, and life wisdom with the world.",
            learning: "In this project, I learned how to work with Rust by downloading and managing packages in Axum, and how to connect a Next.js frontend to a Rust backend. I also explored building APIs and combining both frontend and backend within a monolithic architecture.",
            liveLink: "https://github.com/sohelhussain/medium-rust",
            githubLink: "https://github.com/sohelhussain/medium-rust"
        }
    },
    {
        id: "2",
        smallCard: { title: "MediVault", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
            imageSrc: "https://placehold.co/600x400/87ceeb/ffffff?text=MediVault+Image",
            mainTitle: "MediVault Project",
            techStack: "tRPC, WebRTC, Node.js, Next.js, Anchor (Solana smart contracts), Turborepo, Kafka, Typescript",
            description: `
    <strong>Problem:</strong> Patients visit many doctors and hospitals throughout their lifetime, resulting in multiple prescription files that are difficult to manage and carry. <br><br>
    <strong>Solution:</strong> MediVault is a decentralized medical record system where a patient’s prescriptions are securely stored on the Solana mainnet. Hospitals can instantly access them via a QR code, ensuring both accessibility and security across institutions.
  `,
            learning: `
In this project, I learned how to connect tRPC in a monolithic architecture, integrate WebRTC for real-time video calling, and use Kafka for load balancing by creating a shared package. I also understood why a monolithic architecture fits this project, since we need live connections and plan to add features like real-time chatting in the future. Additionally, I learned how to handle WebSockets with WebRTC, which Next.js alone doesn’t fully support, so I separated the backend to Node.js for WebRTC and contract handling. Finally, I worked with Anchor smart contracts on Solana for secure prescription storage.
`,
            liveLink: "https://youtu.be/GKRr6EIOILc",
            githubLink: "https://github.com/sohelhussain/medivault"
        }
    },
    {
        id: "3",
        smallCard: { title: "Notion App", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
            imageSrc: "https://placehold.co/600x400/87ceeb/ffffff?text=Notion+Image",
            mainTitle: "Notion Clone",
            techStack: "Next.js, Tailwind CSS, Convex, Zod, CLERK, emoji-picker-react, Blocknote, Typescript",
            description: "Notion App is an workspace built with Next.js, Tailwind CSS, Convex, Zod, BlockNote, emoji-picker-react, and TypeScript. It provides a single place where teams can find answers, automate repetitive work, and manage projects efficiently — with rich text notes, and smooth user experience.",
            learning: "In this project, I learned how to use the Convex database for managing data, integrate emoji-picker-react for enhanced text input, and implement BlockNote to build a rich text editor for writing notes. I also learned advanced routing in Next.js, which helped me structure the app more efficiently. Additionally, I realized how much easier it is to build apps using prebuilt libraries and authentication (like Clerk) compared to coding everything from scratch, which I had done in earlier projects.",
            liveLink: "https://youtu.be/kkiDqpEWiOA",
            githubLink: "https://github.com/sohelhussain/notion"
        }
    },
    {
        id: "4",
        smallCard: { title: "Internshala", subtitle: "Click to know more" },
        bigCard: {
            videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
            imageSrc: "https://placehold.co/600x400/87ceeb/ffffff?text=Notion+Image",
            mainTitle: "Notion Clone",
            techStack: "React, Tailwind CSS, MongoDB, Express, Node.js, TypeScript",
            description: "Description for internshala clone project.",
            learning: "Learnings from internshala clone project.",
            liveLink: "https://hireinter.onrender.com",
            githubLink: "#"
        }
    },
];


// --- Reusable function to initialize card sections ---
// This function contains the logic for finding cards based on a selector
// and managing the single global big card overlay.
function initCardSectionLogic(cardSelector, cardDataArray) {
    console.log(`[Card Logic] Initializing section with selector: ${cardSelector}`);

    const cards = document.querySelectorAll(cardSelector);
    if (cards.length === 0) {
        console.warn(`[Card Logic] No cards found for selector: ${cardSelector}. Skipping initialization.`);
        return;
    }
    console.log(`[Card Logic] Found ${cards.length} cards for selector: ${cardSelector}`);

    // These elements refer to the SINGLE global overlay and its contents.
    // They are selected here to ensure local scope within this function,
    // but they are the same global HTML elements.
    const bigCardOverlay = document.querySelector('.big-card-overlay');
    const body = document.body; // Reference to the body element
    const bigCardTitle = document.getElementById('big-card-title');
    const bigCardTechStack = document.getElementById('big-card-tech-stack');
    const bigCardDescription = document.getElementById('big-card-description');
    const bigCardLearning = document.getElementById('big-card-learning');
    const bigCardLiveLink = document.getElementById('big-card-live-link');
    const bigCardGithubLink = document.getElementById('big-card-github-link');
    const bigCardVideo = document.getElementById('big-card-video');
    const bigCardImage = document.getElementById('big-card-image');

    // Function to open the big card and populate content
    function openBigCard(cardId) {
        console.log(`[Card Logic] openBigCard called for ID: ${cardId} from selector: ${cardSelector}`);
        const selectedData = cardDataArray.find(data => String(data.id) === String(cardId)); // Ensure ID comparison is robust
        if (!selectedData) {
            console.error('[Card Logic] Error: No data found for card ID:', cardId, 'in provided data array.');
            return;
        }

        // Populate big card with selectedData.bigCard, using optional chaining for safety
        if (bigCardTitle) bigCardTitle.textContent = selectedData.bigCard.mainTitle;
        if (bigCardTechStack) bigCardTechStack.textContent = selectedData.bigCard.techStack;
        if (bigCardDescription) bigCardDescription.textContent = selectedData.bigCard.description;
        if (bigCardLearning) bigCardLearning.textContent = selectedData.bigCard.learning;
        if (bigCardLiveLink) bigCardLiveLink.href = selectedData.bigCard.liveLink;
        if (bigCardGithubLink) bigCardGithubLink.href = selectedData.bigCard.githubLink;

        // Set video and image sources and control their display
        if (bigCardVideo) {
            if (selectedData.bigCard.videoSrc && selectedData.bigCard.videoSrc !== '#') { // Check for valid video source
                bigCardVideo.src = selectedData.bigCard.videoSrc;
                bigCardVideo.style.display = 'block';
                bigCardVideo.load();
                bigCardVideo.play().catch(e => console.error("[Card Logic] Video play failed:", e)); // Added catch for play promise
            } else {
                bigCardVideo.style.display = 'none';
                bigCardVideo.pause(); // Pause if no video
                bigCardVideo.removeAttribute('src'); // Clear src
            }
        }

        if (bigCardImage) {
            if (selectedData.bigCard.imageSrc && selectedData.bigCard.imageSrc !== '#') { // Check for valid image source
                bigCardImage.src = selectedData.bigCard.imageSrc;
                bigCardImage.style.display = 'block';
            } else {
                bigCardImage.style.display = 'none';
                bigCardImage.removeAttribute('src'); // Clear src
            }
        }

        if (bigCardOverlay) bigCardOverlay.classList.add('is-active');
        if (body) body.classList.add('no-scroll');
        console.log('[Card Logic] Big card overlay should be active now.');
    }

    // Add click listener to each small card in this section
    cards.forEach(card => {
        card.addEventListener('click', (event) => {
            console.log(`[Card Logic] Click detected on card in section: ${cardSelector}.`);
            // Prevent opening if the click was on the .card-open button itself
            if (event.target.closest('.card-open')) {
                console.log('[Card Logic] Click was on .card-open button, preventing bubbling to parent card.');
                return; // Let the .card-open listener handle it
            }
            const cardId = card.dataset.cardId;
            openBigCard(cardId);
        });

        // Add click listener to the open button specifically for cards in this section
        const openButton = card.querySelector('.card-open');
        if (openButton) {
            openButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent the click from bubbling up to the card
                const cardId = card.dataset.cardId; // Get ID from parent card
                console.log(`[Card Logic] Card open button clicked for ID: ${cardId} in section: ${cardSelector}`);
                openBigCard(cardId);
            });
        }
    });
}

// --- Global Initialization (Run this once after DOM is ready) ---
// This ensures all HTML elements are loaded before scripts try to access them.
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Global Init] DOM Content Loaded. Starting global initialization and card sections.');

    // --- Select global overlay elements once ---
    // These need to be accessible for the close logic.
    const bigCardOverlay = document.querySelector('.big-card-overlay');
    const cardClose = document.querySelector('.card-close');
    const body = document.body;
    // Access video element globally for pausing on close
    const bigCardVideo = document.getElementById('big-card-video');

    // Attach global close listener (only once!)
    if (cardClose) {
        cardClose.addEventListener('click', () => {
            console.log('[Global Init] Global close button clicked.');
            if (bigCardOverlay) bigCardOverlay.classList.remove('is-active');
            if (body) body.classList.remove('no-scroll');
            if (bigCardVideo) {
                bigCardVideo.pause();
                bigCardVideo.currentTime = 0;
            }
        });
    }

    // Close big card if clicking outside of it on the overlay (only once!)
    if (bigCardOverlay) {
        bigCardOverlay.addEventListener('click', (event) => {
            if (event.target === bigCardOverlay) {
                console.log('[Global Init] Clicked directly on overlay background, closing.');
                if (bigCardOverlay) bigCardOverlay.classList.remove('is-active');
                if (body) body.classList.remove('no-scroll');
                if (bigCardVideo) {
                    bigCardVideo.pause();
                    bigCardVideo.currentTime = 0;
                }
            }
        });
    }

    // --- Call initCardSectionLogic for each distinct set of cards ---
    // Call for your first set of cards (e.g., in #project-container)
    // Targets cards with class 'card' AND 'card1'.
    initCardSectionLogic('.card.card1', project1CardData);
    // Call for your second set of cards (e.g., in #project-container2)
    // Targets cards with class 'card' AND 'card2'.
    initCardSectionLogic('.card.card2', project2CardData);

    console.log('[Global Init] All card section initializations attempted.');
});

// --- HELPFUL DEBUGGING & TROUBLESHOOTING TIPS ---
// If cards still aren't clickable, it's highly likely that another script
// (like Locomotive Scroll or your loader's animation) is covering the cards
// or intercepting events.
// 1. Temporarily COMMENT OUT your Locomotive Scroll script in your HTML
//    (<script src="https://cdn.jsdelivr.net/npm/locomotive-scroll@3.5.4/dist/locomotive-scroll.min.js"></script>)
//    and test if the cards are clickable. This is often the culprit.
// 2. Ensure your loader div (`#loader`) becomes `display: none;` or `visibility: hidden;`
//    and has a lower `z-index` (e.g., `z-index: -1;`) after it finishes loading.
//    If your loader uses GSAP, ensure the final state of its animation hides it completely.
// 3. Check for any `pointer-events: none;` applied to parent elements of your cards
//    that shouldn't be there, or `pointer-events: all;` on overlaying elements that
//    are accidentally blocking clicks.

}

frontendProd();

