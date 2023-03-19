import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { refs } from './parts/refs';
import { Pixabay } from './parts/pixabay_API';
import { createMarkup } from './parts/crearteMarkup';


const modalLightBox = new SimpleLightbox ('.gallery a', {
    captionDelay: 250,
    spiner: true,
})

refs.btnLoadMore.style.visibility = "hidden";

const pix = new Pixabay();

const options = {
    root: null,
    rootMargin: "100px",
    threshold: 1.0,
}


const loadMore = async function(entries, observer) {
    entries.forEach(async entry => {
        if(entry.isIntersection) {
            observer.unobserve(entry.target)
            pix.incrementPage();


            try {
                const { hits } = await pix.getPhotos();
                const markup = createMarkup(hits);
                refs.gallery.insertAdjacentHTML("beforeend", markup);
                
                if (pix.hasMorePhotos){
                    const lastItem = document.querySelector(".gallery a:last-child");
                    observer.observe(lastItem);
                } else {
                    Notify.info(
                        "Sorry, there are no images matching your search query. Please try again."
                    )
                }
            
                modalLightBox.refresh();
            
            } catch (error){
            Notify.failure(error.message, "Sorry, ERROR!");
            console.log(error.message)
            clearPage();
            }
        }
    })
}



const observer = new IntersectionObserver(loadMore, options);

const onSubmitClick = async (e) => {
    e.preventDefault();
    
    const { 
        elements: { searchQuery },
    } = e.target;

    const search_query = searchQuery.value.trim().toLowerCase();
    pix.query = search_query;
    
    
    try {
        const { hits, total } = await pix.getPhotos();
        console.log(hits)
        const markup = createMarkup(hits);
        refs.gallery.insertAdjacentHTML("beforeend", markup);
        pix.setTotal(total);
        Notify.success(`Hooray! We found ${total} images.`);

        if (pix.hasMorePhotos()) {
            const lastItem = document.querySelector(".gallery a:last-child");
            observer.observe(lastItem);
            refs.btnLoadMore.style.visibility = "visible";
        }

        modalLightBox.refresh();
    } catch (error) {
        Notify.failure(error.message, "Sorry, ERROR!");
        console.log(error.message)
        clearPage();
    }
}

refs.form.addEventListener("submit", onSubmitClick);

const onLoadMore = async () => {
    pix.incrementPage();

    if(!pix.hasMorePhotos) {
        refs.btnLoadMore.style.visibility = "hidden";
    }

    try {
      const { hits } = await pix.getPhotos();
      const markup = createMarkup(hits);
      refs.gallery.insertAdjacentHTML("beforeend", markup);

      modalLightBox.refresh();
    } catch (error) {
        Notify.failure(error.message, "Sorry, ERROR!");
        clearPage();
    }
};

refs.btnLoadMore.addEventListener("click", onLoadMore);


function clearPage() {
    pix.resetPage();
    refs.gallery.innerHTML = "";
    refs.btnLoadMore.style.visibility = "hidden"
};




