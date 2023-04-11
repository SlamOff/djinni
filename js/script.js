const CONSTANTS = {
    openedText: 'opened',
    expanded: 'expanded',
    clicked: 'clicked',
    visible: 'visible',
    showLess: 'Show less...',
    showMore: 'Show more...',
    themeLight: 'light',
    themeDark: 'dark',
    limit: 4
}

window.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('btn-mobile-btn');
    const themeBtn = document.getElementById('theme');
    const gallery = document.getElementById('gallery');
    const header = document.getElementById('header');
    let currentPage = 1;
    let isFetching = false;
    let hasMorePhotos = true;

    const isOverflown = element => {
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    };
    
    const showMoreText = btn => {
        const isToggled = btn.classList.contains(CONSTANTS.clicked);
        const parent = btn.parentElement;

        const modifyElements = (action, text) => {
            btn.classList[action](CONSTANTS.clicked);
            btn.textContent = text;
            btn.previousElementSibling.classList[action](CONSTANTS.openedText);
            parent.classList[action](CONSTANTS.expanded);
        }

        isToggled ? modifyElements('remove', CONSTANTS.showMore) :  modifyElements('add', CONSTANTS.showLess);
    };

    themeBtn.addEventListener('click', e => {
        const $this = e.currentTarget;
        const currentTheme = $this.dataset.theme;
        if(currentTheme == CONSTANTS.themeDark) {
            $this.dataset.theme = CONSTANTS.themeLight;
            document.body.classList.remove(CONSTANTS.themeDark);
        } else {
            document.body.classList.add(CONSTANTS.themeDark);
            $this.dataset.theme = CONSTANTS.themeDark;
        }
    });

    const generateGalleryMarkup = (data, index) => {
        const { url, download_url, author } = data;
        const shortText = 'Here goes some sample, example text that is relatively short.';
        const longText = 'And here full text doesn’t fit, and at the very end of it we should show a truncation logics. And here full text doesn’t fit, and at the very end of it we should show a truncation logics.';

        return `<div class="col-md-6">
                    <div class="gallery-wrapper">
                        <div class="gallery-img">
                            <a href="${url}" target="_blank"><img src="${download_url}" alt=""></a>
                        </div>
                        <div class="gallery-info">
                            <h2 class="main-subtitle">${author}</h2>
                            <p>${index % 2 ? longText : shortText}</p>
                            <span class="show-more ${index % 2 ? 'visible': ''}">Show more...</span>
                        </div>
                        <div class="gallery-action">
                            <button class="btn-main">Save to collection</button>
                            <button class="btn-secondary">Share</button>
                        </div>
                    </div>
                </div>`;
    };

    const fetchData = async () => {
        isFetching = true;
        let response = await fetch(`https://picsum.photos/v2/list?page=${currentPage}&limit=4`);
        let data = await response.json();
        isFetching = false;

        if (data.length === 0) {
            hasMorePhotos = false;
            return;
        }

        data.forEach((el, i) => {
            gallery.innerHTML += generateGalleryMarkup(el, i);
            const showMoreBtn = document.getElementsByClassName('show-more');

            if (isOverflown(showMoreBtn[i].previousElementSibling)) {
                showMoreBtn[i].classList.add(CONSTANTS.visible);
            }
        });

        currentPage++;
    };

    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('show-more') ) {
            showMoreText(e.target);
        }
    });

    fetchData();

    window.addEventListener('scroll', () => {
        if (isFetching || !hasMorePhotos) {
            return;
        }
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            fetchData();
        }
    });

    mobileBtn.addEventListener('click', e => {
        const $this = e.currentTarget;
        $this.querySelector('.sandwich').classList.toggle('active');
        header.classList.toggle('visible');
    });
});