let counter=1;
let filterB = document.querySelector("#filter").style.display = "none";
let showAllB = document.querySelector("#showAllButton").style.display = "none";
let errorMessageDiv = document.querySelector('.error');

function apiCall(title,index)
{

  errorMessageDiv.style.display="none"
  axios.get("https://www.omdbapi.com/?apikey=f1da2140&s="+title+"&page="+index)
  .then((response)=>
  {

    console.log(response);


    let movieArr = response.data.Search;
    let movieOut = document.createElement('div');
    movieOut.classList.add("mov-container");

    //showAll(response);
    let responseFail = response.data.Response;
    if(responseFail!=="True")
    {
      errorMessageDiv.style.display="block"
      return;

    }

    let totalResults = response.data.totalResults;
    let totalResultsInt = parseInt(totalResults,10);
    if(totalResultsInt <50)
    {
      let showAllB = document.querySelector("#showAllButton").style.display = "block";
    }

    //movieOut.classlist.add("movie-container")
    $.each(movieArr,(index1, movie) =>
  {
    // movieOut+= `
    //   <div class="col-md-3 card">
    //     <h5 class="card-title">${movie.Title}</h5>
    //   <img class="card-img-top" src="${movie.Poster}">
    //   </div>
    //   `;

    let startYear = document.querySelector("#start-date").value;
    console.log(startYear);

    let endYear = document.querySelector("#end-date").value;
    console.log(endYear);

    if (startYear === "") {
      startYear = 0;
    }
    if(endYear === "") {
      endYear = 2025;
    }

    console.log(endYear);

    if(parseInt(movie.Year, 10) >= parseInt(startYear, 10) && parseInt(movie.Year, 10) <= parseInt(endYear, 10)) {


    //movieOut1.classList.add("w-200");
    let movieOut1 = document.createElement('div');
    movieOut1.classList.add("col-md-2");
    movieOut1.classList.add("card");



    let movieOut1Img = document.createElement('img');
    movieOut1Img.classList.add('card-img');
    if(movie.Poster === "N/A")
    {
      movieOut1Img.src = ".\\images\\no-poster-available.jpg"
    }
    else
    {
      movieOut1Img.src = movie.Poster;
    }
    movieOut1Img.alt = movie.title;

    let cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add("card-body");

    let movieOut1Title = document.createElement('h5');
    movieOut1Title.classList.add('card-title');
    movieOut1Title.innerHTML = movie.Title;

    let movieIndvButton = document.createElement('button');
    movieIndvButton.href = "#";
    movieIndvButton.classList.add("btn", "btn-danger");
    movieIndvButton.innerHTML = "Show More"
    movieIndvButton.addEventListener('click',(movieObj) =>
     {
       hideMovies();
      let movie1 = getMovie(movie.imdbID);
      //console.log(movie1);
      //render(movie1);
      //hideMovies();

    });

    movieOut1.appendChild(movieOut1Img);
    movieOut1.appendChild(movieOut1Title);
    cardBodyDiv.appendChild(movieOut1Title);
    cardBodyDiv.appendChild(movieIndvButton);
    movieOut1.appendChild(cardBodyDiv);


    movieOut.appendChild(movieOut1);
  }

  });

  let cards = document.querySelector('#movie_ouput')
  cards.appendChild(movieOut);
  })
  .catch((err)=>{

    console.log(err);
  });

}



function showAll(movieObject)
{
  let totalResults = movieObject.data.totalResults;
  let totalResultsInt = parseInt(totalResults,10);
  let numOfPages = totalResultsInt/10;
  let numOfPagesRound = Math.round(numOfPages);
  numOfPagesRound = numOfPagesRound+1;
  let index=1;
  var title = document.querySelector('#query').value;
  while(index<numOfPagesRound)
  {
    apiCall(title, index);
    index=index+1;
  }
  console.log("hi");



}

function hideMovies() {
  let m = document.querySelector(".search-results");
  m.style.display="none"
  let i = document.querySelector(".indv");
  i.style.display='block'
  let filterH = document.querySelector("#filter").style.display = "none";
  let searchH = document.querySelector("#searchid").style.display = "none";

}
function showMovies() {
  let m = document.querySelector(".search-results");
  m.style.display="block"

  let i = document.querySelector(".indv");
  i.style.display='none'
  let filterH = document.querySelector("#filter").style.display = "block";
  let searchH = document.querySelector("#searchid").style.display = "block";
}

function getMovie(movieId) {
  let movieObj = axios.get("https://www.omdbapi.com/?apikey=f1da2140&i="+movieId)
  .then((response)=>
  {
    // let genre = document.createElement("p");
    // genre.textContent = response.data.Genre;
    // let indvPage = document.querySelector(".indv");
    // indvPage.appendChild(genre);
    // console.log(genre);

    render(response);
  });
  return movieObj;
}


function addErrorMessage()
{
  let errorMessage = document.createElement("p");
  errorMessage.textContent = "Too many results. Please try a more specific title name.";

}

function render(movieObject)
{

   let image = document.createElement("img");
   image.src = movieObject.data.Poster;
   let genre = document.createElement("p");
   genre.textContent = "Genre: " + movieObject.data.Genre;
   genre.style.color = "white";
   let year = document.createElement("p");
   year.style.color = "white";
   year.textContent = "Release Date: "+ movieObject.data.Released;
   let director = document.createElement("p");
   director.style.color = "white";
   director.textContent ="Director: "+ movieObject.data.Director
   let plot = document.createElement("p");
   plot.style.color = "white";
   plot.textContent = "Plot: "+movieObject.data.Plot;
   console.log(movieObject);

   let backButton = document.createElement('button');
   backButton.href = "#";
   backButton.classList.add("btn", "btn-danger");
   backButton.innerHTML = "Back"
   backButton.addEventListener('click', (movieObj) => {
     showMovies();
   });

   let indvPage = document.querySelector(".indv");

   let imgDiv  = document.createElement("div");
   imgDiv.classList.add("indv-page-col");


   let detailDiv  = document.createElement("div");
   detailDiv.classList.add("detailDiv");
   detailDiv.classList.add("indv-page-col");


   imgDiv.appendChild(image);
   detailDiv.appendChild(genre);
   detailDiv.appendChild(year);
   detailDiv.appendChild(director);
   detailDiv.appendChild(plot);
   detailDiv.appendChild(backButton);


   indvPage.style.display="inline-flex"
   indvPage.appendChild(imgDiv);
   indvPage.appendChild(detailDiv);

   backButton.addEventListener('click', (movieObj) =>
   {
     indvPage.innerHTML="";
     showMovies();
   });

}

var input = document.querySelector('#form');

let searchTerm;
input.addEventListener('change', function()
{
     searchTerm = document.querySelector('#query').value;
     console.log("inside input event listener");
     console.log(searchTerm);

});

let searchButton = document.querySelector('#search-button');
searchButton.addEventListener('click', function()
 {
  let filterB = document.querySelector("#filter").style.display = "block";
  index=1
  console.log("inside search button event listener");
  console.log(searchTerm);
  let buttons = document.querySelector('.buttons');
  buttons.style.display = 'block'
  let movieOut = document.querySelector('#movie_ouput');
  movieOut.innerHTML = "";
  apiCall(searchTerm,index);
});



let enterFunction = document.querySelector("#form")
enterFunction.addEventListener("keyup",function(event)
{
  if(event.keyCode ===13)
  {
    document.querySelector("#search-button").click();
  }
});




let filterButton = document.querySelector('#filterButton');

filterButton.addEventListener('click', function()
{
  index=1
  console.log("inside search button event listener");
  console.log(searchTerm);
  let buttons = document.querySelector('.buttons');
  buttons.style.display = 'block'
  let movieOut = document.querySelector('#movie_ouput');
  movieOut.innerHTML = "";
  //apiCall(searchTerm,index);
  for(let i=0; i<counter; i++)
  {
    apiCall(searchTerm, index+i);
  }
});

var element = document.querySelector("#nextPageButton")
element.addEventListener("click",()=>
{
  counter=counter+1
  let movie1 = document.querySelector("#movie_ouput")
  movie1.innerHTML = ""
  //index=index+1
  var title = document.querySelector('#query').value;

  apiCall(title,counter)
});


var element2 = document.querySelector('#previousPageButton')
element2.addEventListener("click",()=>
{
  counter=counter-1
  let movie1 = document.querySelector("#movie_ouput")
  movie1.innerHTML = ""
  //index=index-1
  var title = document.querySelector('#query').value;

  apiCall(title,counter)
});

var element3 = document.querySelector('#showAllButton')
element3.addEventListener("click",() =>
{
  var title = document.querySelector('#query').value;
  axios.get("https://www.omdbapi.com/?apikey=f1da2140&s="+title+"&page="+index)
  .then((response)=>
  {
    showAll(response);
  })
});

var element = document.querySelector("#showMoreButton")
element.addEventListener("click",()=>
{
  counter=counter+1;
  var title = document.querySelector('#query').value;
  //index=index+1
  console.log(counter);
  apiCall(title,counter)
  //index=index-1
});
