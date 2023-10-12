const currentDate = document.querySelector("#current-date");

const getCurrentDate = () => {
  const date = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  currentDate.innerText = date.toLocaleDateString("en-NG", options);
};
getCurrentDate();

// fetch("https://newsapi.org/v2/everything?q=-sex", {
//     method: 'GET',
//     headers: {
//         'X-Api-Key': '099148be22804e849a0c6fe022b7cf5e'
//     }})
// .then(res => res.json())
// .then(data => {
//         data.articles.map(props => {
//             if(props.description.toLowerCase().includes('tesla')) {
//                 console.log(props)
//             } else {
//                 console.log('Not found')
//             }
//         })
// })
// .catch(err => console.error("error:", err))

const carouselEl = document.querySelector(".slider");
const carouselBtn = document.querySelectorAll(".carousel_btn div");
const carouselCards = document.querySelectorAll(".carousel_card");
const navigationItems = document.querySelectorAll(".navigation li");
const cardWidth = carouselCards[0].offsetWidth;
let currentIndex = 0;

// Function to update the carousel to the given index
function updateCarousel(index) {
  carouselEl.scrollTo({
    left: index * cardWidth,
    behavior: "smooth",
  });
  currentIndex = index;
  updateNavigation(index);
}

// Function to update the navigation indicators
function updateNavigation(index) {
  navigationItems.forEach((item, i) => {
    item.classList.toggle("selected", i === index);
  });
}

// Functions to handle autoplay carousel
let autoplayInterval;
let isNavigating = false;

const startAutoplay = () => {
  if (!isNavigating) {
    autoplayInterval = setInterval(() => {
      updateCarousel(infiniteScroll(currentIndex + 1));
    }, 6000);
  }
}

const stopAutoplay = () => {
  clearInterval(autoplayInterval);
}

// Event listeners for navigation controls
navigationItems.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    isNavigating = true;
    updateCarousel(index);
    startAutoplay();
  });
});

// Function to scroll to innfinity
const infiniteScroll = (index) => {
  const numCards = carouselCards.length;
  if (index < 0) return numCards - 1;
  if (index >= numCards) return 0;
  return index;
}

// Function to scroll to the next card
function scrollToNextCard() {
  updateCarousel(infiniteScroll(currentIndex + 1));
}

// Function to scroll to the previous card
function scrollToPrevCard() {
  updateCarousel(infiniteScroll(currentIndex - 1));
}

// Event listeners for navigation buttons
carouselBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    isNavigating = true;
    if (btn.classList.contains("prev")) {
      updateCarousel(infiniteScroll(currentIndex - 1));
    } else if (btn.classList.contains("next")) {
      updateCarousel(infiniteScroll(currentIndex + 1));
    }
    startAutoplay();
  });
});

// Event listener for handling scrolling with arrow keys
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    if (currentIndex > 0) {
      isNavigating = true;
      updateCarousel(infiniteScroll(currentIndex - 1));
      startAutoplay();
    }
  } else if (e.key === "ArrowRight") {
    if (currentIndex < carouselCards.length - 1) {
      isNavigating = true;
      updateCarousel(infiniteScroll(currentIndex + 1));
      startAutoplay();
    }
  }
});

// Functions for handling scroll by dragging
let isDragging = false,
  startX,
  scrollLeft;

const startScroll = (e) => {
  isDragging = true;
  startX = e.clientX;
  scrollLeft = carouselEl.scrollLeft;
  carouselEl.style.scrollBehavior = "auto";
  // carouselEl.style.scrollSnapType = "none";
};

const scroll = (e) => {
  if (!isDragging) return;
  const x = e.clientX - startX;
  carouselEl.scrollLeft = scrollLeft - x;
};

const stopScroll = () => {
  isDragging = false;
  carouselEl.style.scrollBehavior = "smooth";
  const newIndex = infiniteScroll(
    Math.round(carouselEl.scrollLeft / cardWidth)
  );
  updateCarousel(newIndex);
};

const scrollDefault = () => {
  isDragging = false;
  carouselEl.style.scrollBehavior = "smooth";
};

// Additional logic to handle infinite scrolling by hand
const wrapScroll = () => {
  const maxScrollLeft = cardWidth * (carouselCards.length - 1);
  if (carouselEl.scrollLeft === 0) {
    // User scrolled to the beginning, wrap to the end
    carouselEl.scrollLeft = maxScrollLeft;
  } else if (carouselEl.scrollLeft === maxScrollLeft + cardWidth) {
    // User scrolled to the end, wrap to the beginning
    carouselEl.scrollLeft = cardWidth;
  }
};

carouselEl.addEventListener("mousemove", scroll);
carouselEl.addEventListener("mousedown", startScroll);
carouselEl.addEventListener("mouseup", stopScroll);
carouselEl.addEventListener("mouseleave", scrollDefault);
carouselEl.addEventListener("mouseenter", stopAutoplay);
carouselEl.addEventListener("mouseleave", startAutoplay);
carouselEl.addEventListener("scroll", wrapScroll);

// Start autoplay when the page loads
startAutoplay();

// Initial setup
setInterval(() => {
  updateNavigation(currentIndex);
  isNavigating = false;
}, 3000);






