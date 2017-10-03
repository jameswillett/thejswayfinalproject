const buttonEl = document.getElementById('submitButton');
const submitFormEl = document.createElement('form');
const submitDivEl = document.getElementById('submitDiv')
const contentEl = document.getElementById('content');
submitDivEl.appendChild(submitFormEl);

buttonEl.addEventListener('click', () => {
  buttonEl.disabled = true;

  const authorField = document.createElement('input');
    authorField.className = "link"
    authorField.setAttribute('placeholder','Author');
    authorField.style.width='25%';
    authorField.setAttribute('name','author');
    authorField.setAttribute('required','true');
    submitFormEl.appendChild(authorField);

  const titleField = document.createElement('input');
    titleField.className = 'link';
    titleField.setAttribute('placeholder','Link Title');
    titleField.style.width='25%';
    titleField.setAttribute('name','title');
    titleField.setAttribute('required','true');
    submitFormEl.appendChild(titleField);

  const urlField = document.createElement('input');
    urlField.className = 'link';
    urlField.setAttribute('placeholder','Link URL');
    urlField.style.width='40%';
    urlField.setAttribute('name','url');
    urlField.setAttribute('required','true');
    submitFormEl.appendChild(urlField);

  const linkSubmit = document.createElement('input');
    linkSubmit.setAttribute("class","btn btn-default navbar-btn")
    linkSubmit.setAttribute('type','submit')
    linkSubmit.setAttribute('id','addLink')
    linkSubmit.style.width='10%';
    linkSubmit.style.height='3em';
    linkSubmit.style.backgroundColor = '#66f';
    linkSubmit.style.color = "#fff";

  submitFormEl.appendChild(linkSubmit);

  submitFormEl.addEventListener('submit', function submitFormFunc(e){
    e.preventDefault();
    buttonEl.disabled = false;
    const author = e.target.elements.author.value;
    const title = e.target.elements.title.value;
    const url = e.target.elements.url.value;

    submitFormEl.innerHTML='';
    var urlChecked = '';

    if (  !url.toLowerCase().startsWith("http://") &&
          !url.toLowerCase().startsWith("https://")){
      urlChecked = "http://".concat(url);
    } else {
      urlChecked = url;
    }

    const newLink = {author, title, url:urlChecked, favorite:false};

    fetch(
      "/addlinks",{
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newLink)
      })
      .then(response => response.json())
      .then(result => {
        //console.log(result);
        submitFormEl.removeEventListener('submit', submitFormFunc);
        const successEl = document.createElement('div');
          successEl.setAttribute('class','successEl');
          successEl.textContent = `Added ${title} successfully!!`
          submitDivEl.appendChild(successEl);

        setTimeout(() => {
          submitDivEl.removeChild(successEl);
          //links = links.concat([newLink]);
          contentEl.innerHTML = '';
          getLinks();
        } , 3000);
      })


  });
});

const printLinks = ({id: index, author, title, url, favorite}) => {
  const linkContainer = document.createElement('div');
    linkContainer.setAttribute('class','link');
    contentEl.prepend(linkContainer);//<==

  const deleteMe = document.createElement('a');
    deleteMe.textContent = '✖';
    deleteMe.setAttribute('href','#');
    deleteMe.setAttribute('class','deleteMe');
    linkContainer.appendChild(deleteMe);
    deleteMe.addEventListener('click', e => {
      const r = confirm(`Are you sure you want to delete "${title}"?`);
      if ( r ) {
        fetch("/deletelink",{
          method: "POST",
          body: JSON.stringify({index}),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(result => {
            deleteMe.parentNode.remove();
          })
        }
  })

  const favEl = document.createElement('a');
    if(favorite){
      favEl.textContent = '❤️';
    } else {
      favEl.textContent = '💔';
    }
    favEl.setAttribute('href','#');
    favEl.setAttribute('class','fave');
    linkContainer.appendChild(favEl);
    favEl.addEventListener('click', e => {
      fetch("/favorite",{
        method: "POST",
        body: JSON.stringify({index}),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(result => {
          if(result.favorite){
            favEl.textContent = '❤️';
          } else {
            favEl.textContent = '💔';
          }
      })
    })

  const linkDevEl = document.createElement('div');
    linkDevEl.setAttribute('class','link');
    linkDevEl.style.paddingLeft = '20px'
    linkDevEl.style.paddingTop = '0px'
    linkContainer.appendChild(linkDevEl);

  const linkHeadline = document.createElement('h4');
    linkHeadline.setAttribute('class','linkHeadline')
    linkDevEl.appendChild(linkHeadline);

  const linkTitle = document.createElement('a');
    linkTitle.textContent = title;
    linkTitle.setAttribute('class','linkTitle');
    linkTitle.setAttribute('href', url);
    linkTitle.setAttribute('target','_blank')
    linkHeadline.appendChild(linkTitle);

  const linkUrl = document.createElement('span');
    linkUrl.textContent = url;
    linkUrl.setAttribute('class','linkUrl')
    linkHeadline.appendChild(linkUrl);

  const linkAuthor = document.createElement('span');
    linkAuthor.textContent = `Submitted by ${author}`;
    linkAuthor.setAttribute('class','linkAuthor');
    linkDevEl.appendChild(linkAuthor);
}

const getLinks = () => {
  fetch( "/getlinks",{
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(result => {
      result.map(printLinks)
    })
}

getLinks();
