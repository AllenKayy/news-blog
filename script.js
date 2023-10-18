// Function to get current date
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

// Function to make category section responsive
const dropdown = document.querySelector('.categories');
const categoryEl = `
  <div class="category" id="home">Home</div>
  <div class="category" id="business">Business</div>
  <div class="category" id="technology">Technology</div>
  <div class="category" id="entertainment">Entertainment</div>
  <div class="category" id="general">General</div>
  <div class="category" id="health">Health</div>
  <div class="category" id="science">Science</div>
  <div class="category" id="sports">Sports</div>
`
const categoryDropDown = `
  <select name="category" id="category">
    <option value="Home">Home</option>
    <option value="Business">Business</option>
    <option value="Technology">Technology</option>
    <option value="Entertainment">Entertainment</option>
    <option value="General">General</option>
    <option value="Health">Health</option>
    <option value="Science">Science</option>
    <option value="Sports">Sports</option>
  </select>
`

const displayDropDown = () => {
  if(window.innerWidth <= 992) {
      console.log(window.innerWidth)
      dropdown.innerHTML = categoryDropDown;
  } else {
      dropdown.innerHTML = categoryEl;
  }
}

displayDropDown();
window.addEventListener('resize', displayDropDown)

let newsData;

// Function to display news data 
const displayTopHeadlines = (news) => {
  const sliderEl = document.querySelector(".slider");
  const carouselOverview = document.querySelector(".carousel_overview");
  const size = 4;
  let currentIndex = 0; // Initialize the current index

  // Function to update the carousel overview based on the current index
  const updateOverview = (index) => {
    const currentNews = news[index];
    carouselOverview.innerHTML = `
      <div class="top_overview">
        <div>
            <span>${currentNews.publishedAt} &#8226;</span>
            <span>By ${currentNews.author}</span>
        </div>
        <div>TECHNOLOGY</div>
      </div>
      <h1>${currentNews.title}</h1>
      <p>${currentNews.description}</p>
      <div class="carousel_navigation flex">
        <ul class="navigation flex">
            <li></li>
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
    `;
  };

  // Initialize the carousel overview
  updateOverview(currentIndex);

  // Event listener for scrolling or other interactions that change the current index
  sliderEl.addEventListener('scroll', () => {
    // Calculate the current index based on slider position
    const cardWidth = document.querySelector(".carousel_card").offsetWidth;
    currentIndex = Math.round(sliderEl.scrollLeft / cardWidth);

    // Update the carousel overview based on the current index
    updateOverview(currentIndex);
  });

  // Rest of your code for displaying carousel cards
  sliderEl.innerHTML = '';
  news.slice(0, size).forEach(news => {
    sliderEl.innerHTML += `
      <div class="carousel_card">
        <img src="${news.urlToImage}" alt="" class="cover_img" draggable="false">
      </div>
    `;
  });
};


// Function to display side news
const displaySideNews = (news) => {
  const sideNews = document.querySelector(".right_news");
  sideNews.innerHTML = ''; 
  const size = 6; 

  news.slice(0, size).forEach((newsItem, index) => {
    const newsCard = document.createElement('div');
    newsCard.className = "right_news_item border_bottom";
    // newsCard.id = "each_news";

    newsCard.innerHTML = `
      <img src="${newsItem.urlToImage}" alt="">
      <h3 class="bg_text">${newsItem.title}</h3>
      <p class="md_text">${newsItem.description}</p>
      <span>${newsItem.publishedAt} &#8226;</span>
      <span>By ${newsItem.author}</span>
    `;

    sideNews.appendChild(newsCard);
  });
}

// Function to display side news
const displayBottomNews = (news) => {
  const bottomNews = document.querySelector(".bottom_news");
  const size = 2;

  news.slice(0, size).forEach(news => {
    bottomNews.innerHTML += `
      <div class="bottom_news_content" id="each_news">
        <h3 class="bg_text">${news.title}</h3>
        <p class="md_text">${news.description}</p>
      </div>
    `
  })
  
}

const APIURL = "https://newsapi.org/v2/everything?q=-sex"

fetch(APIURL, {
  method: 'GET',
  headers: {
      'X-Api-Key': '198d6676e82741a5b83c7db74ae51e0a'
  }
})
.then(res => res.json())
.then(data => {
  const { articles } = data
  displayNews(articles);

})
.catch(err => console.error("Error fetching data:", err))

function displayNews(news) {
    displayTopHeadlines(news);
    displayBottomNews(news);
    displaySideNews(news);

  const newsElements = document.querySelectorAll('#each_news');
  newsElements.forEach((element, index) => {
    element.addEventListener('click', () => {
      displayDetailsPage(newsData[index]);
    });
  });
}

// Function to filter by category 
const categorySelector = document.querySelector('.categories');

categorySelector.addEventListener('change', () => {
  const selectedCategory = categorySelector.value;
  const filteredNews = newsData.filter((news) => news.category === selectedCategory);
  displayNews(filteredNews);
});

// Function to filter based on search query
const searchInput = document.querySelector('.search_input');

searchInput.addEventListener('input', () => {
  const searchQuery = searchInput.value.toLowerCase();
  const filteredNews = newsData.filter((news) =>
    news.title.toLowerCase().includes(searchQuery)
  );
  displayNews(filteredNews);
});

// Function to open news page
function displayDetailsPage(news) {
  const detailsPage = window.open('./selected-news.html');

  detailsPage.onload = function () {
    detailsPage.document.getElementById('newsImage').src = news.urlToImage;
    detailsPage.document.getElementById('newsTitle').textContent = news.title;
    detailsPage.document.getElementById('newsAuthor').textContent = `By ${news.author}`;
    detailsPage.document.getElementById('newsDate').textContent = news.publishedAt;
    detailsPage.document.getElementById('newsContent').textContent = news.content;

    const readMoreButton = detailsPage.document.querySelector('.read_more');
    readMoreButton.href = news.url;
  };
}

const sliderEl = document.querySelector(".slider");
const carouselBtn = document.querySelectorAll(".carousel_btn div");
const navigationItems = document.querySelectorAll(".navigation li");
const carouselCards = document.querySelectorAll(".carousel_card");
let currentIndex = 0;

// Function to update the carousel to the given index
function updateCarousel(index) {
  const carouselCards = document.querySelectorAll(".carousel_card");
  const cardWidth = carouselCards[0].offsetWidth;
  requestAnimationFrame(() => {
    sliderEl.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    currentIndex = index;
    updateNavigation(index);
  });
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
  const carouselCards = document.querySelectorAll(".carousel_card");
    const cardWidth = carouselCards[0].offsetWidth;
    const newIndex = infiniteScroll(
      Math.round(sliderEl.scrollLeft / cardWidth)
    );
    updateCarousel(newIndex);
};

const scrollDefault = () => {
  isDragging = false;
  sliderEl.style.scrollBehavior = "smooth";
};

// Logic to handle infinite scrolling by hand
const wrapScroll = () => {
  const maxScrollLeft = cardWidth * (carouselCards.length - 1);
  if (sliderEl.scrollLeft === 0) {
    // User scrolled to the beginning, wrap to the end
    sliderEl.scrollLeft = maxScrollLeft;
  } else if (sliderEl.scrollLeft === maxScrollLeft + cardWidth) {
    // User scrolled to the end, wrap to the beginning
    sliderEl.scrollLeft = cardWidth;
  }
};

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