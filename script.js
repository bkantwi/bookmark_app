const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Midal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));

// Event listener to close modal outside modal click event
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate form
function validate(nameValue, urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if(!nameValue || !urlValue){
        alert('Please submit values for both fields')
        return false;
    }

    if (!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }

    // If valid
    return true;
}

// Build bookmarks DOM
function buildBookmarks(){
    // build items
    bookmarks.forEach((bookmark)=>{
        // pull name and url
        const {name, url} = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        
        // Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-trash');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?doamin=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch Bookmarks from local storage
function fetchBookmarks(){
    // Get bookmarks from local storage if some are available
    if (localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // create bookmarks array in local storage
        bookmarks = [
            {
                name: 'Property of Bkantwi',
                url: 'https://arktech.netlify.app',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Handle Data From Form
function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://', 'https://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)){
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    // bookmarkForm.requestFullscreen();
    websiteNameEl.focus();
}

// Further Event Listeners
bookmarkForm.addEventListener('submit', storeBookmark)

// On load fetch bookmarks
fetchBookmarks();