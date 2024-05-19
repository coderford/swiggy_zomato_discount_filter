// ==UserScript==
// @name         Swiggy & Zomato - Discount Filter
// @namespace    http://tampermonkey.net/
// @version      2024-05-19
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


    var hideCard = function(element) {
        if (element && element.parentNode && element.parentNode.parentNode) {
            var grandparent = element.parentNode.parentNode;
            grandparent.style.display = 'none';
        }
    };

    var runFilter = function() {
        var gridCards = getRestaurantGridCards();
        var numCards = gridCards.length;
        var filteredCnt = filterByMinDiscount(gridCards, 50);
        console.log('Filtered ' + filteredCnt + '/' + gridCards.length + ' restaurants');
    };

    var runShowMore = function(stopThreshold=50) {
        var gridCards = getRestaurantGridCards();
        var prefix = 'RestaurantList__ShowMoreContainer';
        if (gridCards.length < stopThreshold) {
            var showMoreButton = document.querySelector(`[class^="${prefix}"]`);
            showMoreButton.click();
        }
    };

    // setTimeout(run, 3000);
    setInterval(runFilter, 200);
    setInterval(runShowMore, 100);

})();