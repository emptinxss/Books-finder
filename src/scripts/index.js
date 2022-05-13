 import { get } from "lodash";
 import "/src/css/styles.css";
 import cover from "../img/missing.png";
 
 const srcBtn = document.querySelector(".src-button");
 let showResponse = document.querySelector(".response")
 let showError = document.querySelector(".show-error")
 let showDesc = document.querySelector(".show-desc");
 const subject = document.querySelector("#search");
 const loader = document.querySelector(".showbox");
 const imageSize = process.env.SIZE_KEY;  // Dont need this env variable, just for practice purpose, write "S", "M", "L" 



 //function to get data 
 function inputReady() {

  srcBtn.classList.add("click-btn");

  setTimeout( () => {
     srcBtn.classList.remove("click-btn")},150);
  
  getData(subject.value.toLowerCase().trim());
 }

// get data on enter
 subject.onkeydown =  event => {
  if (event.key == 'Enter') {
    inputReady();
  }
};

//get data on click
srcBtn.addEventListener("click", () => {
  inputReady();
    });
       


 function getData(value) {

   //check empty input
     if(value === ""){
         return
     };
     //show loader
     loader.classList.remove("hide");

     //clear showed response
     showResponse.innerHTML = ""; 
     showError.innerHTML = ""; 
     showDesc.innerHTML= "";

     //get data
    axios.get(`http://openlibrary.org/subjects/${value}.json`)
        .then( response => {

          //get response
           let result = get(response, "data.works", "Data non found");
         
            //show error if no books are found
          if(response.data.work_count == 0){
             // hide loader
             loader.classList.add("hide");
             
            showError.innerHTML = `No books found with this subject! Try another subject instead of <span>${subject.value}</span> <br>
            Need help? Click <a class="help-error" href="./help.html">here</a>.`;
            return
          };         

           //map result
            result.map((books) => {
              
              //get title
               const title = get(books, "title", "Title not found");

              //check title
               if(title.length === 0 || title === "" || title == null) {
                title = "Not found"
              };


              //get cover image
               const coverId = get(books, "cover_id", "Image not found");
               const missingImage = new Image();
               missingImage.src = cover;

              //check image
               let urlImage;
               if (coverId) {
                urlImage = `https://covers.openlibrary.org/b/id/${coverId}-${imageSize}.jpg`;
               } else {
                 urlImage = cover;
               };


              //get authors
               let authors = get(books, "authors", "Author not found");
               
              //check authors
                if (Array.isArray(authors)) {
                   if (authors.length <= 4) {
                     authors = authors
                       .map((author) => {
                         return author.name;
                       })
                       .join(", ");
                   } else {
                     authors = `${authors[0].name}, ${authors[1].name}, ${authors[2].name}, ${authors[3].name} and others`;
                   }
                 };

                 if(authors.length === 0) {
                   authors = "Not found"
                 };

                 //get key
                 let key = get(books, "key", "Key not found");
                 
                 // hide loader
                loader.classList.add("hide");

                 //show title authors and image
                 showResponse.innerHTML += `
                   
                            <div class="grid" data-key="${key}">
                                <div class="col">
                                   <div>
                                     <img src=${urlImage} width="180" height="220">
                                   </div>
                                <div class="info">
                                   <h3>${title}</h3>
                                   <p>Author: ${authors}</p>
                                     <button class="description-btn">More info</button>
                                </div> 
                                
                                
                                </div>
                            </div>
                `;
            });  
            //call description function
            getDesription();
        })     
        // show error if response fails
        .catch( error =>  {
            if (error.response.status == 0) {
              // hide loader
              loader.classList.add("hide");

              showError.innerHTML = `Network error! Try again later. <br>
              Need help? Click <a class="help-error" href="./help.html">here</a>.`;

            };
          });
          
 };



function getDesription() {

  const descriptionBtn = document.querySelectorAll(".description-btn")

  descriptionBtn.forEach( buttons => {

    buttons.addEventListener("click", (e) => {
      
      //get data-key attribute div
      let parentKey = e.target.parentElement.parentElement.parentElement;
      

      axios.get(`https://openlibrary.org${parentKey.dataset.key}.json`)
      .then( response => {
        
           let risposta = get(response, "data", "Data non found");
          
            showDesc.classList.remove("hide");
            
           //show description
            showDesc.innerHTML = `
                      <div class="desc-box">
                        <h3>Description</h3>
                          <p>${
                              risposta.description
                              ? risposta.description.value || risposta.description
                              : "No description for this book"
                               }</p>
                               <button class="close">Close</button>
                      </div>
        `;
        closeBtn();
      })
      .catch(error  => {
        console.log(error)
      });
    });
 
  });
};

function closeBtn() {

  const closeButton = document.querySelector(".close");
  
  closeButton.addEventListener("click", () => {
    showDesc.classList.add("hide");
  });
}
