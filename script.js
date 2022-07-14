const searchButton = document.getElementById('search-btn');
const searchField = document.getElementById('search-field');
const loading = document.getElementById('loading');
const listCountries = document.getElementById('list-countries');
const filterAreaBtn = document.getElementById('filter-area');
const areaFilterError = document.getElementById('area-filter-error')
const filterPopulataionBtn = document.getElementById('filter-population');
const populationFilterError = document.getElementById('pop-filter-error')

const apiUrls = {
    nameUrl: "https://restcountries.com/v2/name/",
    allUrl: "https://restcountries.com/v2/all"
}

const reusable = {
    countriesArr: [],
    sortBy: null
}

async function getCountryData(url) {
    try {
        loading.style.display = 'block'
        return await fetch(url).then(response => response.json())
    }
    catch (err) {
        console.log(err)
    }
    finally {
        loading.style.display = 'none'
    }
}

function showCountries(country) {

    listCountries.innerHTML = '';
    let table = document.createElement('table');
    table.setAttribute('class', 'table table-bordered');

    let thead = document.createElement('thead')
    thead.innerHTML = `
    <tr> 
        <th> Flag </th>
        <th value='namea' class='sortable-th'> Name </th>
        <th value='populationa' class='sortable-th'> Population </th>
        <th value='areaa' class='sortable-th'> Area </th>
        <th> capital </th>
        <th> Languages </th> 
        <th> Currency </th> 
    </tr>`

    let tbody = document.createElement('tbody')

    country.forEach(country => {
        let tableRow = document.createElement('tr');
        tableRow.innerHTML = `
        <td>  <img src="${country.flag}" alt="flag" height = 30px>  </td>
        <td> ${country.name} </td>
        <td> ${country.population} </td>
        <td> ${country.area !== undefined ? country.area : 'N/A'} </td>
        <td> ${country.capital !== undefined ? country.capital : 'N/A'} </td>
        <td> ${country.languages?.map(lang => lang.name).join(', ') || 'N/A'} </td> 
        <td> ${country.currencies?.map(currency => currency.name).join(', ') || 'N/A'}  </td>
        `
        tbody.appendChild(tableRow)
    });

    table.appendChild(thead)
    table.appendChild(tbody)
    listCountries.appendChild(table)
}

function sortCountries(countries, sort) {

    let sortedCountries = [];

    switch (sort) {
        case 'namea':
            sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'named':
            sortedCountries = countries.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'populationa':
            sortedCountries = countries.sort((a, b) => a.population - b.population);
            break;
        case 'populationd':
            sortedCountries = countries.sort((a, b) => b.population - a.population);
            break;
        case 'areaa':
            sortedCountries = countries.sort((a, b) => a.area - b.area);
            break;
        case 'aread':
            sortedCountries = countries.sort((a, b) => b.area - a.area);
            break;
    }
    return sortedCountries
}

function handleFilterError(htmlElement) {
    htmlElement.innerText = ''
    htmlElement.innerText = `Error. "To" value must be bigger than "From" value.`
}

// event for showing the searched countries

searchButton.addEventListener('click', async () => {
    let value = searchField.value
    reusable.countriesArr = await getCountryData(apiUrls.nameUrl + value)

    showCountries(reusable.countriesArr)
})

// event for sorting the table;

listCountries.addEventListener('click', (e) => {

    if (e.target.className === 'sortable-th') {

        if (reusable.sortBy === null || reusable.sortBy.charAt(1) !== e.target.attributes[0].value.charAt(1)) {
            reusable.sortBy = e.target.attributes[0].value
        }

        let sortedTable = sortCountries(reusable.countriesArr, reusable.sortBy)
        showCountries(sortedTable)

        if (reusable.sortBy.charAt(reusable.sortBy.length - 1) === 'a') {
            reusable.sortBy = reusable.sortBy.slice(0, -1) + 'd'
        } else {
            reusable.sortBy = reusable.sortBy.slice(0, -1) + 'a'
        }
    }
})

// event for filtering countries by area

filterAreaBtn.addEventListener('click', async () => {
    let fromValue = parseInt(document.getElementById('area-from').value);
    let toValue = parseInt(document.getElementById('area-to').value);

    if (fromValue > toValue) {
        areaFilterError.style.display = 'block';
        handleFilterError(areaFilterError);
    } else {
        areaFilterError.style.display = 'none';
        let data = await getCountryData(apiUrls.allUrl);
    
        reusable.countriesArr = data.filter(country => country.area >= fromValue && country.area <= toValue);
        showCountries(reusable.countriesArr);

    }
})

// event for filtering countries by population

filterPopulataionBtn.addEventListener('click', async () => {

    let fromValue = parseInt(document.getElementById('population-from').value);
    let toValue = parseInt(document.getElementById('population-to').value);

    if (fromValue > toValue) {
        populationFilterError.style.display = 'block'   
        handleFilterError(populationFilterError)
    } else {
        populationFilterError.style.display = 'none'
        
        let data = await getCountryData(apiUrls.allUrl)
        reusable.countriesArr = data.filter(country => country.population >= fromValue && country.population <= toValue)
        showCountries(reusable.countriesArr)
    }
})