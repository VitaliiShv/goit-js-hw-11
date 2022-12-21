import './css/styles.css';
import ImageApiServise from './image-servise';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const imageApiServise = new ImageApiServise();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  imageApiServise.query = event.currentTarget.elements.searchQuery.value.trim();
  imageApiServise.totalItems = 0;

  if (imageApiServise.query === '') {
    Notify.failure('Search field should not be empty');
    return;
  }

  imageApiServise.resetPage();
  imageApiServise.fetchImages().then(({ hits: images }) => {
    if (images.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearGallery();
      refs.loadMoreBtn.classList.remove('visible');
      return;
    }
    clearGallery();
    appendGalleryMarkup(images);
    refs.loadMoreBtn.classList.add('visible');
  });
}

function onLoadMore() {
  imageApiServise.fetchImages().then(({ hits: images, unavailable }) => {
    appendGalleryMarkup(images);
    if (unavailable) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.remove('visible');
      return;
    }
  });
}

function appendGalleryMarkup(images) {
  try {
    refs.gallery.insertAdjacentHTML('beforeend', galleryTeamplate(images));
  } catch (error) {
    Notify.failure('Something went wrong(: Please try again');
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function galleryTeamplate(images) {
  return images
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="gallery-item">
            <div class="photo-card">
              <div class="card-thumb">
                <img
                  class="img"
                  src="${webformatURL}"
                  alt="${tags}"
                  loading="lazy"
                />
              </div>
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>
                  <b>${likes}</b>
                </p>
                <p class="info-item">
                  <b>Views</b>
                  <b>${views}</b>
                </p>
                <p class="info-item">
                  <b>Comments</b>
                  <b>${comments}</b>
                </p>
                <p class="info-item">
                  <b>Downloads</b>
                  <b>${downloads}</b>
                </p>
              </div>
            </div>
          </div>`;
    })
    .join('');
}
