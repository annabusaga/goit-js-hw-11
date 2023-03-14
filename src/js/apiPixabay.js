import axios from 'axios';
export class ApiPixabay {
  #KEY = '34389298-00d50d9a1bff1d8671ab6cb35';
  #URL = 'https://pixabay.com/api';
  constructor() {
    this.apiPixabay = axios.create({ baseURL: this.#URL });
    this.query = '';
    this.page = 1;
    this.per_page = 40;
  }

  async getImages() {
    return this.apiPixabay.get('/', {
      params: {
        key: this.#KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      },
    });
  }

  setQuery(newQuery) {
    this.query = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
