const submitBtn = document.querySelector("#submit-btn")
const initDate = document.querySelector("#init")
const finalDate = document.querySelector("#final")
const graphs = document.querySelector("#graphs")
const selectCountry = document.querySelector("#select")

//global variables
let diseaseData;
let url2;

//Fetch Country Function to fill the ComboBox
const fetchCountry = ()=> {

  const url = `https://restcountries.com/v3.1/all`;

  fetch(url).then((res)=> {
    if(!res.ok){
      throw new Error("Something went wrong")
    }
      return res.json();

  }).then((newData)=> renderCountry(newData)).catch((err)=> console.log(err))

}

fetchCountry() //fetch country function call

//Filling combobox with this function
const renderCountry = (newData)=> {
  
  newData.forEach((country)=> {
    const {common} =country.name
    selectCountry.innerHTML += `<option value="${common}">${common}</option>`;
  })
}

// Combobox value change event
selectCountry.addEventListener("change", (e)=> {

url2 = `https://disease.sh/v3/covid-19/historical/${e.target.value}?lastdays=all`
console.log(url2)
fetchDisease();
})

//fetching covid-19 informations from API
const  fetchDisease = async()=> {

try {
    const res = await fetch(url2)

    console.log(res)
    if(!res.ok) {        
        renderErrorDisease();      
        throw new Error("something went wrong ")        
    }
    const data = await res.json()
    renderData(data.timeline)
} catch (error) {
    console.log(error) 
}
    
}

const renderData =(data)=> {
    console.log(data)
    diseaseData = data
}

// Submit button click event --> showing the pie charts according to fetched datas about the chosen country
submitBtn.addEventListener("click", (e)=>{
    
    e.preventDefault()

    let init = dateConvert(initDate.value);
    let final = dateConvert(finalDate.value);
    const {cases,deaths,recovered} =diseaseData

   
    if(Object.keys(recovered).indexOf(final) < Object.keys(recovered).indexOf("8/4/21")) {
           recovered[final] = recovered[final]
    } else {
          recovered[final]  = recovered["8/4/21"] 
    }

     const diffCases = cases[final] - cases[init];
   
     const diffDeaths = deaths[final] - deaths[init];

     const diffRecovered = recovered[final] - recovered[init];

     const deathRate = (diffDeaths / deaths[final]) * 100;

     const subdeathRate = ((deaths[final] - diffDeaths) / deaths[final]) * 100;

     const recoveredRate = (diffRecovered / recovered[final]) * 100;
     console.log(recovered[final]);
     console.log(recovered[init]);
     console.log(recoveredRate);

     const subrecoveredRate = (recovered[init] / recovered[final]) * 100;

     const caseRate = (diffCases / cases[final]) * 100;

     const subcaseRate = (cases[init] / cases[final]) * 100;

     var allValues = [
       [deathRate, subdeathRate],
       [recoveredRate, subrecoveredRate],
       [caseRate, subcaseRate],
     ];

     var ultimateColors = [
       ["rgb(56, 75, 126)", "rgb(18, 36, 37)"],
       ["rgb(177, 127, 38)", "rgb(205, 152, 36)"],
       ["rgb(33, 75, 99)", "rgb(79, 129, 102)"],
     ];

     var data = [
       {
         values: allValues[0],
         labels: ["deathRate", "residualdeathRate"],
         type: "pie",
         name: "deathRate",
         marker: {
           colors: ultimateColors[0],
         },
         domain: {
           row: 0,
           column: 0,
         },
         hoverinfo: "label+percent+name",
         textinfo: "rate",
       },
       {
         values: allValues[1],
         labels: ["recoveredRate", "residualrecoveredRate"],
         type: "pie",
         name: "recoveredRate",
         marker: {
           colors: ultimateColors[1],
         },
         domain: {
           row: 0,
           column: 1,
         },
         hoverinfo: "label+percent+name",
         textinfo: "rate",
       },
       {
         values: allValues[2],
         labels: ["caseRate", "residualcaseRate"],
         type: "pie",
         name: "caseRate",
         marker: {
           colors: ultimateColors[2],
         },
         domain: {
           row: 0,
           column: 2,
         },
         hoverinfo: "label+percent+name",
         textinfo: "rate",
       },
     ];

     var layout = {
       height: 600,
       width: 700,
       backgroundColor : "black",
       grid: { rows: 1, columns: 3 },
      //  margin: { "t": 0, "b": 0, "l": "200px", "r": 0 },
     };

     var config = {	responsive: true,
					displaylogo: false}

     Plotly.newPlot("rateGraph", data, layout, config);

})

// Date conversion from input value format to fetched data format
const dateConvert = function(date) {
        let newArr = []
        let arr = date.split("-")
        console.log(arr)
        let temp = arr[0].slice(2,4);
        arr.shift()
        arr.push(temp)
        console.log(arr)
        for(let date of arr) {
            if(Number(date) <10) {
                newArr.push(date[1])
            }else {
                newArr.push(date)
            }
        }  
        return newArr.join("/")

}

// Error Handling Function -> shows error message in html container class
const renderErrorDisease = () => {
   
  setTimeout(()=> {
    const p = document.createElement("p");
     document.querySelector("#general").classList.add("d-none");
     document.querySelector(".container").append(p);
     p.innerText = ` Disease information about this country cannot be founded  `;

  },1000)
  
}






