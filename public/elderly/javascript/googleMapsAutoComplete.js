
    let autocomplete;
    function initAutocomplete() {
      address1Field = document.querySelector("#currentAddress");
      autocomplete = new google.maps.places.Autocomplete(address1Field, {
        componentRestrictions: { country: ["sg"] },
        fields: ["address_components", "geometry"],
        types: ["geocode","establishment"],
      });
      address1Field.focus();
    }