var dataService = {
    username: "",
    password: "",
    authenticate: function (onAuthenticate) {
        var url = "URL for token";
        var response = new XMLHttpRequest();
        response.open('POST', url, true);
        response.setRequestHeader('Authorization', 'Basic ' + btoa(unescape(encodeURIComponent(this.username + ':' + this.password))));
        response.setRequestHeader("Content-Type", "application/json");
        response.setRequestHeader("Accept", "application/json");
        response.onreadystatechange = function() {
            if (response.readyState == 4 && response.status == 200) {
                var responseParse = JSON.parse(response.responseText);
                token = responseParse.Token;
                localStorage.setItem("APItoken", token);
                if(onAuthenticate) {
                    onAuthenticate();
                }
            }
        }
        response.send(null);
    },
    getCustomers: function (onGetCustomers) {
        var url = "URL for data";
        var response = new XMLHttpRequest();
        var tokenId =  localStorage.getItem("APItoken");
        response.open('GET', url, true);
        response.setRequestHeader('Authorization', 'Bearer ' + tokenId);
        response.setRequestHeader("Content-Type", "application/json");
        response.setRequestHeader("Accept", "application/json");
        response.onreadystatechange = function() {
            if (response.readyState == 4 && response.status == 200) {
                var data = JSON.parse(response.responseText);
                var customers = [];
                for (var i = 0; i < data.value.length; i++) {
                    let customer = new Customer(data.value[i].Id, data.value[i].Name, data.value[i].Address1, data.value[i].Address2, data.value[i].Address3,
                                                data.value[i].Town, data.value[i].County, data.value[i].PostCode, data.value[i].CountryCode, data.value[i].PhoneNumber);
                    customers.push(customer);
                }
                onGetCustomers(customers);
            }
        }
        response.send(null);
    },

    getPersons: function (onGetPersons) {
        var url = "URL for Persons data";
        var response = new XMLHttpRequest();
        var tokenId =  localStorage.getItem("APItoken");
        response.open('GET', url, true);
        response.setRequestHeader('Authorization', 'Bearer ' + tokenId);
        response.setRequestHeader("Content-Type", "application/json");
        response.setRequestHeader("Accept", "application/json");
        response.onreadystatechange = function() {
            if (response.readyState == 4 && response.status == 200) {
                var data = JSON.parse(response.responseText);
                var persons = [];
                for (var i = 0; i < data.value.length; i++) {
                    let person = new CustomerPerson(data.value[i].CustomerId, data.value[i].Title, data.value[i].FullName, data.value[i].Role);
                    persons.push(person);
                }
                onGetPersons(persons);
            }
        }
        response.send(null);
    },

    getEquipment: function (onGetEquipment) {
        var url = "URL for Equipment data";
        var response = new XMLHttpRequest();
        var tokenId =  localStorage.getItem("APItoken");
        response.open('GET', url, true);
        response.setRequestHeader('Authorization', 'Bearer ' + tokenId);
        response.setRequestHeader("Content-Type", "application/json");
        response.setRequestHeader("Accept", "application/json");
        response.onreadystatechange = function() {
            if (response.readyState == 4 && response.status == 200) {
                var data = JSON.parse(response.responseText);
                var equipments = [];
                for (var i = 0; i < data.value.length; i++) {
                    let equipment = new Equipment(data.value[i].CustomerId, data.value[i].SerialNumber, data.value[i].Description);
                    equipments.push(equipment);
                }
                onGetEquipment(equipments);
            }
        }
        response.send(null);
    }
}

var renderer = {

    customerId: "",
    contentBox: document.getElementById("content"),

    renderCustomersList: function (customers) {
        renderer.contentBox.innerHTML = "";

        for (var k = 0; k < customers.length; k++) {

            var div = document.createElement("div");
            div.className = "row list";
            div.id = "id-" + customers[k].Id;
            div.style.cursor = "pointer";
            div.addEventListener("click", function (event) {
                customerId = this.id.match(/\d/g).join("");
                dataService.getCustomers(renderer.renderCustomerDetails);
            });

            var divId = document.createElement("div");
            divId.innerHTML = "<h4>" + customers[k].Id + " | " + customers[k].Name + "</h4>";
            div.appendChild(divId);
            renderer.contentBox.appendChild(div);
            document.getElementById("title").innerHTML = "<h1>Customers</h1>"
        }
    },

    renderCustomerDetails: function (customers) {

        renderer.contentBox.innerHTML = "";

        function replaceNull (comma, element) {
            if (element == null) {
                return "";
            } else {
                return comma + element;
            }
        }

        for (var j = 0; j < customers.length; j++) {
            if (customers[j].Id == this.customerId) {

                var div = document.createElement("div");
                div.className = "row";
                div.id = "id-" + customers[j].Id;
    
                var divAdressrow1 = document.createElement("p");
                divAdressrow1.innerHTML = "<span class = 'text-primary text-uppercase'>Adress: </span>" + customers[j].Address1 + replaceNull(", ", customers[j].Address2) + replaceNull(", ", customers[j].Address3) + replaceNull(", ", customers[j].Town) + replaceNull(", ", customers[j].County) + ", " + customers[j].CountryCode + ", " + customers[j].PostCode;;
                div.appendChild(divAdressrow1);
    
                var divPhone = document.createElement("p");
                divPhone.innerHTML = "<span class = 'text-primary text-uppercase'>Phone Number: </span>" + customers[j].PhoneNumber;
                div.appendChild(divPhone);
    
                renderer.contentBox.appendChild(div);
    
                document.getElementById("title").innerHTML = "<h1><a href='#' onclick='dataService.getCustomers(renderer.renderCustomersList)'><span class='glyphicon glyphicon-home'></span></a> | " + "<span class = 'text-uppercase'>" + customers[j].Name + "</span></h1>";
            }
        }
        dataService.getPersons(renderer.renderCustomerPersons);
        
    },

    renderCustomerPersons: function (persons) {

        for (var j = 0; j < persons.length; j++) {

            if (persons[j].CustomerId == this.customerId) {
                var div = document.createElement("div");
                div.className = "row";
    
                var divTitle = document.createElement("p");
                divTitle.innerHTML = "<span class = 'text-primary text-uppercase'>Representative:</span>";
                div.appendChild(divTitle);
    
                var divId = document.createElement("p");
                divId.innerHTML = persons[j].Title + ". " + persons[j].FullName + ", " + persons[j].Role;
                div.appendChild(divId);
    
                renderer.contentBox.appendChild(div);
            } 
        }
        dataService.getEquipment(renderer.renderCustomerEquipment);
    },

    renderCustomerEquipment: function (equipments) {

        var div = document.createElement("div");
        div.className = "row";
        var divTitle = document.createElement("p");
        divTitle.innerHTML = "<span class = 'text-primary text-uppercase'>Equipment:</span>";
        div.appendChild(divTitle);

        for (var j = 0; j < equipments.length; j++) {
            if (equipments[j].CustomerId == this.customerId) {
                
                var divId = document.createElement("p");
                divId.innerHTML = equipments[j].Description + ", " + equipments[j].SerialNumber;
                div.appendChild(divId);  
            } 
        }

        renderer.contentBox.appendChild(div);
    }
}

function Customer (id, name, address1, address2, address3, town, county, postcode, countrycode, phonenumber) {
    this.Id = id; 
    this.Name = name;
    this.Address1 = address1;
    this.Address2 = address2;
    this.Address3 = address3;
    this.Town = town;
    this.County = county;
    this.PostCode = postcode;
    this.CountryCode = countrycode;
    this.PhoneNumber = phonenumber;
}

function CustomerPerson (customerid, title, fullname, role) {
    this.CustomerId = customerid;
    this.Title = title; 
    this.FullName = fullname;
    this.Role = role;
}

function Equipment (customerid, serialnumber, description) {
    this.CustomerId = customerid;
    this.SerialNumber = serialnumber; 
    this.Description = description;
}
