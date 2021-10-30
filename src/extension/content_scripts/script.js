var agent = "undefined" !== typeof chrome ? chrome : browser;

/**
 * Collects the eBay purchase history data from the current page and prints-out a report in the given format.
 * 
 * @class
 * @author Eugen Mihailescu
 * @since 1.0
 * 
 * @params {Object=} params - Optional. Report parameters such as sorting field, sorting order,etc.
 */
function QuickReport(params) {
    params = params || {};

    var sortby = params.sortBy || '';
    var customFilter = params.customFilter || '';
    var reverseorder = params.reverseorder || false;

    /**
     * Calculates the date difference between the specified date and "now"
     * 
     * @since 1.0.21
     * @param {Object}
     *            date - The Date object to compare
     * @param {int=}
     *            [sign] - When 1 then the Date is expected to be older than today, otherwise newer. Default 1.
     * @return {int} - Returns the number of days between the Date and today
     */
    function dateDiff(date, sign) {
        if ("undefined" === typeof sign) {
            sign = 1;
        } else if (1 != sign) {
            sign = -1;
        }

        var today = new Date();
        return Math.round(sign * (today - date) / 86400000.0, 1);
    }

    /**
     * Parses the given string as date
     * 
     * @since 1.0.21
     * @param {String}
     *            string - The string to parse
     * @return {Object} - Returns the Date object on success, NaN otherwise
     */
    function dateParse(string) {
        var result = Date.parse(string);
        var today = new Date();
        if (isNaN(result) || Math.abs((today - result) / 86400000.0) > 365) {
            string += " " + today.getFullYear();
            result = Date.parse(string);
        }
        return result;
    }

    /**
     * Get the inner text of a HTML element
     * 
     * @since 1.0
     * @param {Object}
     *            element - The DOM element
     * @param {String}
     *            value - The default value if element is NULL
     * @return {String}
     */
    function getInnerText(element, value) {
        return null !== element ? element.innerText : value;
    }

    /**
     * Get the attribute value of a HTML element
     * 
     * @since 1.0
     * @param {Object}
     *            element - The DOM element
     * @param {string}
     *            name - The attribute name
     * @param {String}
     *            value - The default value if element is NULL
     * @return {String}
     */
    function getAttribute(element, name, value) {
        return null !== element ? element.getAttribute(name) : value;
    }

    /**
     * Get the dataset value of a HTML element
     * 
     * @since 1.0.21
     * @param {Object}
     *            element - The DOM element
     * @param {string}
     *            name - The dataset key name
     * @param {String}
     *            value - The default value if element is NULL
     * @return {String}
     */
    function getDataset(element, name, value) {
        if (!element || "undefined" === typeof element.dataset || "undefined" === typeof element.dataset[name]) {
            if ("undefined" === typeof value) {
                value = null;
            }
            return value;
        }

        return element.dataset[name];
    }

    /**
     * Gather the eBay order information
     * 
     * @since 1.0
     * @return {Array} - Returns an array of purchase history items
     */
    function prepare() {
        // search for Orders list
//mb        var orders = document.querySelectorAll('#orders .result-set-r .order-r');
        var orders = document.querySelectorAll('div.m-order-card');

        if (!orders.length) {
            return false;
        }
        
       
    	console.log(orders.length);
        
        var order, item;
        var data = [];

        // parse the document
        for (order in orders) {
            if (orders.hasOwnProperty(order)) {
                var orderId = orders[order].querySelector('div.m-container-item-layout-row.m-container-item-layout-row__body').getAttribute('data-listing-id');
            	console.log(orderId);
//            	<div class="ph-col__info-orderPackageDetails"><dt>SOLD BY</dt><dd><a href="https://www.ebay.com.au/usr/solo-lo" class="PSEUDOLINK" _sp="p2506613.m2749.l2754"><span class="PSEUDOLINK">solo-lo<span class="clipped"> username, click for member's profile</span></span></a></dd></div>
            	var sellerNode = orders[order].querySelector('.ph-col__info-orderPackageDetails dd');
            	var sellerName = getInnerText(sellerNode.querySelector('span.PSEUDOLINK'), 'N/A').split('\n')[0];
            	console.log(sellerName);
                var sellerUrl = sellerNode.querySelector('a').getAttribute('href', 'N/A');
            	console.log(sellerUrl);
//                var purchaseDate = getInnerText(orders[order].querySelector('.order-row .purchase-header .row-date'), '');
            	var purchaseDate = getInnerText(orders[order].querySelector('.ph-col__info-orderDate dd'), 'N/A');
            	console.log(purchaseDate);
            	
                var orderItems = orders[order].querySelectorAll('.m-container-item-layout-row.m-container-item-layout-row__body');
//                var elapsedDays = dateDiff(dateParse(purchaseDate));

                var itemIndex = 1;

                for (item in orderItems) {
                    if (orderItems.hasOwnProperty(item)) {
//                    	<dl class="container-item-col__info-secondary "><dt>ITEM PRICE:</dt><dd><span class="BOLD">AU $9.55</span></dd></dl>
//                    	<div class="m-container-item-layout-row m-container-item-layout-row__body" data-listing-id="273025633530"><div class="container-item-col container-item-col-img"><a _sp="p2506613.m2749.l2648" href="https://www.ebay.com.au/itm/273025633530?var=572262383144" tabindex="-1" aria-hidden="true"><div class="m-image"><img src="https://ir.ebaystatic.com/cr/v/c1/s_1x2.gif" alt="Idler Timing Pulley 2GT20T Bore 3/4/5mm For 6/10mm Belt For 3D Printer Reprap" data-imgurl="https://i.ebayimg.com/images/g/WywAAOSwomVbAj~p/s-l140.jpg"></div></a></div><div class="container-item-col container-item-col-item-info"><div class="container-item-col__info-item-info-primary container-item-col__info-item-info-title"><div><a href="https://www.ebay.com.au/itm/273025633530?var=572262383144" class="nav-link" _sp="p2506613.m2749.l2649">Idler Timing Pulley 2GT20T Bore 3/4/5mm For 6/10mm Belt For 3D Printer Reprap</a></div></div><div class="container-item-col__info-item-info-primary container-item-col__info-item-info-listingId">(273025633530)</div><div class="container-item-col__info-item-info-primary container-item-col__info-item-info-aspectValuesList"><div>Teeth: with tooth</div><div>Bore: 3mm</div><div>Tooth Width: 7mm</div><div>Quantity: 2</div></div><div class="container-item-col__info-item-info-info container-item-col__info-item-info-deliveryEstimateMessage"><section aria-labelledby="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-12-1[0[0]]-34-35[0]-36-39-45-12-0-status" aria-roledescription="Notice" class="section-notice section-notice--information INFO notice-container" role="region"><div class="section-notice__header" id="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-12-1[0[0]]-34-35[0]-36-39-45-12-0-status"><svg class="icon icon--information-filled" focusable="false" aria-hidden="true"><use xlink:href="#icon-information-filled"></use></svg></div><span class="section-notice__main"><div class="container-item-col__info-item-info-notice"><p class="section-notice__title"> Estimated delivery Fri 10 Sep - Tue 12 Oct </p></div></span></section></div><div class="container-item-col__info-item-info-info container-item-col__info-item-info-ebayNote"><div class="inline-notice inline-notice--information notice-container"><span class="inline-notice__header" id="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-12-1[1[0]]-34-35[0]-37[0]-40-12-0-status"><svg class="icon icon--information-filled" focusable="false" aria-hidden="true"><use xlink:href="#icon-information-filled"></use></svg></span><span class="inline-notice__main"><div class="container-item-col__info-item-info-notice"><p>This item has been sent.</p></div></span></div></div><div class="container-item-col__info-item-info-note"><div class="m-notes-v1 note-wrap note-item-273025633530-25-07409-00292"><div class="note-cnt"><div class="textbox"><textarea aria-label="Add note" class="textbox__control" aria-describedby="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-m-notes-1-charCount" id="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-m-notes-1-noteLbl"></textarea></div><div class="note-cnt__edit-wrap"><span class="edit-note"><span class="edit-note__text"></span><button class="footer-action-button btn btn--transparent btn--secondary" data-action-name="EDIT_NOTE" aria-label="Edit note - Idler Timing Pulley 2GT20T Bore 3/4/5mm For 6/10mm Belt For 3D Printer Reprap" data-action="{&quot;_type&quot;:&quot;Action&quot;,&quot;type&quot;:&quot;OPERATION&quot;,&quot;name&quot;:&quot;EDIT_NOTE&quot;}" data-ebayui="" type="button">Edit note</button></span></div></div><div class="note-footer"><div class="sub-title" aria-live="assertive" aria-atomic="true" id="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-m-notes-1-charCount"><span class="error-msg"></span><span class="limit-msg"></span><span class="char-count-container" aria-hidden="true"><span class="char-count">0</span>/250</span><span class="clipped char-remaining" aria-hidden="false" aria-atomic="true" aria-live="assertive"></span></div><div class="action-wrap"><button class="footer-action-button btn btn--transparent btn--secondary" data-action-name="CANCEL_EDIT_NOTE" aria-label="Cancel editing note" data-action="{&quot;_type&quot;:&quot;Action&quot;,&quot;type&quot;:&quot;OPERATION&quot;,&quot;name&quot;:&quot;CANCEL_EDIT_NOTE&quot;}" data-ebayui="" type="button">Cancel</button><button class="footer-action-button btn btn--transparent btn--delete" data-action-name="DELETE_NOTE" aria-label="Delete note" data-action="{&quot;_type&quot;:&quot;Action&quot;,&quot;type&quot;:&quot;OPERATION&quot;,&quot;name&quot;:&quot;DELETE_NOTE&quot;,&quot;params&quot;:{&quot;note&quot;:null,&quot;itemId&quot;:null,&quot;variationId&quot;:null},&quot;URL&quot;:&quot;https://www.ebay.com.au/myb/DeleteNote&quot;}" data-ebayui="" type="button">Delete</button><button class="footer-action-button btn btn--primary" data-action-name="SAVE_NOTE" aria-label="Save note" data-action="{&quot;_type&quot;:&quot;Action&quot;,&quot;type&quot;:&quot;OPERATION&quot;,&quot;name&quot;:&quot;SAVE_NOTE&quot;,&quot;params&quot;:{&quot;note&quot;:null,&quot;itemId&quot;:null,&quot;variationId&quot;:null},&quot;URL&quot;:&quot;https://www.ebay.com.au/myb/SaveNote&quot;}" data-ebayui="" type="button">Save</button></div></div></div></div></div><div class="container-item-col container-item-col-orderTotal"><div class="container-item-col__info-secondary container-item-col__info-orderStatusIcons"><div class="status-icon"><span><span><span class="tooltip" id="nid-az2-38"><div class="tooltip__host myebay-sprite ph-sprite item-card-legend-icon icon-paid" aria-expanded="false" aria-controls="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[0]-38-21-overlay" aria-describedby="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[0]-38-21-overlay"></div><span class="clipped">Paid on 1 Aug 2021</span><span id="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[0]-38-21-overlay" class="tooltip__overlay" role="tooltip" style="transform:translateX(-50%);left:50%;right:auto;top:auto;bottom:calc(100% + 12px);"><span class="tooltip__pointer tooltip__pointer--bottom"></span><span class="tooltip__mask"><span class="tooltip__cell"><span class="tooltip__content"><p>Paid on 1 Aug 2021</p></span></span></span></span></span></span></span></div><div class="status-icon"><span><span><span class="tooltip" id="nid-az2-37"><div class="tooltip__host myebay-sprite ph-sprite item-card-legend-icon icon-shipped" aria-expanded="false" aria-controls="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[1]-38-21-overlay" aria-describedby="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[1]-38-21-overlay"></div><span class="clipped">Posted on 04/08/21</span><span id="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[1]-38-21-overlay" class="tooltip__overlay" role="tooltip" style="transform:translateX(-50%);left:50%;right:auto;top:auto;bottom:calc(100% + 12px);"><span class="tooltip__pointer tooltip__pointer--bottom"></span><span class="tooltip__mask"><span class="tooltip__cell"><span class="tooltip__content"><p>Posted on 04/08/21</p></span></span></span></span></span></span></span></div><div class="status-icon"><span><span><span class="tooltip" id="nid-az2-36"><div class="tooltip__host myebay-sprite ph-sprite item-card-legend-icon icon-feedback-left-disabled" aria-expanded="false" aria-controls="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[2]-38-21-overlay" aria-describedby="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[2]-38-21-overlay"></div><span class="clipped">Feedback needed</span><span id="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[2]-38-21-overlay" class="tooltip__overlay" role="tooltip" style="transform:translateX(-50%);left:50%;right:auto;top:auto;bottom:calc(100% + 12px);"><span class="tooltip__pointer tooltip__pointer--bottom"></span><span class="tooltip__mask"><span class="tooltip__cell"><span class="tooltip__content"><p>Feedback needed</p></span></span></span></span></span></span></span></div><div class="status-icon"><span><span><span class="tooltip" id="nid-az2-35"><div class="tooltip__host myebay-sprite ph-sprite item-card-legend-icon icon-feedback-rvd" aria-expanded="false" aria-controls="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[3]-38-21-overlay" aria-describedby="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[3]-38-21-overlay"></div><span class="clipped">Feedback received</span><span id="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-15-1[0[0]]-34-35[0]-37[3]-38-21-overlay" class="tooltip__overlay" role="tooltip" style="transform:translateX(-50%);left:50%;right:auto;top:auto;bottom:calc(100% + 12px);"><span class="tooltip__pointer tooltip__pointer--bottom"></span><span class="tooltip__mask"><span class="tooltip__cell"><span class="tooltip__content"><p>Feedback received</p></span></span></span></span></span></span></span></div></div><dl class="container-item-col__info-secondary container-item-col__info-additionalPrice"><dt>ITEM PRICE:</dt><dd><span class="BOLD">AU $6.90</span></dd></dl></div><div class="container-item-col container-item-col-cta"><div class="container-item-col-cta__item"><div class="m-cta"><a role="link" data-action="VIEW_SIMILAR_ITEMS" href="http://www.ebay.com.au/sch/sis.html?_nkw=Idler+Timing+Pulley+2GT20T+Bore+3%2F4%2F5mm+For+6%2F10mm+Belt+For+3D+Printer+Reprap&amp;_id=273025633530&amp;" class="default primary fake-btn fake-btn--fluid fake-btn--none fake-btn--primary" _sp="p2506613.m2749.l2658" data-ebayui="">View similar items<span class="clipped">Idler Timing Pulley 2GT20T Bore 3/4/5mm For 6/10mm Belt For 3D Printer Reprap</span></a></div></div><div class="container-item-col-cta__item"><div class="m-cta"><a role="link" data-action="VIEW_ORDER_DETAILS" href="https://www.ebay.com.au/vod/FetchOrderDetails?itemid=273025633530&amp;transId=2456251965017" class="default secondary fake-btn fake-btn--fluid fake-btn--none fake-btn--secondary" _sp="p2506613.m2749.l2673" data-ebayui="">View order details<span class="clipped">Idler Timing Pulley 2GT20T Bore 3/4/5mm For 6/10mm Belt For 3D Printer Reprap</span></a></div></div><div class="container-item-col-cta__item"><span class="fake-menu-button" id="nid-az2-34"><button class="fake-menu-button__button expand-btn" aria-expanded="false" aria-label="More actions - Idler Timing Pulley 2GT20T Bore 3/4/5mm For 6/10mm Belt For 3D Printer Reprap" data-ebayui="" type="button" aria-controls="nid-az2-34-content"><span class="expand-btn__cell"><span>More actions</span><svg class="icon icon--dropdown" focusable="false" aria-hidden="true"><use xlink:href="#icon-dropdown"></use></svg></span></button><span class="fake-menu-button__menu fake-menu-button__menu--reverse" tabindex="-1" id="nid-az2-34-content"><ul class="fake-menu__items" tabindex="-1" id="s0-0-33-0-m-containers[]-m-container-items-m-purchase-3[13]-3[0]-17-7-3-content-menu"><li><a class="fake-menu-button__item" href="http://www.ebay.com.au/sch/gbt-fastener/m.html?ssPageName=" data-action="SEE_SELLERS_OTHER_ITEMS" _sp="p2506613.m2749.l48398"><span>View seller's other items</span><svg class="icon icon--tick-small" focusable="false" aria-hidden="true"><use xlink:href="#icon-tick-small"></use></svg></a></li><li><button class="fake-menu-button__item" data-action="ADD_FAVORITE_SELLER" data-href="https://www.ebay.com.au/fol/follow?followType=user&amp;userName=gbt-fastener&amp;srt=01000600000050c88dfc59eb145d9aec65ebd5bda5621d4dd441adca151bfd222772513f7c05eec6bb9908825a8059b8f859cc1c5d494dc02f226ffa4d0fdd2abdc8bca9f6d47c96a0e06661aa427c1ba4a0d4ae1fc8ac&amp;ru=https%3A%2F%2Fwww.ebay.com.au%2Fmyb%2FSavedSellers%3FMyeBay%26Confirm%3D10%26CurrentPage%3DMyeBayFavoriteSellers" _sp="p2506613.m2749.l2656"><span>Save this seller</span><svg class="icon icon--tick-small" focusable="false" aria-hidden="true"><use xlink:href="#icon-tick-small"></use></svg></button></li><li><a class="fake-menu-button__item" href="https://contact.ebay.com.au/ws/eBayISAPI.dll?ShowSellerFAQ&amp;redirect=0&amp;requested=gbt-fastener&amp;iid=273025633530&amp;transId=2456251965017" data-action="CONTACT_SELLER" _sp="p2506613.m2749.l2652"><span>Contact seller</span><svg class="icon icon--tick-small" focusable="false" aria-hidden="true"><use xlink:href="#icon-tick-small"></use></svg></a></li><li><a class="fake-menu-button__item" href="https://contact.ebay.com.au/ws/eBayISAPI.dll?ShowSellerFAQ&amp;redirect=0&amp;requested=gbt-fastener&amp;iid=273025633530&amp;transId=2456251965017" data-action="CONTACT_SELLER" _sp="p2506613.m2749.l2652"><span>Contact seller</span><svg class="icon icon--tick-small" focusable="false" aria-hidden="true"><use xlink:href="#icon-tick-small"></use></svg></a></li><li><a class="fake-menu-button__item" href="http://www.ebay.com.au/sch/gbt-fastener/m.html?ssPageName=" data-action="VIEW_SELLERS_OTHER_ITEMS" _sp="p2506613.m2749.l2654"><span>View seller's other items</span><svg class="icon icon--tick-small" focusable="false" aria-hidden="true"><use xlink:href="#icon-tick-small"></use></svg></a></li><li><button class="fake-menu-button__item" data-action="ADD_FAVORITE_SELLER" data-href="https://www.ebay.com.au/fol/follow?followType=user&amp;userName=gbt-fastener&amp;srt=010006000000506f5eadfa7742d581141824a659933b52779510a1edbc40904fac0a1bdf8c14dcf42040beb7aa5105c82b92c29d5a5ef8e2285e70351df9dde59a30c36d99fa817a97ef9eabf669d980f1b9e6dca9d880&amp;ru=https%3A%2F%2Fwww.ebay.com.au%2Fmyb%2FSavedSellers%3FMyeBay%26Confirm%3D10%26CurrentPage%3DMyeBayFavoriteSellers" _sp="p2506613.m2749.l2656"><span>Save this seller</span><svg class="icon icon--tick-small" focusable="false" aria-hidden="true"><use xlink:href="#icon-tick-small"></use></svg></button></li></ul></span></span></div><div class="container-item-col__cta-item note-label-wrap note-label-273025633530-25-07409-00292"><div class="note-header"><span class="note-header__action"><div class="m-cta"><button role="button" data-href="#" accesskey="" class="expand-btn--borderless note-link btn btn--none btn--secondary" data-template="ADD_EDIT_NOTE_TEMPLATE" data-params="{&quot;note&quot;:null,&quot;itemId&quot;:&quot;273025633530&quot;,&quot;variationId&quot;:&quot;572262383144&quot;,&quot;transactionId&quot;:&quot;2456251965017&quot;}" data-ebayui="" type="button">Add note<span class="m-sel-count"></span><span class="clipped">- Idler Timing Pulley 2GT20T Bore 3/4/5mm For 6/10mm Belt For 3D Printer Reprap</span></button></div></span></div></div></div></div>

                        var purchasePrice = getInnerText(orderItems[item].querySelector('.container-item-col__info-additionalPrice dd span'), 'N/A');
                    	console.log('  ' + itemIndex + ' ' + purchasePrice);
                        var itemSpec = getInnerText(orderItems[item].querySelector('.container-item-col__info-item-info-title div a'), 'N/A');
                    	console.log('  ' + itemIndex + ' ' + itemSpec);
//                    	<div class="container-item-col__info-item-info-primary container-item-col__info-item-info-aspectValuesList"><div>Perimeter: 220mm</div><div>Width: 6mm</div><div>Quantity: 4</div></div>
                        var itemAspectValuesListNode = orderItems[item].querySelector('.container-item-col__info-item-info-aspectValuesList');
//                        console.log(itemAspectValuesListNode)
                        var itemAspectValues = {'Quantity': '1'};
                        if (itemAspectValuesListNode) {
	                        for (itemAspectValueNode of itemAspectValuesListNode.children) {
	                        	aspectValue = getInnerText(itemAspectValueNode);
	                        	if (aspectValue) {
	                        		parts = aspectValue.split(':');
	                        		itemAspectValues[parts[0]] = parts[1].trim()
	                        	}
	                        }
                        }
                        
                        var desc = itemSpec
                        var itemAspect = '';
                        var keys = Object.keys(itemAspectValues);
                        keys.forEach(key=>{
                        	if (itemAspect != '') {
                        		itemAspect += ',';
                        	}
                        	itemAspect += key + '=' + itemAspectValues[key];
                        	if (key != 'Quantity') {
                        		desc += ', ' + key + ':' + itemAspectValues[key];
                        }
                        });
                        console.log('  ' + itemIndex + ': ' + itemAspect);
//                        var deliveryDate = getInnerText(orderItems[item].querySelector('.item-spec-r .delivery-date strong'),
//                                '');
//
//                        var trackingEl = orderItems[item].querySelector('.item-spec-r .tracking-label a');
//                        var trackingNo = getInnerText(trackingEl, '').replace(getAttribute(trackingEl, 'title', ''), '')
//                                .replace(/[^\S]*/g, '');
//                        var trackingNoUrl = getDataset(trackingEl, 'url', '');
//
//                        var etaDays = dateDiff(dateParse(deliveryDate.replace(/.*-\s*/g, '')), -1);
// 
//                        var shipStatus = getAttribute(orderItems[item]
//                                .querySelector('.purchase-info-col .order-status .ph-ship'), 'title', '');
//                        var feedbackNotLeft = orderItems[item]
//                                .querySelector('.purchase-info-col .order-status .ph-fbl.feedbackNotLeft');
//                        var quantity = getInnerText(orderItems[item].querySelector('.qa'), "1");
//
//                        var thumbnail = getAttribute(orderItems[item].querySelector('.picCol .lazy-img'), 'src', '');
//
                        
                        data.push({
                            orderId : orderId,
                            seller : {
                                name : sellerName,
                                url : sellerUrl
                            },
                            itemIndex : itemIndex,
                            purchaseDate : purchaseDate,
//                            elapsedDays : elapsedDays,
                            price : purchasePrice,
//                            quantity : quantity.replace(/[\D]+/g, ''),
                            specs : desc,
                            itemAspectValues : itemAspectValues,
//                            deliveryDate : deliveryDate,
//                            etaDays : etaDays,
//                            shipStatus : shipStatus.replace(/.*?([\d\/]+)/g, '$1'),
//                            feedbackNotLeft : null !== feedbackNotLeft,
//                            thumbnail : thumbnail,
//                            trackingNo : {
//                                name : trackingNo,
//                                url : trackingNoUrl
//                            }
                        });

                        itemIndex += 1;
                    }
                }
            }
        }

        return data;
    }

    /**
     * Sort the give data array
     * 
     * @since 1.0
     * @param {Array}
     *            data - The array to sort
     * @return {Array} Returns the sorted array
     */
    function sort(data) {
        // sort the result
        if (sortby.length) {
            // sort by non-date field
            var sortByText = function(a, b) {
                return reverseorder ? a[sortby] < b[sortby] : a[sortby] > b[sortby];
            };

            // sort by date field
            var sortByDate = function(a, b) {
                var date1 = dateParse(a[sortby].replace(/.*-\s*/g, ''));
                var date2 = dateParse(b[sortby].replace(/.*-\s*/g, ''));

                return reverseorder ? date2 - date1 : date1 - date2;
            };

            // sort by number
            var sortByNumeric = function(a, b) {
                var num1 = parseFloat(String(a[sortby]).replace(/[^\d.\-]+/g, ''));
                var num2 = parseFloat(String(b[sortby]).replace(/[^\d.\-]+/g, ''));
                num1 = isNaN(num1) ? 0 : num1;
                num2 = isNaN(num2) ? 0 : num2;

                return reverseorder ? num2 - num1 : num1 - num2;
            };

            var sortBySeller = function(a, b) {
                return reverseorder ? a[sortby]["name"] < b[sortby]["name"] : a[sortby]["name"] > b[sortby]["name"];
            };

            if ('price' == sortby || 'elapsedDays' == sortby || 'etaDays' == sortby) {
                data.sort(sortByNumeric);
            } else if ('seller' == sortby) {
                data.sort(sortBySeller);
            } else if ('purchaseDate' != sortby && 'deliveryDate' != sortby && 'shipStatus' != sortby) {
                data.sort(sortByText);
            } else {
                data.sort(sortByDate);
            }
        }

        return data;
    }

    /**
     * Apply the custom filter to the data array
     * 
     * @since 1.0
     * @param {Array}
     *            data - The array to sort
     * @return {Array} Returns the sorted array
     */
    function applyCustomFilter(data) {
        var result = [];
        if (null !== customFilter && customFilter.length) {
            var i;
            for (i = 0; i < data.length; i += 1) {
                switch (customFilter) {
                case "notShipped":
                    if (isNaN(dateParse(data[i].shipStatus)))
                        result.push(data[i]);
                    break;
                }
            }
        } else {
            result = data;
        }

        return result;
    }

    /**
     * Query the eBay purchase history filters from the current page
     * 
     * @since 1.0
     * @return {Array} Returns an array of the filters
     */
    function getEbayFilters() {
        var filters = document.querySelectorAll('#orders .filter');

        if (!filters.length) {
            return false;
        }

        var result = [], f;

        Array.prototype.forEach.call(filters, function(filter, index) {
            f = {
                label : getInnerText(filter.querySelector('.filter-label')),
                content : getInnerText(filter.querySelector('.filter-content'))
            };
            result.push(f);
        });

        var itemPage = document.querySelector('#orders .num-items-page');
        if (null !== itemPage) {
            f = {
                label : getInnerText(itemPage.querySelector('span')),
                content : getInnerText(itemPage.querySelector('li>span[title=selected]'))
            };
            result.push(f);
        }

        return result;
    }

    /**
     * Get the data sorted by the given column order
     * 
     * @since 1.0
     * @return {Array} Returns an array of order items
     */
    this.get_data = function() {
        var data = prepare();
        if (false !== data) {
            data = applyCustomFilter(data);
            data = sort(data);
        }

        return {
            orders : data,
            filters : getEbayFilters()
        };
    };
}

/**
 * Content script helper class for the eBay purchase history page
 * 
 * @class
 * @author Eugen Mihailescu
 * @since 1.0
 */
function EbayPurchaseHistory() {
    /**
     * Get the report data and push it to the background script
     * 
     * @since 1.0
     * @param {Object=}
     *            params - Optional. An object of parameters to pass to the report.
     */
    function onButtonClick(params) {
        params = params || {
            sortby : "",
            customFilter : "",
            reverseorder : false
        };

        var ebay_report = new QuickReport(params);

        // get the report data
        var data = ebay_report.get_data();

        // push the data to the web extension
        agent.runtime.sendMessage({
            reportData : {
                orders : data.orders,
                filters : data.filters,
                sortby : params.sortBy,
                customFilter : params.customFilter,
                reverseorder : params.reverseorder,
                tabId : params.hasOwnProperty('tabId') ? params.tabId : null
            }
        });
    }

    /**
     * Sends the order item URL to the background script
     * 
     * @since 1.0
     * @param {Object}
     *            params - An Object describing what order item to query. Default to false.
     */
    function onShowItem(params) {
        params = params || false;

        if (!params)
            return;

        var orders = document.querySelectorAll('#orders .result-set-r .order-r');
        if (null !== orders) {
            Array.prototype.forEach.call(orders, function(order, index) {
                var found = order.querySelector('input[type="checkbox"][data-orderid="' + params.showItem.orderId + '"');
                if (null !== found) {
                    var orderItems = order.querySelectorAll('.item-level-wrap');
                    var i;
                    if (null !== orderItems) {
                        Array.prototype.forEach.call(orderItems, function(value, index) {
                            if (index === params.showItem.index - 1) {
                                var link = value.querySelector('.item-spec-r .item-title');
                                if (null !== link) {
                                    agent.runtime.sendMessage({
                                        showEbayItem : true,
                                        url : link.getAttribute("href")
                                    });
                                }
                                return;
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * Creates the `Quick report` link at DOM level
     * 
     * @since 1.0
     * @param {Object}
     *            parent - The parent element where the link is appended
     * @param {String}
     *            classname - The link CSS class name
     * @returns {Object} - Returns the newly created element
     */
    function createButton(parent, classname) {
        var button = parent.querySelector("." + classname);

        if (null === button) {
            button = document.createElement('a');
            button.innerHTML = "Quick Report";
            button.setAttribute("class", classname);
            button.setAttribute("href", "#");
            button.setAttribute("style", "float:right;padding:3px;background-color:#FFD700;color:#000");
            button.addEventListener("click", function(event) {
                onButtonClick();
            });
            parent.appendChild(button);
        }

        return button;
    }

    // inject the Report button into the eBay purchase history page
//mb    var parent = document.querySelector('#orders .container-header');
    var parent = document.querySelector('.title-container h2');
    if (parent) {

        var button_class = "ebay-purchase-report";

        createButton(parent, button_class);

        // respawn the button whenever is necessary
        var observer = new MutationObserver(function(mutations) {
            createButton(parent, button_class);
        });

        // start monitoring the any DOM changes of parent's childList only
        observer.observe(parent, {
            childList : true
        });
    }

    /**
     * Listen for messages from the background script
     */
    agent.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.hasOwnProperty('sortBy') || request.hasOwnProperty('customFilter')) {
            onButtonClick(request);
        }

        if (request.hasOwnProperty('showItem')) {
            onShowItem(request);
        }
    });
}

/**
 * Content script helper class for the eBay item detail page
 * 
 * @class
 * @author Eugen Mihailescu
 * @since 1.0.17
 */
function EbayItemPage() {
    /**
     * Get the current add-on's UI options
     * 
     * @since 1.0
     * @param {String}
     *            options - The session stored options
     * @returns {Object} Returns an object containing the UI options
     */
    function get_ui_options(options) {
        var result = {};

        try {
            result = JSON.parse(options);
        } catch (e) {
            result = {
                feedbackScore : 1000,
                csvSeparator : "tab"
            };
        }

        return result;
    }

    var responseCallback = function(response) {
        // inject the Report button into the eBay purchase history page
        var scoreDiv = document.querySelector('#CenterPanel #CenterPanelInternal #RightSummaryPanel .si-content div');

        if (null !== scoreDiv) {

            var scoreElement = scoreDiv.querySelector('span.mbg-l a');
            if (null !== scoreElement) {
                var scoreValue = parseInt(scoreElement.innerText);
                var ui_options = get_ui_options(response.ui_options);

                if (scoreValue < ui_options.feedbackScore) {
                    var defaultBgColor = scoreDiv.style.backgroundColor;
                    setInterval(function() {
                        if (scoreDiv.style.backgroundColor == defaultBgColor) {
                            scoreDiv.style.backgroundColor = "#FF0000";
                            scoreDiv.style.transition = "background-color 0.3s ease";
                        } else {
                            scoreDiv.style.backgroundColor = defaultBgColor;
                        }
                    }, 1000);
                }
            }
        }
    };

    var promise = agent.runtime.sendMessage({
        getUIOptions : true,
    }, responseCallback);

    // on non-Chrome browsers use the promise
    if ("undefined" === typeof chrome) {
        promise.then(responseCallback);
    }
}

EbayPurchaseHistory();

EbayItemPage();