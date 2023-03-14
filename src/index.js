import { ApiPixabay } from './js/apiPixabay';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');
formRef.addEventListener('submit', onFormSubmit);

btnRef.addEventListener('click', onBtnClick);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});

async function onBtnClick(event) {
  apiPixabay.incrementPage();
  const {
    data: { hits, totalHits },
  } = await apiPixabay.getImages();
  renderImages(normalizeResponce(hits));
  onScroll();
  lightbox.refresh();
  if (apiPixabay.page === Math.ceil(totalHits / apiPixabay.per_page)) {
    btnRef.disabled = true;
  } else {
    btnRef.disabled = false;
  }
}

const apiPixabay = new ApiPixabay();

async function onFormSubmit(event) {
  event.preventDefault();
  galleryRef.innerHTML = '';
  btnRef.disabled = true;
  apiPixabay.resetPage();
  const value = event.target.elements.searchQuery.value.trim();
  apiPixabay.setQuery(value);
  const {
    data: { hits, totalHits },
  } = await apiPixabay.getImages();
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);
  if (apiPixabay.page >= Math.ceil(totalHits / apiPixabay.per_page)) {
    btnRef.disabled = true;
  } else {
    btnRef.disabled = false;
  }
  if (!hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  renderImages(normalizeResponce(hits));
  lightbox.refresh();
}

function renderImages(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a href = "${largeImageURL}" class="photo-card">
  <img src="${webformatURL}" alt="${tags}" height="80" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${downloads}</b>
    </p>
  </div>
</a>`
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function normalizeResponce(array) {
  return array.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      };
    }
  );
}

function onScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
