// Wrap the code inside an event listener
document.addEventListener("DOMContentLoaded", function() {
    const eventNote = document.getElementById("note_button");
    document.getElementById("filter_btn").addEventListener("click", () => {

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTabId = tabs[0].id;
            const currentUrl = tabs[0].url;
          
            if (!currentUrl.includes('amazon.')) {
                eventNote.textContent = "You must be on an Amazon website.";
            } else if (!currentUrl.includes('/s?k=')) {
                eventNote.textContent = "Please search for a product on Amazon first.";
            } else {
                eventNote.textContent = "";
              const urlSearchParams = new URLSearchParams(currentUrl.split('?')[1]);
              const searchParam = urlSearchParams.get('k');
              const existingFilters = urlSearchParams.toString().replace(`k=${searchParam}&`, '');
          
              const countryCodes = {
                'com.br': 'A1ZZFT5FULY4LN', // Brazil
                'com': 'ATVPDKIKX0DER',     // United States
                'ca': 'A3DWYIK6Y9EEQB',     // Canada
                'fr': 'A1X6FK5RDHNB96',     // France
                'de': 'A3JWKAKR8XB7XF',     // Germany
                'co.jp': 'AN1VRQENFRJN5',   // Japan
                'co.uk': 'A3P5ROKL5A1OLE',   // United Kingdom
                'in': 'A21TJRUUN4KGV'      // India
                // Add more country codes as needed
              };
          
              const hostname = new URL(currentUrl).hostname;
              const hnArr = hostname.split('.');
              const domain = hnArr.slice(Math.floor(hnArr.length / 2) * -1).join('.');
              const countryCode = countryCodes[domain] || 'A1ZZFT5FULY4LN'; // Default to Brazil
          
              const newFilters = `rh=p_6%3A${countryCode}`;
              const newUrl = `https://www.amazon.${domain}/s?k=${searchParam}&${existingFilters}&${newFilters}`;
              chrome.tabs.update(currentTabId, { url: newUrl });
            }
          });
        
    });
});