// Author: Tarini Srikanth
// Program: Mind Sumo Challenge - Movie Searcher
// Main Java Script File


let counter=1; //counter for the pages. Starts at Page =1

//hiding the neccessary buttons that should only appear after a search. 
let filterB = document.querySelector("#filter").style.display = "none"; 
let showAllB = document.querySelector("#showAllButton").style.display = "none"; 

//getting initial search term (title), error messages for edge cases. 

let searchTerm = document.querySelector('#query').value;
let errorMessageDiv = document.querySelector('.error');
let errorMessageDiv1 = document.querySelector('.error1');


//main function API CAll
function apiCall(title,index)
{

  //initially sets the error messages to none. 
  errorMessageDiv.style.display="none"
  errorMessageDiv1.style.display="none"
  
  
  //calls the API using the parameters, title and index (page number). 
  axios.get("https://www.omdbapi.com/?apikey=f1da2140&s="+title+"&page="+index)
  .then((response)=>
  {

    


    //getting the movieArray, (list of 10 movies)
    //creating a div and adding the movie List to the div
    let movieArr = response.data.Search;
    let movieOut = document.createElement('div');
    movieOut.classList.add("mov-container");

    
    //getting data for error messages
    let responseFail = response.data.Response;
    let responseMessage = response.data.Error;
    //if the response has failed, execute proper error handling
    //as described in the if statements. 
    if(responseFail!=="True")
    {
      if(responseMessage=="Too many results.")
      {
        errorMessageDiv.style.display="block"
        return;
      }
      if(responseMessage=="Movie not found!")
      {
        errorMessageDiv1.style.display="block"
        return;
      }



    }

    // data for the "Show All" button. Gets the total
    //number of results
    let totalResults = response.data.totalResults;
    let totalResultsInt = parseInt(totalResults,10);
    
    //if the number of results is less than 50, 
    //display the SHOW ALL button that 
    //will display all of the movies once clicked. 
    if(totalResultsInt <50)
    {
      let showAllB = document.querySelector("#showAllButton").style.display = "block";
    }

    //iterating through the movie list using a for loop. 
    $.each(movieArr,(index1, movie) =>
  {
    

    //gets the values of the start and end years on the filter input
    let startYear = document.querySelector("#start-date").value;
    

    let endYear = document.querySelector("#end-date").value;
    

    //if no input is added, set the start year to the lowest possible year
    if (startYear === "") {
      startYear = 0;
    }
    //if no input is added, set the end year to a higher than possible year. 
    if(endYear === "") {
      endYear = 2025;
    }

    
    //if the the movie's year falls into the start and end category
    if(parseInt(movie.Year, 10) >= parseInt(startYear, 10) && parseInt(movie.Year, 10) <= parseInt(endYear, 10)) {


    //creating a div for all the movie outputs
    let movieOut1 = document.createElement('div');
    movieOut1.classList.add("col-md-2");
    movieOut1.classList.add("card");



    let movieOut1Img = document.createElement('img');
    //creating an image card for each movie. 
    movieOut1Img.classList.add('card-img');
      
    //if a movie does not already have a Poster,
    //set that movie's image source to equal
    //a predefined image for "no poster available"
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
    //set the text of the movie card to be the title.
    movieOut1Title.innerHTML = movie.Title;
      
      
    //creating a SHOW MORE button for the user
    //to be redirected to a movie's individual page. 

    let movieIndvButton = document.createElement('button');
    movieIndvButton.href = "#";
    movieIndvButton.classList.add("btn", "btn-danger");
    movieIndvButton.innerHTML = "Show More"
    movieIndvButton.addEventListener('click',(movieObj) =>
     {
       //hide the current movies and show the individual movie. 
       hideMovies();
      let movie1 = getMovie(movie.imdbID);

    });

    
    movieOut1.appendChild(movieOut1Img);
    movieOut1.appendChild(movieOut1Title);
    cardBodyDiv.appendChild(movieOut1Title);
    cardBodyDiv.appendChild(movieIndvButton);
    movieOut1.appendChild(cardBodyDiv);
    //adding the cards to the appropriate divs. 


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


//function for when the SHOW ALL button is 
//clicked when there are less than 50 results. 
function showAll(movieObject)
{
  
  //getting the total results and the 
  //number of pages needed
  let totalResults = movieObject.data.totalResults;
  let totalResultsInt = parseInt(totalResults,10);
  let numOfPages = totalResultsInt/10;
  let numOfPagesRound = Math.round(numOfPages);
  
  numOfPagesRound = numOfPagesRound+1;
  let index=1;
  var title = document.querySelector('#query').value;
  //while loop to go until the current 
  //index has exceeded the number of pages
  //calling the API Call function each time
  while(index<numOfPagesRound)
  {
    apiCall(title, index);
    index=index+1;
  }



}


//hides the movies when the individual page is shown
function hideMovies() {
  let m = document.querySelector(".search-results");
  m.style.display="none"
  let i = document.querySelector(".indv");
  i.style.display='block'
  let filterH = document.querySelector("#filter").style.display = "none";
  let searchH = document.querySelector("#searchid").style.display = "none";

}

//function to show the movies again
function showMovies() {
  let m = document.querySelector(".search-results");
  m.style.display="block"

  let i = document.querySelector(".indv");
  i.style.display='none'
  let filterH = document.querySelector("#filter").style.display = "block";
  let searchH = document.querySelector("#searchid").style.display = "block";
}


//function to get more specific detials about the movie
//seperate API Call using IMDB ID instead of calling
//by title. 
function getMovie(movieId)
{
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


//function that gets the specific detials
//that are put on the individual page
//for each movie, once the SHOW MORE button is clicked. 
function render(movieObject)
{

  
   //getting IMAGE, GENRE, YEAR, DIRECTOR, PLOT
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
  

  
   //generating a back button that will display and 
   //return the user back to the original movie page. 
   let backButton = document.createElement('button');
   backButton.href = "#";
   backButton.classList.add("btn", "btn-danger");
   backButton.innerHTML = "Back"
  
   
 

   let indvPage = document.querySelector(".indv");

   let imgDiv  = document.createElement("div");
   imgDiv.classList.add("indv-page-col");


   //adding the cards to the appropriate divs. 
   let detailDiv  = document.createElement("div");
   detailDiv.classList.add("detailDiv");
   detailDiv.classList.add("indv-page-col");
  
   //adding the cards to the appropriate divs. 
   imgDiv.appendChild(image);
   detailDiv.appendChild(genre);
   detailDiv.appendChild(year);
   detailDiv.appendChild(director);
   detailDiv.appendChild(plot);
   detailDiv.appendChild(backButton);
  


   //implementing inline flex to allow for responsive behavior
   indvPage.style.display="inline-flex"
   indvPage.appendChild(imgDiv);
   indvPage.appendChild(detailDiv);
    
   //event listenting for once the back button is clicked. 
   backButton.addEventListener('click', (movieObj) =>
   {
     indvPage.innerHTML=""; 
     showMovies();
   });

}



//adding error messages
function addErrorMessage()
{
  let errorMessage = document.createElement("p");
  errorMessage.textContent = "Too many results. Please try a more specific title name.";

}

var input = document.querySelector('#form');

//event handler for search form
input.addEventListener('change', function()
{
     searchTerm = document.querySelector('#query').value;

     //console.log(searchTerm);

});

let searchButton = document.querySelector('#search-button');
searchButton.addEventListener('click', function()
 {
  counter=1; //each time a search is pressed, the counter/page should be set to 1. 
  
  //showing the filter button
  let filterB = document.querySelector("#filter").style.display = "block";
 
  index=1
  
  //showing the neccessary output that was hidden prior. 
  let buttons = document.querySelector('.buttons');
  buttons.style.display = 'block'
  let movieOut = document.querySelector('#movie_ouput');
  movieOut.innerHTML = "";
  //calling the API Call function
  apiCall(searchTerm,index);
});


//function that clicks "Search" button
//once an enter key is pressed to 
//allow for more flexibility. 
let enterFunction = document.querySelector("#form")
enterFunction.addEventListener("keyup",function(event)
{
  if(event.keyCode ===13)
  {
    document.querySelector("#search-button").click();
  }
});





//event handler for the filter button
let filterButton = document.querySelector('#filterButton');

filterButton.addEventListener('click', function()
{

  index=1
  
  
  //showing the neccessary buttons that were hidden prior. 
  let buttons = document.querySelector('.buttons');
  buttons.style.display = 'block'
  let movieOut = document.querySelector('#movie_ouput');
  movieOut.innerHTML = "";
  
  
  //to allow for the more than 10 movies
  //on the same page to be filtered
  //keep track of the page number
  //that the movie is on, 
  // and have a while loop that
  //goes until that page is reached
  //so that each movie on the page
  //is filtered accordingly. 
  let i=0;
  while(i<counter)
  {
    //console.log(index+i);
    apiCall(searchTerm, index+i);
    i=i+1;
  }
});



//reset button for fitlering reset
let resetButton = document.querySelector('#resetButton');
let movie12 = document.querySelector("#movie_ouput");


resetButton.addEventListener('click', function()
{
  
   //setting the start and end year to none
   let startYear1 = document.querySelector("#start-date");
   let endYear1 = document.querySelector("#end-date");
   startYear1.value="";
   endYear1.value="";
  
   //earsing the previous filter div
   movie12.innerHTML="";
  
   //using a while loop to go through each page
   //until the current page, calling API CALL.
   index=1;
   let i=0;
   while(i<counter)
   {
     //console.log(index+i);
     apiCall(searchTerm,index+i);
     i=i+1;
   }
 });



//event handler for next Page
var element = document.querySelector("#nextPageButton")
element.addEventListener("click",()=>
{
  //adding page counter by 1
  counter=counter+1
  let movie1 = document.querySelector("#movie_ouput")
  //erasing the previous page, and calling API call 
  //on the new page. 
  movie1.innerHTML = ""
  var title = document.querySelector('#query').value;

  apiCall(title,counter)
});



//event handler for the previous Page
var element2 = document.querySelector('#previousPageButton')
element2.addEventListener("click",()=>
{
  //reducing the counter by 1
  counter=counter-1
  let movie1 = document.querySelector("#movie_ouput")
  movie1.innerHTML = ""
  //index=index-1
  var title = document.querySelector('#query').value;

  apiCall(title,counter)
});


//show All button
var element3 = document.querySelector('#showAllButton')
element3.addEventListener("click",() =>
{
  var title = document.querySelector('#query').value;
  //calls the API again on index, until the page total results is reached. 
  axios.get("https://www.omdbapi.com/?apikey=f1da2140&s="+title+"&page="+index)
  .then((response)=>
  {
    showAll(response);

  })
  element3.style.display="none";
});


//showMore button
var element = document.querySelector("#showMoreButton")
element.addEventListener("click",()=>
{
  
  //adding page counter
  counter=counter+1;
  var title = document.querySelector('#query').value;
  //calling API call but not erasing the previous API call. 
  apiCall(title,counter)
});
