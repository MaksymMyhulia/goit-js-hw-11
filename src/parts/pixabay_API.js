import axios, { Axios } from "axios";

axios.defaults.baseURL = "https://pixabay.com/api/";
const API_KEY = "34429700-a5059cc9453f6d8a6aa28d125";

export class Pixabay {
    #page = 1;
    #per_page = 40;
    #query = "";
    #totalPages = 0;

    async getPhotos () {
        const params = {
          page: this.#page,
          q: this.#query,
          image_type: "photo",
          orientation: "horizontal",
          safesearch: true,
          per_page: this.#per_page,
        }

        const key = `?key=${API_KEY}`;

        const { data } = await axios.get(key, { params, });
        return data;
    }

    get query() {
        this.#query;
    }

    set query(value) {
        this.#query = value;
    }

    incrementPage() {
        this.#page += 1;
    }

    resetPage() {
        this.#page = 1;
    }

    setTotal(total) {
        this.#totalPages = total;
    }

    hasMorePhotos() {
        return this.#page < Math.ceil(this.#totalPages / this.#per_page)
    }

}