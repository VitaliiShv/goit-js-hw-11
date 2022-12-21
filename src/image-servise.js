import axios from 'axios';

const API_KEY = '32142793-94210b2a4022a2b4f7ec6615b';
const BASE_URL = 'https://pixabay.com/api';

export default class ImageApiServise {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.total = 0;
  }

  // fetchImages() {
  //   const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;

  //   return fetch(url).then(response =>
  //     response.json().then(({ hits, totalHits }) => {
  //       this.incrementPage();
  //       let unavailable = (this.total += hits.length) > totalHits;

  //       return { hits, unavailable };
  //     })
  //   );
  // }

  async fetchImages() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;

    const {
      data: { hits, totalHits },
    } = await axios.get(url);

    this.incrementPage();
    let unavailable = (this.total += hits.length) > totalHits;
    return { hits, unavailable };
  }

  get totalItems() {
    return this.total;
  }

  set totalItems(updtdTotal) {
    this.total = updtdTotal;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
