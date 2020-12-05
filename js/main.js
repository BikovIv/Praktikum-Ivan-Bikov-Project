function renderAllMovies(allMovies){ //only get filtered movies and display them

    $('#card-container').empty();

    var moviesCount = allMovies.results.length;
    var result = '';
    var layout = '';

    $("input[name=layout]:checked").each(function(){
        layout = $(this).val();
    });

    for (var i = 0; i < moviesCount; i++) { 

        var title;
        var image;
        var description;

        title = allMovies.results[i].title;
        image = allMovies.results[i].poster_path;
        description = allMovies.results[i].overview

        if(image == null){
            image = '<img src="images/defaultImage.jpg" class="card-img-top" alt="' + title + '">';
        }else{
            image = '<img src="https://image.tmdb.org/t/p/w500' + image + '" class="card-img-top" alt="'+title+'">'
        }

    if(layout == 'grid'){
        result += '<div class="col mb-4">'+
                    '<div class="card">'+
                    image +
                    '<div class="card-body">'+
                        '<h5 class="card-title">' + title + '</h5>'+
                        '<p class="card-text">' + description + '</p>'+
                    '</div>'+
                    '</div>'+
                '</div>' 
    }else{
        result +=  '<div class="col-md-4">'+
                        image +
                        '</div>'+
                        '<div class="col-md-8">'+
                            '<div class="card-body">'+
                            '<h5 class="card-title">' + title + '</h5>'+
                            '<p class="card-text">' + description + '</p>'+
                            '</div>'+
                        '</div>'
    }
    
    }
    $('#card-container').append(result);
}

function searchMovies (){ //call API to get movies filtered by title, year. - ok
                            //Call API with AJAX to filter movies by genre and order them by rating, name
    var context = this;
    var apiKey = "41335a1a4a7932db66c8546accacbdba";
    var filtered = [];
    var title = document.getElementById("title").value;
    var year = document.getElementById("year-select").value;
    var defaultGenreArray = [];

     $("input:checkbox[name=genre]").each(function(){
        defaultGenreArray.push(parseInt($(this).val()));
    });

    $.ajax({
        method: "GET",
        url: "https://api.themoviedb.org/3/search/movie?api_key="  + apiKey +
                "&language=en-US&query=" + title + "&page=1&include_adult=false&region=europe&" + 
                "year="+ year + "&primary_release_year=" + year,
        dataType: "json"
    }).done(function(response) {
        context.renderAllMovies(filterMoviesByGenre(response, defaultGenreArray));

    }).fail(function() {
        console.log('Error occurred while trying to get movies')
    }).always(function() {
    });
}

function checkGenres(movieGenresArray, selectedGenresArray){ 
    return movieGenresArray.every((val) => selectedGenresArray.includes(val)) 
}

function sort(allMovies, sortItem){

    if(sortItem == 'rating'){
        allMovies.results.sort(function (a, b) {
            return b.popularity - a.popularity;
        });
         
    }else if (sortItem == 'title'){

        allMovies.results.sort(function(a, b) {
            var nameA = a.title.toUpperCase();
            var nameB = b.title.toUpperCase();
            if (nameA < nameB) {
            return -1;
            }
            if (nameA > nameB) {
            return 1;
            }
        
            return 0;
        });
    }else if(sortItem == 'year'){

       allMovies.results.sort(function(a, b) {
        var nameA = a.release_date.toUpperCase();
        var nameB = b.release_date.toUpperCase();
        if (nameA < nameB) {
        return -1;
        }
        if (nameA > nameB) {
        return 1;
        }
    
        return 0;
    });
    }
    return allMovies;
}

function filterMoviesByGenre(allMovies, defaultGenreArray){
    var context = this;
    var filtered;
    var genreArray = [];
    var sortBy = '';

    $("input:checkbox[name=genre]:checked").each(function(){
        genreArray.push(parseInt($(this).val()));
    });

    $("input[name=sortby]:checked").each(function(){
        sortBy = $(this).val();
    });


    if(!genreArray.length){
       // console.log('no selected genres, will use defaut all genres');
         genreArray = defaultGenreArray;
    }

    if(sortBy == '' || sortBy == null){
        sortBy = 'title';
    }
    
    allMovies.results.forEach(element => {
        if(!checkGenres(element.genre_ids,genreArray )){
            allMovies.results.splice(element, 1)
        }
    })

    return sort(allMovies, sortBy);
}

//Genres
function getAllGenres(){
    var context = this;
    var apiKey = "41335a1a4a7932db66c8546accacbdba";
    var genres = [];
  
    $.ajax({
        method: "GET",
        url: "https://api.themoviedb.org/3/genre/movie/list?api_key=" + apiKey + "&language=bg",
        dataType: "json"    
    }).done(function(response) {
        context.renderAllGenres(response);
    }).fail(function() {
        console.log('Error occurred while trying to get genres')
    }).always(function() {
    });
}

function renderAllGenres(allGenres){

    var defaultGenreArray = [];

    $('#genres-container').empty();

    var result = '';

    allGenres.genres.forEach(element => {
        defaultGenreArray.push(element.id);
   
        result += '<div class="form-check form-check-inline">' +
                    '<input name="genre" class="form-check-input" type="checkbox" value="' + element.id + 
                    '" id="check'+ element.id +'">' +
                    '<label class="form-check-label" for="check' + element.id + '">' + element.name + '</label>' +
                    '</div>'
        });
        
    $('#genres-container').append(result);

    return defaultGenreArray;
}