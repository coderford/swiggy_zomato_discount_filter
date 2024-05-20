// ==UserScript==
// @name         Swiggy & Zomato - Discount Filter
// @namespace    http://tampermonkey.net/
// @version      2024-05-20
// @description  On Swiggy and Zomato, allows you to filter restaurants by minimum discount offered
// @author       coderford
// @license      GPL-3.0-or-later
// @copyright    2024, coderford (https://github.com/coderford)
// @match        https://www.swiggy.com/*
// @match        https://www.zomato.com/*
// @icon         https://res.cloudinary.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

/*
    Copyright (C) 2024, coderford (https://github.com/coderford)
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

(function() {
    'use strict';

    var filterKeywords = [
        'cake',
        'donut',
    ];

    var getRestaurantGridCards = function() {
        var prefix = 'styled__StyledRestaurantGridCard';
        var gridCards = document.querySelectorAll(`[class^="${prefix}"]`);
        return gridCards;
    };

    var filterByMinDiscount = function(gridCards, minDiscount=50) {
        var regex = /(\d+)% OFF UPTO/;
        var filteredCnt = 0;
        for (var i = 0; i < gridCards.length; i++) {
            var card = gridCards[i];
            var discountPercent = 0;
            var match = card.textContent.match(regex);
            if (match) {
                discountPercent = match[1];
            }
            if (discountPercent < minDiscount) {
                hideCard(card);
                filteredCnt += 1;
            }
        }
        return filteredCnt;
    };

    var getRestaurantTitle = function(gridCard) {
        var regex = /alt="([^"]+)"/;
        var match = gridCard.outerHTML.match(regex);
        if (match) {
            return match[1];
        }
        return "";
    };

    var filterByKeywords = function(gridCards) {
        var filteredCnt = 0;
        for (var i = 0; i < gridCards.length; i++) {
            var card = gridCards[i];
            var restaurantTitle = getRestaurantTitle(card);
            for (var j = 0; j < filterKeywords.length; j++) {
                var kw = filterKeywords[j];
                if (restaurantTitle.toLowerCase().indexOf(kw) !== -1) {
                    hideCard(card);
                    filteredCnt += 1;
                    break;
                }
            }

        }
        return filteredCnt;
    };

    var removeDuplicates = function(gridCards) {
        // Dedupe restaurants based on textContent
        var hiddenCnt = 0;
        gridCards = [...new Set(gridCards)];
        const seenTextContent = new Set();

        // Filter the elements based on their textContent
        gridCards.forEach(element => {
            const text = element.textContent;
            if (seenTextContent.has(text)) {
                // Duplicate found, hide this element
                hideCard(element);
                hiddenCnt += 1;
            } else {
                // New textContent, add to the Set
                seenTextContent.add(text);
            }
        });
        return hiddenCnt;
    };

    var hideCard = function(element) {
        if (element && element.parentNode && element.parentNode.parentNode) {
            var grandparent = element.parentNode.parentNode;
            grandparent.style.display = 'none';
        }
    };

    var runFilter = function() {
        var gridCards = getRestaurantGridCards();
        var numCards = gridCards.length;
        var filteredCntDiscount = filterByMinDiscount(gridCards, 50);
        // console.log('Filtered ' + filteredCntDiscount + '/' + gridCards.length + ' restaurants by discount');
        var filteredCntKeywords = filterByKeywords(gridCards);
        // console.log('Filtered ' + filteredCntKeywords + '/' + gridCards.length + ' restaurants by keywords');

        var dupeHiddenCnt = removeDuplicates(gridCards);
        // console.log('Removed ' + dupeHiddenCnt + ' duplicates');
    };

    var runShowMore = function(stopThreshold=100) {
        var gridCards = getRestaurantGridCards();
        var prefix = 'RestaurantList__ShowMoreContainer';
        if (gridCards.length < stopThreshold) {
            var showMoreButton = document.querySelector(`[class^="${prefix}"]`);
            showMoreButton.click();
        }
    };

    var regex = /alt="([^"]+)"/;
    setInterval(runFilter, 300);
    setInterval(runShowMore, 200);

})();