import './css/styles.css';
import ImageApiService from './image-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Spinner from './loader';

const refs = {
  form: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  main: document.querySelector('main'),
};

const imageApiService = new ImageApiService();
const spinner = new Spinner()

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  imageApiService.query = event.currentTarget.elements.searchQuery.value.trim();
  imageApiService.totalItems = 0;

  spinner.show();

  if (imageApiService.query === '') {
    Notify.failure('Search field should not be empty');
    clearGallery();
    refs.loadMoreBtn.classList.remove('visible');
    return;
  }

  imageApiService.resetPage();
  try {
    const { hits: images, unavailable } = await imageApiService.fetchImages();

    if (images.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      spinner.hide();
      clearGallery();
      refs.loadMoreBtn.classList.remove('visible');
      return;
    }
    spinner.hide();
    clearGallery();
    appendGalleryMarkup(images);
    if (unavailable) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.remove('visible');
      return;
    }
    refs.loadMoreBtn.classList.add('visible');
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  spinner.show();
  try {
    const { hits: images, unavailable } = await imageApiService.fetchImages();
spinner.hide();
    appendGalleryMarkup(images);
    if (unavailable) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.remove('visible');
      return;
    }
  } catch (error) {
    console.log(error);
  }
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
