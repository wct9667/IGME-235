
let key = "mtg7347";  
const storedSearch = localStorage.getItem(key + "prevTerm");

window.onload = (e) => {
document.querySelector("#searchButton").onclick = searchButtonClicked;
if(storedSearch){

    updatedSearch = storedSearch.replace(/["]+/g, '')
    document.querySelector("#searchterm").value = updatedSearch;
}
	
let displayTerm = "";



function saveToBrowser(value){
    localStorage.setItem(key + "prevTerm", JSON.stringify(value));
}


//searches for the cards based on the input fields
   function searchButtonClicked(){
       
       const ScryFallAPI = "https://api.scryfall.com/cards/search?q=";;

       let url = ScryFallAPI;
       let term = document.querySelector("#searchterm").value;
       displayTerm = term;

       term = term.trim();
       saveToBrowser(term);

       term = encodeURIComponent(term);

       if(term.length < 1) return;

       url +=term;
       console.log(url);//

       //add other appendages
       //if the colors check is checked, check for colors checked.......then add them
       let colorCheck = document.querySelector("#checkboxColor");
       if(colorCheck.getElementsByTagName('input')[0].checked){
        url+=checkCheckBoxes(document.querySelector("#colorList"), "c")
       }

       let typeCheck = document.querySelector("#typeCheck");
       if(typeCheck.getElementsByTagName('input')[0].checked){
        url+=checkCheckBoxes(document.querySelector("#typeList"), "t")
       }

       document.querySelector("#searchButton").innerHTML = "<b>Seaching for '" + displayTerm + "'</b>";

       console.log(url);

       getData(url);
   }

   function getData(url){
       let xhr = new XMLHttpRequest();

       xhr.onload = cardsLoaded;

       xhr.onerror = dataError;

       xhr.open("GET", url);
       xhr.send();
   }

   //load the carsd and display - image, may go back and add disply of rulings and other text
   function cardsLoaded(e){
    //delete old cards first
    let content =  document.querySelector("#content");
    content.innerHTML = "";
       let xhr = e.target;

       console.log(xhr.responseText);

       let obj = JSON.parse(xhr.responseText);
       //make sure obj exists
       if(obj.data){
        for(let card of obj.data){
            ///////////////////////something different for double sided cards, they don't appear in search??
            //they don't have a uri like other images, they have faces that have the uri inside
            if(!card["image_uris"]){
                //make somehting to add images into, I guess a div
                let div = document.createElement("div");
                //loop for each face the card has??? found it, card_faces
                for(let face of card.card_faces) {
                    let img = document.createElement("img");
                    img.src = face["image_uris"]["small"]; //get the image link
                    img.dataset.name = card["name"];//get the name, like before (later)
                    img.dataset.normal = face["image_uris"]["normal"];
                    img.onclick = function(){
                        //add it to a larger spot for in depth images
                    }
                    div.appendChild(img);//add to the div
                    div.classList.add("result");
                }
                //add the div to the content
                content.appendChild(div);
            }
    
            //else as it was not a two sided+ card. wonder if there are other problems and cards that might not appear?
            else{
                        let img = document.createElement("img");
                        //access the small image of the card, as to display more (image_uris)(small)
                        //the google extension was very helpful in this step
                         let uri = card["image_uris"];
                         img.src = uri["small"];
                         img.dataset.normal = card["image_uris"]["normal"];
                         img.dataset.name = card["name"]; //gonna get the name as well, may need it
                         content.appendChild(img);
                         img.classList.add("result");              
                }        
            }
          
            document.querySelector("#searchButton").innerHTML = "Search for a card";
        }
        else{
            document.querySelector("#searchButton").innerHTML = "Search for a card";
            document.querySelector("h1").innerHTML = "you DOne Gooofted";
        }

       }

   
   function dataError(e){
       console.log("An error occurred");//
   }

   //checks a checkbox for checks and returns a string of options. scryfall needs a keyword to work, so I will pass it in, as to make the method reusable
   function checkCheckBoxes(checkboxList, keyword) {
    let checkboxes = checkboxList.getElementsByTagName('input'); // get the nodelist of inputs from the checkbox
    let value = ""; //intialize option
    let total = 0; // use a total to check if any were actually checked
    //similar process to the hw extra credit
    for(let i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) {
            if(total > 0) {
                value += " and "; //gonna go with and instead of an or
            }
            value += keyword + ":" + checkboxes[i].value;
            total++;
        }
    }
    if(total > 0) {
        return " " + value;
    } else {
        return "";
    }
   }}
