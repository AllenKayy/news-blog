const getCurrentDate = () => {
  const currentDate = document.querySelector("#current-date");
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

const APIURL = "https://newsapi.org/v2/everything?q=-sex"
// 099148be22804e849a0c6fe022b7cf5e
fetch(APIURL, {
  method: 'GET',
  headers: {
      'X-Api-Key': '198d6676e82741a5b83c7db74ae51e0a'
  }
})
.then(res => res.json())
.then(data => {
  const articles = data.articles
  articles.forEach(props => {
    // console.log(props.content);
    displayNews(props);
  });
})
.catch(err => console.error("Error fetching data:", err))

const CarouselEl = document.querySelector(".carousel");
const sliderEl = document.querySelector(".slider");
const carouselOverview = document.querySelector(".carousel_overview");
const carouselBtn = document.querySelectorAll(".carousel_btn div");
const carouselCards = document.querySelectorAll(".carousel_card");
const navigationItems = document.querySelectorAll(".navigation li");
const cardWidth = carouselCards[0].offsetWidth;
let currentIndex = 0;

// Function to display news data 

const displayNews = (props) => {
  // Top Headlines
  CarouselEl.innerHTML +=`
    <div class="carousel_card">
      <img src="${props.urlToImage}" alt="" class="cover_img" draggable="false">
    </div>

    <div class="carousel_overview">
      <div class="top_overview">
        <div>
            <span>${props.publishedAt} &#8226;</span>
            <span>By ${props.author}</span>
        </div>
        <div>TECHNOLOGY</div>
      </div>
      <h1>${props.title}</h1>
      <p>${props.description}</p>
      <div class="carousel_navigation flex">
        <ul class="navigation flex">
            <li class="selected"></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
        <div class="carousel_btn flex">
          <div class="arrow_btn prev flex">
            <img src="./assets/svg/arrow-right-solid.svg" alt="" width="14">
          </div>
          <div class="arrow_btn next flex">
            <img src="./assets/svg/arrow-right-solid.svg" alt="" width="14">
          </div>
        </div>
      </div>
    </div>
  ` 
}

// Function to update the carousel to the given index
function updateCarousel(index) {
  sliderEl.scrollTo({
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
    }, 3000);
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

// // Function to scroll to the next card
// function scrollToNextCard() {
//   updateCarousel(infiniteScroll(currentIndex + 1));
// }

// // Function to scroll to the previous card
// function scrollToPrevCard() {
//   updateCarousel(infiniteScroll(currentIndex - 1));
// }

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
  scrollLeft = sliderEl.scrollLeft;
  sliderEl.style.scrollBehavior = "auto";
  // sliderEl.style.scrollSnapType = "none";
};

const scroll = (e) => {
  if (!isDragging) return;
  const x = e.clientX - startX;
  sliderEl.scrollLeft = scrollLeft - x;
};

const stopScroll = () => {
  isDragging = false;
  sliderEl.style.scrollBehavior = "smooth";
  const newIndex = infiniteScroll(
    Math.round(sliderEl.scrollLeft / cardWidth)
  );
  updateCarousel(newIndex);
};

const scrollDefault = () => {
  isDragging = false;
  sliderEl.style.scrollBehavior = "smooth";
};

// // Additional logic to handle infinite scrolling by hand
// const wrapScroll = () => {
//   const maxScrollLeft = cardWidth * (carouselCards.length - 1);
//   if (sliderEl.scrollLeft === 0) {
//     // User scrolled to the beginning, wrap to the end
//     sliderEl.scrollLeft = maxScrollLeft;
//   } else if (sliderEl.scrollLeft === maxScrollLeft + cardWidth) {
//     // User scrolled to the end, wrap to the beginning
//     sliderEl.scrollLeft = cardWidth;
//   }
// };

sliderEl.addEventListener("mousemove", scroll);
sliderEl.addEventListener("mousedown", startScroll);
sliderEl.addEventListener("mouseup", stopScroll);
sliderEl.addEventListener("mouseleave", scrollDefault);
sliderEl.addEventListener("mouseenter", stopAutoplay);
sliderEl.addEventListener("mouseleave", startAutoplay);
// sliderEl.addEventListener("scroll", wrapScroll);

// Start autoplay when the page loads
startAutoplay();

// Initial setup
updateNavigation(currentIndex);
