/*project resources
Add Event Listener DOM Event Types
https://dbchung3.medium.com/add-event-listener-dom-event-types-6c10a844c9d8

HTML Select Tag – How to Make a Dropdown Menu or Combo List
https://www.freecodecamp.org/news/html-select-tag-how-to-make-a-dropdown-menu-or-combo-list/#:~:text=To%20create%20a%20dropdown%20menu%20with%20the%20select%20tag%2C%20you,the%20data%20to%20the%20server.

Submit a HTML form to Google Sheets
https://github.com/levinunnink/html-form-to-google-sheet

Climate News Feed API
https://rapidapi.com/TheTellusProject/api/climate-news-feed/details

Flexbox Guide
https://css-tricks.com/snippets/css/a-guide-to-flexbox/
*/

//DOM References
const topTitle = document.querySelectorAll('.top-title');
const articleListItem = document.querySelectorAll('.article-list-item');
const dropdown = document.getElementById('my-dropdown');
const urlLinkList = document.getElementById('url-list');


//This is my API request with keys from the rapidAPI website. This request has hard limit of 1000requests/month
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '706ef8c23fmsh7c25aaf2a9386c6p1f4141jsn42cc4f11661f',
		'X-RapidAPI-Host': 'climate-news-feed.p.rapidapi.com'
	}
};


//This is my first fetchResult that will load 3 articles on the page when the page is visited from the mainHTML
let fetchResult = fetch('https://climate-news-feed.p.rapidapi.com/page/1?limit=10', options);

fetchResult.then(response => {
    return response.json();// this part of the code returns another promise that converts the response to JSON so we can see the data
}).then(data => { 
    console.log(data);// we use .then again so that we console.log our promise result so that we can see the data (which is the response - I renamed it as data);
    articlePosts(data); // this function will post the latest top 3 article to the page
}).catch(err => {
        console.log(err)
});

//This is my function that correlates to the first fetchResult; this function returns 3 articles from a list of 10 (limit is set to 10, it's an optional parameter)
const articlePosts = (data) => {
    const articleArray = data.articles.slice(0, 3).map((article) => {
        const date = new Date(article.published);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        return {
            title: article.title,
            date: formattedDate,
            thumbnail: article.thumbnail,
            URL: article.url,
        }
    })

    console.log(articleArray);

    let indexCounter = 0;

    for (const div of articleListItem) {
        div.innerHTML = `<img src="${articleArray[indexCounter].thumbnail}">
        <h4 class="top-title">${articleArray[indexCounter].title}</h4>
        <p>Date Published: ${articleArray[indexCounter].date}</p>
        <a href="${articleArray[indexCounter].URL}">Read</a>`;

        indexCounter += 1;
    }
}


let searchTerm = '';

//This is my second fetchResult(2) that will fulfill the requirements for the lab (searching in an input form and returning information)
let fetchResult2 = fetch(`https://climate-news-feed.p.rapidapi.com/?${searchTerm}limit=40`, options);

fetchResult2.then(response => {
    return response.json();// this part of the code returns another promise that converts the response to JSON so we can see the data
}).then(data => { 
    console.log(data);// we use .then again so that we console.log our promise result so that we can see the data (which is the response - I renamed it as data);
    dropDownFunction(data);
}).catch(err => {
        console.log(err)
});


//this is my dropdown menu fxn for the climate.html; The Guardian is preselected in the dropdown menu so I can use the "change" event type
const dropDownFunction = (data) => {
    dropdown.addEventListener('change', event => {
      const selectedValue = event.target.value;

      urlArray = data.articles.map(article => {
        return {
            source: article.source,
            url: article.url,
        };
    })

      // I used filter method to filter urlArray to only contain articles with the selected source
      const filteredArray = urlArray.filter(article => article.source === selectedValue);
  
      // this will clear the old list
      urlLinkList.innerHTML = '';

      // If the result of fiteredArray is an empty array - meaning no articles for a particular source, I want the user to know 

      if (filteredArray.length === 0) {
        urlLinkList.innerHTML = "Sorry, there are no articles from this source at the moment. Please try again later."//note: it is not "console.log()" here because that will only log to the console and we want the user to see if thus, we have to print to the page via innerHTML
      } else {
        // instead of doing map and if/else I can use the filtererArray with forEach to loop through the filtered array and add links to the list
            filteredArray.forEach(article => { 
                const urlLink = document.createElement('a');
                urlLink.href = article.url //I have to do urlLink.href to make the url a "clickable" link 
                urlLink.innerHTML = article.url;
                const listTag = document.createElement('li');
                listTag.append(urlLink);
                urlLinkList.appendChild(listTag);
            });
        };
    });
}